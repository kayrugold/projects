import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import { communityRequest, createIdentity, loadIdentity, exportIdentity, restoreIdentity, type Identity, type Entry, type Configuration } from '../utils/community';
import { terminalProjects } from '../data/terminalCatalog';
import { chroniclesData } from '../data/chronicles';
const scopes = [{id:'Studio',title:'Studio'}, ...terminalProjects.map(p=>({id:p.title,title:p.title})), ...chroniclesData.map(p=>({id:`article:${p.id}`,title:p.title}))];
const scopeTitle = (id:string) => scopes.find(s=>s.id===id)?.title || id;
import './community.css';
const CommunityContext = createContext<{ identity:Identity|null; setIdentity:(i:Identity)=>void; config:Configuration|null; error:string; retry:()=>void }>({ identity:null,setIdentity:()=>{},config:null,error:'',retry:()=>{} });
export function CommunityProvider({children}:{children:React.ReactNode}) {
  const [identity,setIdentity]=useState<Identity|null>(null), [config,setConfig]=useState<Configuration|null>(null), [error,setError]=useState('');
  const retry=()=>{ setError(''); communityRequest('config').then(setConfig).catch(e=>setError(e.message)); };
  useEffect(()=>{ retry(); loadIdentity().then(setIdentity).catch(e=>setError(e.message)); },[]);
  return <CommunityContext.Provider value={{identity,setIdentity,config,error,retry}}>{children}</CommunityContext.Provider>;
}
const raven = (id:string) => `Raven ${id.slice(0,8)}`;
const when = (date:number) => new Date(date).toLocaleString([], { month:'short', day:'numeric', hour:'2-digit', minute:'2-digit' });
function IdentityPanel() {
  const {identity,setIdentity,config,error,retry}=useContext(CommunityContext);
  const [notice,setNotice]=useState(''), [busy,setBusy]=useState(false), [password,setPassword]=useState(''), [token,setToken]=useState('');
  const [joined,setJoined]=useState(false), [attempt,setAttempt]=useState(0), [expanded,setExpanded]=useState(false);
  const widget=useRef<HTMLDivElement>(null), file=useRef<HTMLInputElement>(null);
  useEffect(()=>{
    if (!config?.siteKey || joined || !expanded) return;
    let cancelled=false, id:string|undefined;
    const render=()=>{ const api=(window as any).turnstile; if (cancelled || !api || !widget.current) return; id=api.render(widget.current,{sitekey:config.siteKey,action:'community-join',callback:setToken,'expired-callback':()=>setToken(''),'error-callback':()=>{setToken('');setNotice('Human check unavailable. Please retry.');}}); };
    let script=document.querySelector<HTMLScriptElement>('script[data-community-turnstile]');
    if ((window as any).turnstile) render();
    else { if(!script){script=document.createElement('script');script.src='https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';script.dataset.communityTurnstile='true';script.async=true;document.head.appendChild(script);} script.addEventListener('load',render); }
    return ()=>{cancelled=true;script?.removeEventListener('load',render);if(id)(window as any).turnstile?.remove(id);};
  },[config?.siteKey,joined,attempt,expanded]);
  async function run(action:()=>Promise<void>) {setBusy(true);setNotice('');try{await action();}catch(e){setNotice((e as Error).message);}finally{setBusy(false);}}
  return <details className="community-identity" onToggle={e=>setExpanded(e.currentTarget.open)}>
    <summary>{identity ? `◇ ${raven(identity.id)} · identity & recovery` : '◇ Join the conversation · identity & recovery'}</summary>
    <p>Your browser holds your private key. The studio stores its public fingerprint to recognize your posts. These keys are for this community; Xyrtania account linking is not connected.</p>
    {config?.local && <p className="community-mode">LOCAL PREVIEW · Posts stay on this computer. Human checks are disabled only in this loopback preview.</p>}
    {error && <p role="status">{error} <button className="studio-text-link" onClick={retry}>Retry connection</button></p>}
    <div ref={widget} />
    <button className="studio-button" disabled={busy || !config || (!config.local && !token && !joined)} onClick={()=>run(async()=>{const next=identity || await createIdentity();setIdentity(next);try{await communityRequest('join',{token},next);setJoined(true);setNotice('Identity ready. You can post in any board or chat.');}catch(e){setToken('');setAttempt(v=>v+1);throw e;}})}>{identity ? 'Connect this identity' : 'Create my identity'}</button>
    {identity && <><p className="community-fingerprint">Fingerprint: {identity.id}</p><p>Keep a recovery file before clearing browser data or changing devices. Without your key or backup, there is no email reset.</p></>}
    <label>Recovery password (12+ characters)<input type="password" autoComplete="new-password" minLength={12} value={password} onChange={e=>setPassword(e.target.value)} placeholder="Used only to lock or unlock your file" /></label>
    <div className="studio-actions">{identity && <button className="studio-button" disabled={busy || password.length<12} onClick={()=>run(async()=>{await exportIdentity(identity,password);setPassword('');setNotice('Encrypted recovery file downloaded. Keep its password separately.');})}>Download recovery file</button>}<button className="studio-button" disabled={busy || password.length<12} onClick={()=>file.current?.click()}>Restore recovery file</button></div>
    <input ref={file} type="file" accept="application/json,.json" hidden onChange={e=>{const selected=e.target.files?.[0];if(selected)run(async()=>{const next=await restoreIdentity(selected,password);setIdentity(next);setPassword('');setJoined(false);setNotice('Identity restored. Connect it before posting.');});e.target.value='';}} />
    <p className="community-note">Posts and fingerprints are public. Hosting and anti-abuse services process network information. Keep personal information out of messages.</p>
    <p role="status">{busy ? 'Working…' : notice}</p>
  </details>;
}
function useEntries(kind:string,parent?:string,entryId?:string,scope?:string) {
  const {config}=useContext(CommunityContext), [entries,setEntries]=useState<Entry[]>([]), [error,setError]=useState(''), [loading,setLoading]=useState(true);
  const generation=useRef(0);
  async function refresh(){const current=++generation.current;if(!config){setLoading(false);return;}try{const data=await communityRequest(`entries?kind=${kind}${parent?`&parent=${encodeURIComponent(parent)}`:''}${entryId?`&id=${encodeURIComponent(entryId)}`:''}${scope?`&project=${encodeURIComponent(scope)}`:''}`);if(current===generation.current){setEntries(data.entries);setError('');}}catch(e){if(current===generation.current)setError((e as Error).message);}finally{if(current===generation.current)setLoading(false);}}
  useEffect(()=>{setEntries([]);setLoading(true);refresh();const timer=setInterval(()=>{if(kind==='chat' && document.visibilityState==='visible')refresh();},8000);return()=>{clearInterval(timer);generation.current++;};},[kind,parent,entryId,scope,config]);
  return {entries,error,loading,refresh};
}
function Composer({kind,parent,project='Studio',fixedProject=false,onPosted}:{key?:React.Key;kind:string;parent?:string;project?:string;fixedProject?:boolean;onPosted:()=>void}) {
  const {identity,config}=useContext(CommunityContext), [title,setTitle]=useState(''), [body,setBody]=useState(''), [selected,setSelected]=useState(project), [notice,setNotice]=useState(''), [busy,setBusy]=useState(false);
  const short=kind==='chat'||kind==='reply';
  return <form className="community-compose" onSubmit={async e=>{e.preventDefault();setBusy(true);setNotice('');try{await communityRequest('entry',{kind,parent,project:selected,title,body},identity!);setTitle('');setBody('');onPosted();setNotice('Posted.');}catch(e){setNotice((e as Error).message);}finally{setBusy(false);}}}>
    {!short && <>{!fixedProject && <label>Subject<select value={selected} onChange={e=>setSelected(e.target.value)}>{scopes.map(p=><option key={p.id} value={p.id}>{p.title}</option>)}</select></label>}<label>{kind==='bug'?'Bug summary':'Topic title'}<input required minLength={3} maxLength={140} value={title} onChange={e=>setTitle(e.target.value)} placeholder={kind==='bug'?'What is going wrong?':'Start a conversation…'} /></label></>}
    <label>{kind==='chat'?'Message':kind==='reply'?'Your reply':'Your post'}<textarea required maxLength={kind==='chat'?1000:6000} rows={kind==='chat'?2:4} value={body} onChange={e=>setBody(e.target.value)} placeholder={kind==='bug'?'Steps to reproduce:\nExpected result:\nWhat actually happened:\nApp version / device (optional):':kind==='chat'?'Pull up a chair. What are you working on?':'Share a question, an idea, or something you discovered.'} /></label>
    <button className="drafting-button" disabled={busy || !identity || !config || !body.trim() || (!short && title.trim().length<3)}>{busy?'Posting…':kind==='chat'?'Send message':kind==='reply'?'Post reply':kind==='bug'?'File bug report':'Publish topic'}</button>
    {!identity && <p className="community-note">Open “Join the conversation” above to create or restore your identity. Reading is open to everyone.</p>}<p role="status">{notice}</p>
  </form>;
}
function Post({entry,onChange}:{key?:React.Key;entry:Entry;onChange:()=>void}) {
  const {identity,config}=useContext(CommunityContext), [notice,setNotice]=useState('');
  const moderator=!!identity && identity.id===config?.moderator;
  const action=async(path:string,data:unknown)=>{try{await communityRequest(path,data,identity!);setNotice(path==='flag'?'Flagged for Andy to review.':'Updated.');onChange();}catch(e){setNotice((e as Error).message);}};
  return <article className="community-post"><div className="community-meta"><span title={entry.author}>{raven(entry.author)}{entry.author===config?.moderator?' · ANDY / MODERATOR':''}</span><time dateTime={new Date(entry.created).toISOString()}>{when(entry.created)}</time></div>{entry.title && <h4>{entry.title}</h4>}<p className="community-body">{entry.body}</p><div className="community-post-actions">{identity && <button onClick={()=>action('flag',{id:entry.id})}>Report abuse</button>}{moderator && <><button onClick={()=>action('moderate',{action:'hide',id:entry.id})}>Hide post</button><button onClick={()=>{if(window.confirm(`Suspend ${raven(entry.author)} from posting?`))action('moderate',{action:'ban',author:entry.author});}}>Suspend author</button>{entry.kind==='bug' && <label>Bug status<select value={entry.status} onChange={e=>action('moderate',{action:'status',id:entry.id,status:e.target.value})}>{['open','investigating','planned','fixed','closed'].map(s=><option key={s}>{s}</option>)}</select></label>}</>}</div><span role="status">{notice}</span></article>;
}
function Thread({entry,onBack}:{entry:Entry;onBack:()=>void}) {
  const {entries,error,loading,refresh}=useEntries('reply',entry.id);
  const [shareNotice,setShareNotice]=useState('');
  return <section className="community-thread"><button className="studio-text-link" onClick={onBack}>← Back to board</button><button className="studio-text-link" onClick={async()=>{try{await navigator.clipboard.writeText(location.href);setShareNotice('Thread link copied.');}catch{setShareNotice('Copy the address from your browser to share this thread.');}}}>Copy thread link</button><span role="status">{shareNotice}</span><span className="community-tag">{scopeTitle(entry.project)} {entry.kind==='bug'?` / ${entry.status}`:''}</span><Post entry={entry} onChange={onBack}/><h4>Replies · {entries.length}{entries.length===200?' (first 200)':''}</h4>{loading && <p>Loading replies…</p>}{error && <p role="status">{error}</p>}{entries.map(e=><Post key={e.id} entry={e} onChange={refresh}/>)}{!loading&&!entries.length&&<p className="community-empty">This conversation has room for its first reply.</p>}<Composer kind="reply" parent={entry.id} project={entry.project} onPosted={refresh}/></section>;
}
const boards=[['forum','Forum','Questions, discoveries & the occasional rabbit hole.'],['discussion','Discussions','Conversations alongside products and journal entries.'],['bug','Bug reports','A public trail from first report to a fix.']];
export function DiscordInvitation(){return <aside className="discord-invitation"><div><strong>The studio hangs out on Discord.</strong><span>Drop in for everyday conversation. Keep project notes and discoveries here.</span></div><a href="https://discord.gg/2RtH68T9fn" target="_blank" rel="noopener noreferrer">Join us on Discord ↗</a></aside>;}
export function CommunityHub({context}:{context?:{scope:string;title:string}}) {
  const {config,error,identity}=useContext(CommunityContext);
  const initial=new URLSearchParams(window.location.search);
  const [board,setBoard]=useState(context?'discussion':boards.some(b=>b[0]===initial.get('board'))?initial.get('board')!:'forum');
  const [thread,setThread]=useState(!context || initial.get('scope')===context.scope ? initial.get('thread')||'' : '');
  const [composing,setComposing]=useState(false), [filter,setFilter]=useState('All subjects'),[status,setStatus]=useState('all'),[flags,setFlags]=useState<Entry[]|null>(null),[notice,setNotice]=useState('');
  const {entries,error:feedError,loading,refresh}=useEntries(board,undefined,thread,context?.scope || (filter==='All subjects'?undefined:filter));
  const change=(next:string,id='')=>{setBoard(next);setThread(id);setComposing(false);const url=new URL(location.href);url.searchParams.set('board',next);if(id)url.searchParams.set('thread',id);else url.searchParams.delete('thread');if(context){url.searchParams.set('scope',context.scope);if(context.scope.startsWith('article:'))url.hash=context.scope.slice(8);}else url.searchParams.delete('scope');history.replaceState(null,'',url);};
  useEffect(()=>{if(context)return;const navigate=(event:Event)=>{const next=(event as CustomEvent).detail;if(boards.some(b=>b[0]===next))change(next);};window.addEventListener('studio-board',navigate);return()=>window.removeEventListener('studio-board',navigate);},[]);
  const selected=entries.find(e=>e.id===thread);
  const filtered=entries.filter(e=>board!=='bug'||status==='all'||e.status===status);
  return <section className={`community-hub ${context?'community-context':''}`} aria-label={context?`Discussion: ${context.title}`:'Rookery conversations'}>
    <div className="community-utility"><span className="community-mode">{config?.local?'LOCAL PREVIEW':config?'THE CONVERSATION BOARD':error?'COMMUNITY NOT CONNECTED':'CONNECTING…'}</span><IdentityPanel/></div>
    {error && <p className="community-note" role="status">{error}</p>}
    {!context && <div className="community-tabs" role="group" aria-label="Community boards">{boards.map(([id,title])=><button key={id} aria-pressed={board===id} onClick={()=>change(id)}>{title}</button>)}</div>}
    {!context && <p className="community-board-description">{boards.find(b=>b[0]===board)?.[2]}</p>}
    {thread ? selected?<Thread entry={selected} onBack={()=>change(board)}/>:<div className="community-empty">{loading?'Loading thread…':'This thread is unavailable or has been moderated.'}<button className="studio-button" onClick={()=>change(board)}>Back to board</button></div>:<>
      <div className="community-toolbar">{!context && <details className="community-filter"><summary>Filter conversations{filter!=='All subjects'||status!=='all'?' · active':''}</summary><label>Subject<select value={filter} onChange={e=>setFilter(e.target.value)}><option>All subjects</option>{scopes.map(p=><option key={p.id} value={p.id}>{p.title}</option>)}</select></label>{board==='bug'&&<label>Status<select value={status} onChange={e=>setStatus(e.target.value)}>{['all','open','investigating','planned','fixed','closed'].map(s=><option key={s}>{s}</option>)}</select></label>}</details>}<button className="studio-text-link" onClick={refresh}>Refresh</button><button className="studio-button community-start" onClick={()=>setComposing(v=>!v)}>{composing?'Close composer':board==='bug'?'+ Report a bug':context?'+ Add a comment':'+ Start a conversation'}</button></div>
      {composing&&<Composer key={`${board}:${context?.scope||filter}`} kind={board} project={context?.scope || (filter==='All subjects'?'Studio':filter)} fixedProject={!!context} onPosted={()=>{setComposing(false);refresh();}}/>}
      {feedError&&<p role="status">{feedError}</p>}{loading?<p>Loading conversations…</p>:filtered.length?<div className="community-topics">{filtered.map(e=><button className="community-topic" key={e.id} onClick={()=>change(board,e.id)}>{!context&&<span className="community-tag">{scopeTitle(e.project)}{board==='bug'?` · ${e.status}`:''}</span>}<strong>{e.title}</strong><span>{raven(e.author)} · {when(e.created)} · {e.replies||0} replies{board==='bug'?` · BUG-${e.id.slice(0,8)}`:''}</span></button>)}</div>:<div className="community-empty"><p>{filter!=='All subjects'?'No conversations match these filters.':context?'Have a question or something to add? Start the conversation.':'Room for the first conversation. What have you been exploring?'}</p></div>}
    </>}
    {!!identity && identity.id===config?.moderator&&<details className="community-identity"><summary>Moderator desk</summary><button className="studio-button" onClick={async()=>{try{setFlags((await communityRequest('flags',{},identity)).entries);setNotice('');}catch(e){setNotice((e as Error).message);}}}>Load reported posts</button><p role="status">{notice}</p>{flags?.map(e=><div key={e.id}><p>{e.flags} reports</p><Post entry={e} onChange={()=>{setFlags(null);refresh();}}/></div>)}{flags?.length===0&&<p>No reported posts.</p>}</details>}
    <details className="community-guidelines"><summary>A few house rules</summary><p className="community-note">Be curious. Be kind. No spam, harassment, or personal information. Posts and fingerprints are public and may be moderated. Latest 100 topics; up to 200 replies per thread are shown. Use Refresh to check for new replies.</p></details>
  </section>;
}
export function ContextDiscussion({scope,title}:{key?:React.Key;scope:string;title:string}) {
  const params=new URLSearchParams(location.search);
  const [open,setOpen]=useState(params.get('scope')===scope && !!params.get('thread'));
  return <details className="context-discussion" open={open} onToggle={e=>setOpen(e.currentTarget.open)}><summary><span>{scope==='INFINITE DRAFTING'?'Reviews & discussion':'Join the discussion'}</span><small>{scope.startsWith('article:')?'Responses to this journal entry':scope==='INFINITE DRAFTING'?'Your experience, questions & suggestions':'Questions, ideas & notes about this product'}</small></summary>{open&&<><p className="context-intro">About <strong>{title}</strong>. For everyday conversation, <a href="https://discord.gg/2RtH68T9fn" target="_blank" rel="noopener noreferrer">hang out on Discord ↗</a></p><CommunityHub context={{scope,title}}/></>}</details>;
}
function ChatContents(){const {entries,error,loading,refresh}=useEntries('chat');return <><IdentityPanel/><div className="community-chat-log" aria-label="Recent chat messages">{loading?<p>Loading messages…</p>:!entries.length?<div className="community-empty"><h4>The kettle’s on.</h4><p>Say hello, talk tools, or share what you're making.</p></div>:entries.map(e=><Post key={e.id} entry={e} onChange={refresh}/>)}{error&&<p role="status">{error}</p>}</div><Composer kind="chat" onPosted={refresh}/><p className="community-note">Newest first · refreshes every 8 seconds while visible. Messages are public.</p></>;}
export function SiteChat(){const [open,setOpen]=useState(false);const button=useRef<HTMLButtonElement>(null),close=useRef<HTMLButtonElement>(null);useEffect(()=>{const show=()=>setOpen(true);window.addEventListener('studio-chat',show);return()=>window.removeEventListener('studio-chat',show);},[]);useEffect(()=>{if(!open)return;close.current?.focus();const escape=(e:KeyboardEvent)=>{if(e.key==='Escape'){setOpen(false);button.current?.focus();}};window.addEventListener('keydown',escape);return()=>window.removeEventListener('keydown',escape);},[open]);return <div className="community-chat"><button ref={button} className="community-chat-toggle" aria-expanded={open} aria-controls="studio-chat" onClick={()=>setOpen(v=>!v)}>◈ {open?'Close chat':'Studio chat'}</button>{open&&<aside id="studio-chat" className="community-chat-drawer" aria-label="Studio chat"><header><div><span className="studio-kicker">THE COMMON ROOM</span><h3>Studio chat</h3></div><button ref={close} className="studio-button" onClick={()=>{setOpen(false);button.current?.focus();}} aria-label="Close studio chat">×</button></header><ChatContents/></aside>}</div>;}
