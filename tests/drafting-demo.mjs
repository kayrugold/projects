import test from 'node:test';
import assert from 'node:assert/strict';
import { build } from 'esbuild';

test('demo storage never reads, migrates, writes, or deletes browser drafts',async()=>{
  const result=await build({entryPoints:['infinite-drafting/src/lib/storage.ts'],bundle:true,write:false,platform:'node',format:'esm'});
  const oldDocument=globalThis.document,oldWindow=globalThis.window,oldStorage=globalThis.localStorage;
  globalThis.document={documentElement:{dataset:{draftingDemo:'true'}}};
  globalThis.window={get indexedDB(){throw Error('Demo touched IndexedDB');}};
  globalThis.localStorage=new Proxy({}, {get(){throw Error('Demo touched localStorage');}});
  try{
    const storage=await import('data:text/javascript;base64,'+Buffer.from(result.outputFiles[0].text).toString('base64'));
    assert.deepEqual(await storage.idbGetAllSessions(),[]);
    assert.equal(await storage.idbLoadActiveState(),null);
    await storage.idbSaveSession({id:'demo'});
    await storage.idbSaveActiveState({layers:[]});
    await storage.idbDeleteSession('existing-real-draft');
    await storage.migrateLegacyLocalStorage();
  }finally{globalThis.document=oldDocument;globalThis.window=oldWindow;if(oldStorage===undefined)delete globalThis.localStorage;else globalThis.localStorage=oldStorage;}
});
