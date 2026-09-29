import { readFileSync, mkdirSync } from 'node:fs';
import { handleCommunity } from './api.mjs';

export async function localDatabase(filename = ':memory:') {
  const { DatabaseSync } = await import('node:sqlite');
  const sqlite = new DatabaseSync(filename);
  sqlite.exec(readFileSync(new URL('./schema.sql', import.meta.url), 'utf8'));
  const prepare = sql => {
    let values = [];
    const query = { bind: (...args) => { values = args; return query; }, first: async () => sqlite.prepare(sql).get(...values) || null, all: async () => ({ results: sqlite.prepare(sql).all(...values) }), run: async () => ({ meta: { changes: Number(sqlite.prepare(sql).run(...values).changes) } }) };
    return query;
  };
  return { prepare, batch: async queries => { sqlite.exec('BEGIN'); try { const result = await Promise.all(queries.map(q => q.run())); sqlite.exec('COMMIT'); return result; } catch(e) { sqlite.exec('ROLLBACK'); throw e; } }, close: () => sqlite.close() };
}
export function communityPreview() {
  return { name: 'studio-community-preview', async configureServer(server) {
    mkdirSync('.local-community', { recursive: true });
    let DB;
    try { DB = await localDatabase('.local-community/community.sqlite'); } catch { console.warn('Community preview needs Node 22.13+ or 24. The website can still run.'); return; }
    server.httpServer?.once('close', () => DB.close());
    server.middlewares.use('/api/community', async (req, res) => {
      if (!/^((localhost|127\.0\.0\.1)(:\d+)?|\[::1\](:\d+)?)$/.test(req.headers.host || '') || !['127.0.0.1','::1','::ffff:127.0.0.1'].includes(req.socket.remoteAddress)) { res.statusCode=403; res.end('Local community preview is loopback-only.'); return; }
      try {
        const url = `http://${req.headers.host}${req.originalUrl}`;
        const headers = new Headers(); for (const [name,value] of Object.entries(req.headers)) if (typeof value === 'string') headers.set(name,value);
        const request = new Request(url, { method:req.method, headers, ...(req.method !== 'GET' && req.method !== 'HEAD' ? { body:req, duplex:'half' } : {}) });
        const response = await handleCommunity(request, { DB, LOCAL_PREVIEW:true, MODERATOR_KEY_ID:process.env.COMMUNITY_MODERATOR_KEY_ID || '' });
        res.statusCode=response.status; response.headers.forEach((value,name)=>res.setHeader(name,value)); res.end(await response.text());
      } catch { res.statusCode=500; res.end('{"error":"Local community unavailable."}'); }
    });
  } };
}
