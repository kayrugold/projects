import test from 'node:test';
import assert from 'node:assert/strict';
import { localDatabase } from '../community/local.mjs';
import { handleCommunity, canonical, hex } from '../community/api.mjs';
const origin='http://127.0.0.1:5173';
async function identity(){const keys=await crypto.subtle.generateKey({name:'ECDSA',namedCurve:'P-256'},true,['sign','verify']);const bytes=await crypto.subtle.exportKey('spki',keys.publicKey);return {...keys,encoded:Buffer.from(bytes).toString('base64'),id:hex(await crypto.subtle.digest('SHA-256',bytes))};}
async function request(person,path,data,overrides={}){const body=JSON.stringify(data),time=String(Date.now()),nonce=crypto.randomUUID(),url=`/api/community/${path}`;const sig=await crypto.subtle.sign({name:'ECDSA',hash:'SHA-256'},person.privateKey,new TextEncoder().encode(canonical('POST',url,time,nonce,body)));return new Request(origin+url,{method:'POST',headers:{origin,'content-type':'application/json','x-studio-key':person.encoded,'x-studio-signature':Buffer.from(sig).toString('base64'),'x-studio-time':time,'x-studio-nonce':nonce,...overrides},body});}
async function fixture(){const DB=await localDatabase(),member=await identity(),moderator=await identity(),env={DB,LOCAL_PREVIEW:true,MODERATOR_KEY_ID:moderator.id};for(const p of [member,moderator])assert.equal((await handleCommunity(await request(p,'join',{}),env)).status,200);return {DB,member,moderator,env};}
test('signed posts persist, HTML stays text, thread replies and bug status work',async()=>{const {DB,member,moderator,env}=await fixture();try{const posted=await handleCommunity(await request(member,'entry',{kind:'bug',title:'Zoom issue',project:'Infinite Drafting',body:'<script>alert(1)</script>'}),env);assert.equal(posted.status,201);const {id}=await posted.json();assert.equal((await handleCommunity(await request(member,'entry',{kind:'reply',parent:id,body:'I can reproduce this.'}),env)).status,201);assert.equal((await handleCommunity(await request(moderator,'moderate',{action:'status',id,status:'investigating'}),env)).status,200);const data=await (await handleCommunity(new Request(origin+'/api/community/entries?kind=bug'),env)).json();assert.equal(data.entries[0].status,'investigating');assert.equal(data.entries[0].body,'<script>alert(1)</script>');assert.equal(data.entries[0].replies,1);}finally{DB.close();}});
test('altered signatures, expired requests, cross-origin writes, and replay are rejected',async()=>{const {DB,member,env}=await fixture();try{const signed=await request(member,'entry',{kind:'chat',body:'hello'});const replay=signed.clone();assert.equal((await handleCommunity(signed,env)).status,201);assert.equal((await handleCommunity(replay,env)).status,409);assert.equal((await handleCommunity(await request(member,'entry',{kind:'chat',body:'hi'},{'x-studio-signature':'AAAA'}),env)).status,401);assert.equal((await handleCommunity(await request(member,'entry',{kind:'chat',body:'hi'},{'x-studio-time':'1000000000000'}),env)).status,401);assert.equal((await handleCommunity(await request(member,'entry',{kind:'chat',body:'hi'},{origin:'https://attacker.example'}),env)).status,403);}finally{DB.close();}});
test('moderation permissions, flags, hidden threads, and bans are enforced on server',async()=>{const {DB,member,moderator,env}=await fixture();try{const {id}=await (await handleCommunity(await request(member,'entry',{kind:'forum',title:'A test topic',body:'hello'}),env)).json();assert.equal((await handleCommunity(await request(member,'moderate',{action:'hide',id}),env)).status,403);assert.equal((await handleCommunity(await request(member,'flag',{id}),env)).status,200);assert.equal((await (await handleCommunity(await request(moderator,'flags',{}),env)).json()).entries.length,1);assert.equal((await handleCommunity(await request(moderator,'moderate',{action:'hide',id}),env)).status,200);assert.equal((await handleCommunity(await request(member,'entry',{kind:'reply',parent:id,body:'hello'}),env)).status,404);assert.equal((await handleCommunity(await request(moderator,'moderate',{action:'ban',author:member.id}),env)).status,200);assert.equal((await handleCommunity(await request(member,'entry',{kind:'chat',body:'hello'}),env)).status,403);}finally{DB.close();}});
test('production cannot silently fall back to preview or bypass Turnstile',async()=>{const DB=await localDatabase(),p=await identity();try{assert.equal((await handleCommunity(await request(p,'join',{}),{DB,LOCAL_PREVIEW:'true'})).status,503);const env={DB,SITE_ORIGIN:origin,TURNSTILE_SECRET:'test',TURNSTILE_SITE_KEY:'test',ABUSE_SALT:'test'};assert.equal((await handleCommunity(await request(p,'join',{}, {'cf-connecting-ip':'192.0.2.1'}),env)).status,403);}finally{DB.close();}});
test('unregistered keys, invalid replies, oversized posts, and burst flooding fail',async()=>{const {DB,member,env}=await fixture();try{const unknown=await identity();assert.equal((await handleCommunity(await request(unknown,'entry',{kind:'chat',body:'hello'}),env)).status,401);assert.equal((await handleCommunity(await request(member,'entry',{kind:'reply',parent:crypto.randomUUID(),body:'hello'}),env)).status,404);assert.equal((await handleCommunity(await request(member,'entry',{kind:'chat',body:'x'.repeat(1001)}),env)).status,400);assert.equal((await handleCommunity(await request(member,'entry',{kind:'chat',body:'x'.repeat(17000)}),env)).status,413);let last;for(let i=0;i<13;i++)last=await handleCommunity(await request(member,'entry',{kind:'chat',body:'hello'}),env);assert.equal(last.status,429);}finally{DB.close();}});
test('article discussions remain scoped while appearing in the shared directory',async()=>{const {DB,member,env}=await fixture();try{for(const project of ['article:one','article:two'])assert.equal((await handleCommunity(await request(member,'entry',{kind:'discussion',project,title:'A reader question',body:'A useful discovery.'}),env)).status,201);const scoped=await (await handleCommunity(new Request(origin+'/api/community/entries?kind=discussion&project=article%3Aone'),env)).json();assert.equal(scoped.entries.length,1);assert.equal(scoped.entries[0].project,'article:one');const all=await (await handleCommunity(new Request(origin+'/api/community/entries?kind=discussion'),env)).json();assert.equal(all.entries.length,2);}finally{DB.close();}});

test('deletion is owner-or-moderator only, permanent, and preserves replies',async()=>{const {DB,member,moderator,env}=await fixture();try{
 const send=async(p,path,data)=>handleCommunity(await request(p,path,data),env);
 const {id}=await (await send(member,'entry',{kind:'forum',title:'Delete my topic',body:'private draft text'})).json();
 const {id:replyId}=await (await send(moderator,'entry',{kind:'reply',parent:id,body:'Someone else replied'})).json();
 assert.equal((await send(member,'delete',{id:replyId})).status,403);
 await send(moderator,'flag',{id});
 assert.equal((await send(member,'delete',{id})).status,200);
 const removed=await DB.prepare('SELECT * FROM community_entries WHERE id=?').bind(id).first();assert.equal(removed.body,'');assert.equal(removed.title,'');assert.equal(removed.deleted,1);
 assert.equal((await DB.prepare('SELECT * FROM entries WHERE id=?').bind(replyId).first()).body,'Someone else replied');
 assert.equal((await DB.prepare('SELECT COUNT(*) AS n FROM flags WHERE entry=?').bind(id).first()).n,0);
 assert.equal((await send(moderator,'moderate',{action:'restore',id})).status,200);
 assert.equal((await DB.prepare('SELECT deleted FROM community_entries WHERE id=?').bind(id).first()).deleted,1);
 assert.equal((await send(moderator,'delete',{id:replyId})).status,200);
 assert.equal((await send(member,'flag',{id})).status,404);
 }finally{DB.close();}});

test('moderator desk, feature controls, locks, restoration and report resolution',async()=>{const {DB,member,moderator,env}=await fixture();try{
 const send=async(p,path,data)=>handleCommunity(await request(p,path,data),env);
 const {id}=await (await send(member,'entry',{kind:'forum',title:'Older pinned topic',body:'A topic'})).json();
 await send(member,'entry',{kind:'forum',title:'Newer topic',body:'Another topic'});
 assert.equal((await send(member,'desk',{view:'all'})).status,403);
 for(const action of ['pin','highlight','lock'])assert.equal((await send(moderator,'moderate',{action,id,enabled:true})).status,200);
 assert.equal((await send(member,'entry',{kind:'reply',parent:id,body:'Blocked'})).status,403);
 const feed=await (await handleCommunity(new Request(origin+'/api/community/entries?kind=forum'),env)).json();assert.equal(feed.entries[0].id,id);assert.equal(feed.entries[0].highlighted,1);
 await send(member,'flag',{id});assert.equal((await (await send(moderator,'desk',{view:'reported'})).json()).entries.length,1);
 await send(moderator,'moderate',{action:'resolve',id});assert.equal((await (await send(moderator,'desk',{view:'reported'})).json()).entries.length,0);
 await send(moderator,'moderate',{action:'hide',id});assert.equal((await (await send(moderator,'desk',{view:'hidden'})).json()).entries[0].id,id);
 await send(moderator,'moderate',{action:'restore',id});await send(moderator,'moderate',{action:'lock',id,enabled:false});
 assert.equal((await send(member,'entry',{kind:'reply',parent:id,body:'Allowed again'})).status,201);
 }finally{DB.close();}});

test('self-suspension is rejected and suspended users can be restored or delete own content',async()=>{const {DB,member,moderator,env}=await fixture();try{
 const send=async(p,path,data)=>handleCommunity(await request(p,path,data),env);
 const {id}=await (await send(member,'entry',{kind:'chat',body:'Remove me'})).json();
 assert.equal((await send(moderator,'moderate',{action:'ban',author:moderator.id})).status,400);
 await send(moderator,'moderate',{action:'ban',author:member.id});
 assert.equal((await (await send(moderator,'desk',{view:'suspended'})).json()).members[0].id,member.id);
 assert.equal((await send(member,'delete',{id})).status,200);
 await send(moderator,'moderate',{action:'unban',author:member.id});
 assert.equal((await send(member,'entry',{kind:'chat',body:'Back again'})).status,201);
 }finally{DB.close();}});
