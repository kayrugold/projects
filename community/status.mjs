let cached;
export async function gameHostStatus() {
  if (cached && Date.now()-cached.checkedAt<60000) return Response.json(cached,{headers:{'Cache-Control':'no-store'}});
  const checkedAt=Date.now();
  try { const response=await fetch('https://xyrtania.andy-596.workers.dev/',{method:'HEAD',signal:AbortSignal.timeout(8000)});cached={host:response.ok?'reachable':'unavailable',checkedAt,players:null,multiplayer:'unmonitored'}; }
  catch {cached={host:'unavailable',checkedAt,players:null,multiplayer:'unmonitored'};}
  return Response.json(cached,{headers:{'Cache-Control':'no-store'}});
}
export function xyrtaniaStatusPreview(){return {name:'xyrtania-status-preview',configureServer(server){server.middlewares.use('/api/xyrtania-status',async(req,res)=>{if(req.method!=='GET'){res.statusCode=405;res.end();return;}const response=await gameHostStatus();res.setHeader('Content-Type','application/json');res.setHeader('Cache-Control','no-store');res.end(await response.text());});}};}
