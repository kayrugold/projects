const enc = new TextEncoder();
const base64 = (bytes: ArrayBuffer) => btoa(String.fromCharCode(...new Uint8Array(bytes)));
const unbase64 = (value: string) => Uint8Array.from(atob(value), c => c.charCodeAt(0));
export type Identity = { id: string; publicKey: CryptoKey; privateKey: CryptoKey };
export type Entry = { id: string; kind: string; parent: string | null; project: string; title: string; body: string; author: string; created: number; status: string; hidden?: number; pinned?: number; highlighted?: number; locked?: number; deleted?: number; replies?: number; flags?: number };
export type Configuration = { local: boolean; siteKey: string | null; moderator: string };
async function identityStore(mode: IDBTransactionMode, value?: Identity): Promise<Identity | null> {
  return new Promise((resolve, reject) => {
    const opening = indexedDB.open('studio-identity', 1);
    opening.onupgradeneeded = () => opening.result.createObjectStore('keys');
    opening.onerror = () => reject(new Error('Identity storage is unavailable in this browser.'));
    opening.onsuccess = () => {
      const db = opening.result, transaction = db.transaction('keys', mode), store = transaction.objectStore('keys');
      const request = value ? store.put(value, 'identity') : store.get('identity');
      transaction.oncomplete = () => { db.close(); resolve(value || request.result || null); };
      transaction.onerror = () => { db.close(); reject(new Error('Unable to save your identity.')); };
    };
  });
}
export const loadIdentity = () => identityStore('readonly');
export async function createIdentity() {
  const keys = await crypto.subtle.generateKey({ name: 'ECDSA', namedCurve: 'P-256' }, true, ['sign', 'verify']);
  const hash = await crypto.subtle.digest('SHA-256', await crypto.subtle.exportKey('spki', keys.publicKey));
  const identity = { ...keys, id: Array.from(new Uint8Array(hash), v => v.toString(16).padStart(2, '0')).join('') };
  await identityStore('readwrite', identity); return identity;
}
export async function communityRequest(path: string, data?: unknown, identity?: Identity) {
  const url = `/api/community/${path}`;
  const headers: Record<string, string> = {};
  let body: string | undefined;
  if (data !== undefined) {
    if (!identity) throw new Error('Create or restore your identity first.');
    body = JSON.stringify(data);
    const time = String(Date.now()), nonce = crypto.randomUUID();
    const signature = await crypto.subtle.sign({ name: 'ECDSA', hash: 'SHA-256' }, identity.privateKey, enc.encode(['studio-community-v1', 'POST', url, time, nonce, body].join('\n')));
    Object.assign(headers, { 'Content-Type': 'application/json', 'X-Studio-Key': base64(await crypto.subtle.exportKey('spki', identity.publicKey)), 'X-Studio-Signature': base64(signature), 'X-Studio-Time': time, 'X-Studio-Nonce': nonce });
  }
  const response = await fetch(url, { method: body ? 'POST' : 'GET', headers, body, cache: 'no-store', signal: AbortSignal.timeout(15000) });
  let result; try { result = await response.json(); } catch { throw new Error('The shared community service is not connected yet.'); }
  if (!response.ok) throw new Error(result.error || 'Community request failed.');
  return result;
}
async function backupKey(password: string, salt: Uint8Array<ArrayBuffer>) {
  if (password.length < 12) throw new Error('Use a recovery password with at least 12 characters.');
  const material = await crypto.subtle.importKey('raw', enc.encode(password), 'PBKDF2', false, ['deriveKey']);
  return crypto.subtle.deriveKey({ name: 'PBKDF2', hash: 'SHA-256', salt, iterations: 600000 }, material, { name: 'AES-GCM', length: 256 }, false, ['encrypt', 'decrypt']);
}
export async function exportIdentity(identity: Identity, password: string) {
  const salt = crypto.getRandomValues(new Uint8Array(16)), iv = crypto.getRandomValues(new Uint8Array(12));
  const payload = JSON.stringify({ publicKey: await crypto.subtle.exportKey('jwk', identity.publicKey), privateKey: await crypto.subtle.exportKey('jwk', identity.privateKey) });
  const ciphertext = await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, await backupKey(password, salt), enc.encode(payload));
  const file = new Blob([JSON.stringify({ format:'studio-key-v1', salt:base64(salt.buffer), iv:base64(iv.buffer), ciphertext:base64(ciphertext) })], { type:'application/json' });
  const url = URL.createObjectURL(file), link = document.createElement('a'); link.href=url; link.download=`studio-recovery-${identity.id.slice(0,8)}.json`; link.click(); setTimeout(()=>URL.revokeObjectURL(url),1000);
}
export async function restoreIdentity(file: File, password: string) {
  if (file.size > 10000) throw new Error('This is not a studio recovery file.');
  try {
    const backup = JSON.parse(await file.text());
    if (backup.format !== 'studio-key-v1') throw new Error();
    const payload = JSON.parse(new TextDecoder().decode(await crypto.subtle.decrypt({ name:'AES-GCM', iv:unbase64(backup.iv) }, await backupKey(password, unbase64(backup.salt)), unbase64(backup.ciphertext))));
    const publicKey = await crypto.subtle.importKey('jwk', payload.publicKey, { name:'ECDSA', namedCurve:'P-256' }, true, ['verify']);
    const privateKey = await crypto.subtle.importKey('jwk', payload.privateKey, { name:'ECDSA', namedCurve:'P-256' }, true, ['sign']);
    const proof = crypto.getRandomValues(new Uint8Array(32));
    const signature = await crypto.subtle.sign({ name:'ECDSA', hash:'SHA-256' }, privateKey, proof);
    if (!await crypto.subtle.verify({ name:'ECDSA', hash:'SHA-256' }, publicKey, signature, proof)) throw new Error();
    const hash = await crypto.subtle.digest('SHA-256', await crypto.subtle.exportKey('spki', publicKey));
    const identity = { publicKey, privateKey, id:Array.from(new Uint8Array(hash),v=>v.toString(16).padStart(2,'0')).join('') };
    await identityStore('readwrite', identity); return identity;
  } catch { throw new Error('Could not unlock this recovery file. Check the file and password.'); }
}
