// Shared by Cloudflare Pages Functions and the local Vite preview server.
const encoder = new TextEncoder();
const reply = (data, status = 200) => Response.json(data, { status, headers: { 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff' } });
const fail = (message, status = 400) => { throw Object.assign(new Error(message), { status }); };
export const canonical = (method, path, time, nonce, body) => ['studio-community-v1', method, path, time, nonce, body].join('\n');
export const hex = bytes => Array.from(new Uint8Array(bytes), n => n.toString(16).padStart(2, '0')).join('');
const decode = value => Uint8Array.from(atob(value), c => c.charCodeAt(0));
const digest = async value => hex(await crypto.subtle.digest('SHA-256', typeof value === 'string' ? encoder.encode(value) : value));
const text = (value, max, min = 1) => { if (typeof value !== 'string' || value.trim().length < min || value.length > max) fail(`Text must contain ${min}–${max} characters.`); return value.trim(); };
async function limited(db, id, max, seconds) {
  const bucket = Math.floor(Date.now() / (seconds * 1000));
  const row = await db.prepare('INSERT INTO limits(id,count,expires) VALUES(?,1,?) ON CONFLICT(id) DO UPDATE SET count=count+1 RETURNING count').bind(`${id}:${bucket}`, (bucket + 1) * seconds * 1000).first();
  if (row.count > max) fail('Please slow down and try again shortly.', 429);
}
async function readBody(request) {
  const reader = request.body?.getReader();
  if (!reader) fail('A JSON body is required.');
  const chunks = []; let size = 0;
  while (true) { const { done, value } = await reader.read(); if (done) break; size += value.length; if (size > 16000) { await reader.cancel(); fail('Request too large.', 413); } chunks.push(value); }
  const bytes = new Uint8Array(size); let offset = 0;
  for (const chunk of chunks) { bytes.set(chunk, offset); offset += chunk.length; }
  return new TextDecoder().decode(bytes);
}
export async function handleCommunity(request, env) {
  try {
    const url = new URL(request.url), path = url.pathname.replace(/\/$/, ''), now = Date.now();
    const local = env.LOCAL_PREVIEW === true;
    if (!env.DB || (!local && (!env.TURNSTILE_SECRET || !env.TURNSTILE_SITE_KEY || !env.SITE_ORIGIN || !env.ABUSE_SALT))) return reply({ error: 'Community is not connected yet. Andy is preparing the shared service.' }, 503);
    const origin = local ? url.origin : env.SITE_ORIGIN;
    if (request.headers.get('origin') && request.headers.get('origin') !== origin) fail('This origin is not allowed.', 403);
    const db = env.DB;
    if (request.method === 'GET') {
      if (path.endsWith('/config')) return reply({ local, siteKey: local ? null : env.TURNSTILE_SITE_KEY, moderator: env.MODERATOR_KEY_ID || '' });
      if (path.endsWith('/entries')) {
        const kind = url.searchParams.get('kind') || 'forum', parent = url.searchParams.get('parent');
        if (!['forum', 'discussion', 'bug', 'chat', 'reply'].includes(kind)) fail('Unknown board.');
        let result;
        const id = url.searchParams.get('id');
        if (id) result = await db.prepare('SELECT * FROM entries WHERE id=? AND kind=? AND hidden=0 AND parent IS NULL').bind(id, kind).all();
        else if (parent) result = await db.prepare('SELECT e.* FROM entries e JOIN entries p ON e.parent=p.id WHERE e.parent=? AND e.hidden=0 AND p.hidden=0 ORDER BY e.created ASC LIMIT 200').bind(parent).all();
        else if (url.searchParams.has('project')) result = await db.prepare('SELECT e.*, (SELECT COUNT(*) FROM entries r WHERE r.parent=e.id AND r.hidden=0) AS replies FROM entries e WHERE e.kind=? AND e.project=? AND e.hidden=0 ORDER BY e.created DESC LIMIT 100').bind(kind, text(url.searchParams.get('project'),100)).all();
        else result = await db.prepare('SELECT e.*, (SELECT COUNT(*) FROM entries r WHERE r.parent=e.id AND r.hidden=0) AS replies FROM entries e WHERE e.kind=? AND e.hidden=0 ORDER BY e.created DESC LIMIT 100').bind(kind).all();
        return reply({ entries: result.results });
      }
      fail('Not found.', 404);
    }
    if (request.method !== 'POST') fail('Method not allowed.', 405);
    if (request.headers.get('origin') !== origin) fail('Same-origin requests only.', 403);
    if (!request.headers.get('content-type')?.startsWith('application/json')) fail('JSON required.', 415);
    const ip = local ? 'local' : request.headers.get('cf-connecting-ip');
    if (!ip) fail('Missing trusted network information.', 403);
    await limited(db, `network:${await digest(`${env.ABUSE_SALT || 'local'}:${ip}`)}`, 90, 60);
    const raw = await readBody(request);
    let data; try { data = JSON.parse(raw); } catch { fail('Invalid JSON.'); }
    if (!data || typeof data !== 'object' || Array.isArray(data)) fail('Invalid request.');
    const keyText = request.headers.get('x-studio-key') || '', signature = request.headers.get('x-studio-signature') || '';
    const time = request.headers.get('x-studio-time') || '', nonce = request.headers.get('x-studio-nonce') || '';
    if (keyText.length > 180 || signature.length > 100 || !/^\d{13}$/.test(time) || Math.abs(now - Number(time)) > 60000 || !/^[a-f0-9-]{36}$/.test(nonce)) fail('Signature expired or malformed.', 401);
    let keyBytes, key, valid;
    try {
      keyBytes = decode(keyText);
      key = await crypto.subtle.importKey('spki', keyBytes, { name: 'ECDSA', namedCurve: 'P-256' }, false, ['verify']);
      valid = await crypto.subtle.verify({ name: 'ECDSA', hash: 'SHA-256' }, key, decode(signature), encoder.encode(canonical(request.method, url.pathname, time, nonce, raw)));
    } catch { fail('Invalid identity signature.', 401); }
    if (!valid) fail('Invalid identity signature.', 401);
    const author = await digest(keyBytes);
    const used = await db.prepare('INSERT OR IGNORE INTO nonces(id,expires) VALUES(?,?)').bind(`${author}:${nonce}`, now + 120000).run();
    if (!used.meta.changes) fail('This request has already been used.', 409);
    await db.batch([db.prepare('DELETE FROM nonces WHERE expires<?').bind(now), db.prepare('DELETE FROM limits WHERE expires<?').bind(now)]);
    const member = await db.prepare('SELECT * FROM members WHERE id=?').bind(author).first();
    if (member?.banned) fail('This identity has been suspended.', 403);
    if (path.endsWith('/join')) {
      if (member) return reply({ id: author });
      await limited(db, `join:${await digest(`${env.ABUSE_SALT || 'local'}:${ip}`)}`, 5, 3600);
      if (!local) {
        if (typeof data.token !== 'string' || data.token.length > 2048) fail('Complete the human check.', 403);
        const response = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', { method: 'POST', body: new URLSearchParams({ secret: env.TURNSTILE_SECRET, response: data.token, remoteip: ip }), signal: AbortSignal.timeout(10000) });
        const check = await response.json();
        if (!check.success || check.hostname !== new URL(origin).hostname || check.action !== 'community-join') fail('Human check failed. Please try again.', 403);
      }
      await db.prepare('INSERT OR IGNORE INTO members(id,public_key,created) VALUES(?,?,?)').bind(author, keyText, now).run();
      return reply({ id: author });
    }
    if (!member) fail('Join with your identity before posting.', 401);
    await limited(db, `member:${author}`, 12, 60);
    if (path.endsWith('/entry')) {
      const kind = data.kind;
      if (!['forum', 'discussion', 'bug', 'chat', 'reply'].includes(kind)) fail('Unknown board.');
      const parent = kind === 'reply' ? text(data.parent, 36, 36) : null;
      if (parent) { const thread = await db.prepare('SELECT * FROM entries WHERE id=? AND hidden=0').bind(parent).first(); if (!thread || !['forum','discussion','bug'].includes(thread.kind)) fail('Thread unavailable.', 404); }
      const body = text(data.body, kind === 'chat' ? 1000 : 6000), title = ['chat','reply'].includes(kind) ? '' : text(data.title, 140, 3);
      const project = text(data.project || 'Studio', 100), id = crypto.randomUUID();
      await limited(db, `post:${author}`, 100, 86400);
      await db.prepare('INSERT INTO entries(id,kind,parent,project,title,body,author,created) VALUES(?,?,?,?,?,?,?,?)').bind(id, kind, parent, project, title, body, author, now).run();
      return reply({ id }, 201);
    }
    if (path.endsWith('/flag')) {
      const entry = await db.prepare('SELECT id FROM entries WHERE id=? AND hidden=0').bind(text(data.id,36,36)).first();
      if (!entry) fail('Post unavailable.',404);
      await db.prepare('INSERT OR IGNORE INTO flags(entry,author,created) VALUES(?,?,?)').bind(data.id,author,now).run();
      return reply({ ok:true });
    }
    if (path.endsWith('/moderate') || path.endsWith('/flags')) {
      if (author !== env.MODERATOR_KEY_ID) fail('Moderator access required.', 403);
      if (path.endsWith('/flags')) return reply({ entries: (await db.prepare('SELECT e.*, COUNT(f.author) AS flags FROM entries e JOIN flags f ON f.entry=e.id WHERE e.hidden=0 GROUP BY e.id ORDER BY flags DESC LIMIT 100').all()).results });
      if (data.action === 'ban') await db.prepare('UPDATE members SET banned=1 WHERE id=?').bind(text(data.author,64,64)).run();
      else if (data.action === 'hide') await db.prepare('UPDATE entries SET hidden=1 WHERE id=?').bind(text(data.id,36,36)).run();
      else if (data.action === 'status' && ['open','investigating','planned','fixed','closed'].includes(data.status)) await db.prepare("UPDATE entries SET status=? WHERE id=? AND kind='bug'").bind(data.status,text(data.id,36,36)).run();
      else fail('Unknown moderation action.');
      return reply({ ok:true });
    }
    fail('Not found.',404);
  } catch (error) { return reply({ error: error.status ? error.message : 'Community service is unavailable. Please try again.' }, error.status || 500); }
}
