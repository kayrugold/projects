/* Patched ntt_worker.js

Fixes coefficient ordering for NTT multiplication (LSB-first internally, MSB-first externally)

Provides a robust BigInt fallback multiply (correct but slower) when NTT parameters are not safe

Includes helpers: chunk conversions, compare/add/sub, computeMpChunks, LLT modular reduction with final rigorous subtraction

Includes quick test harness (verifyMultiplySamples and quickLLT) you can run in the worker console


HOW TO USE

Drop this file in place of your existing worker or load it in your HTML worker blob

If you have a working ntt implementation and a suitable prime Q, set ENABLE_NTT = true and configure Q/primitive root/n as needed in NTT_PARAMS

By default this worker will use the BigInt fallback multiply which is correct and will make the LLT report the right result (slower but reliable) */


// -------------------------- Configuration -------------------------- const BASE = 10000; // chunk base (10^4) const BASE_BI = BigInt(BASE);

// If you have a validated NTT implementation and prime, set ENABLE_NTT = true and configure NTT_PARAMS. // If not sure, leave ENABLE_NTT = false — fallback BigInt multiply will be used (correct, simpler). let ENABLE_NTT = false;

const NTT_PARAMS = { // Example placeholder values for a common NTT prime. Replace with values you trust. // Q must be a prime BigInt and satisfy (Q-1) % n === 0 for transform length n. Q: 998244353n, // example; change to your NTT prime if you have one root: 3n,      // primitive root for Q (for the example prime) maxN: 1 << 20  // maximum transform length supported by your NTT implementation };

// -------------------------- Utility helpers -------------------------- function trim(arr) { // Remove leading zeros (MSB-first array) let i = 0; while (i < arr.length - 1 && arr[i] === 0) i++; return arr.slice(i); }

function cloneArray(arr) { return arr.slice(); }

function stringToChunks(str) { // Accept decimal string; return MSB-first array of chunks in base BASE let n = BigInt(str); if (n === 0n) return [0]; let out = []; while (n > 0n) { out.push(Number(n % BASE_BI)); n = n / BASE_BI; } return out.reverse(); }

function chunksToString(chunks) { // chunks is MSB-first let n = 0n; for (let i = 0; i < chunks.length; i++) { n = n * BASE_BI + BigInt(chunks[i]); } return n.toString(); }

function cmp(a, b) { // Compare two MSB-first chunk arrays. Return 1 if a>b, 0 if equal, -1 if a<b a = trim(a); b = trim(b); if (a.length > b.length) return 1; if (a.length < b.length) return -1; for (let i = 0; i < a.length; i++) { if (a[i] > b[i]) return 1; if (a[i] < b[i]) return -1; } return 0; }

function addChunks(a, b) { // Add MSB-first arrays // convert to LSB-first for easy carry, then back const ra = a.slice().reverse(); const rb = b.slice().reverse(); const n = Math.max(ra.length, rb.length); const res = []; let carry = 0n; for (let i = 0; i < n; i++) { const va = BigInt(ra[i] || 0); const vb = BigInt(rb[i] || 0); let s = va + vb + carry; res.push(Number(s % BASE_BI)); carry = s / BASE_BI; } while (carry > 0n) { res.push(Number(carry % BASE_BI)); carry = carry / BASE_BI; } return trim(res.reverse()); }

function subChunks(a, b) { // Compute a - b, assuming a >= b. MSB-first arrays. if (cmp(a, b) < 0) throw new Error('subChunks: a < b'); const ra = a.slice().reverse(); const rb = b.slice().reverse(); const res = []; let borrow = 0n; for (let i = 0; i < ra.length; i++) { let va = BigInt(ra[i]); const vb = BigInt(rb[i] || 0); let r = va - vb - borrow; if (r < 0n) { r += BASE_BI; borrow = 1n; } else { borrow = 0n; } res.push(Number(r)); } return trim(res.reverse()); }

function subChunksBySmall(a, small) { // subtract small (Number) from chunk-array a (MSB-first). Assumes a >= small. if (small === 0) return a.slice(); const ra = a.slice().reverse(); let carry = BigInt(small); for (let i = 0; i < ra.length; i++) { let v = BigInt(ra[i]); if (v >= carry) { v = v - carry; ra[i] = Number(v); carry = 0n; break; } else { // need to borrow let need = carry - v; // compute new digit after borrow let newv = (BASE_BI - (need % BASE_BI)) % BASE_BI; ra[i] = Number(newv); // next borrow amount carry = (need + BASE_BI - 1n) / BASE_BI; // ceil(need / BASE) } } if (carry > 0n) throw new Error('subChunksBySmall: result negative'); return trim(ra.reverse()); }

// -------------------------- Mersenne modulus helper -------------------------- function computeMpChunks(p) { // returns MSB-first chunk array representing 2^p - 1 if (p <= 0) return [0]; let mp = (1n << BigInt(p)) - 1n; if (mp === 0n) return [0]; const out = []; while (mp > 0n) { out.push(Number(mp % BASE_BI)); mp = mp / BASE_BI; } return out.reverse(); }

// -------------------------- BigInt fallback multiply -------------------------- function bigintMultiplyChunks(a, b) { // Convert chunk arrays to BigInt, multiply, convert back. const aStr = chunksToString(a); const bStr = chunksToString(b); const prod = BigInt(aStr) * BigInt(bStr); if (prod === 0n) return [0]; let tmp = prod; const out = []; while (tmp > 0n) { out.push(Number(tmp % BASE_BI)); tmp = tmp / BASE_BI; } return trim(out.reverse()); }

// -------------------------- Placeholder NTT hooks -------------------------- // If you have an existing ntt(fa, invert, n) function, you can wire it in here // The expected interface: ntt(arr, invert, n) operates in-place on arr (length n) // and uses modulus Q and returns integer coefficients mod Q. The arr values should // be provided LSB-first for polynomial coefficients (coefficient for x^0 at index 0).

function checkNTTParams(Q, n, BASE) { if (!Q) return { ok: false, reason: 'no Q' }; if ((Q - 1n) % BigInt(n) !== 0n) return { ok: false, reason: 'n does not divide Q-1' }; const maxCoeff = BigInt(BASE) - 1n; const requiredMin = maxCoeff * maxCoeff * BigInt(n); if (Q <= requiredMin) return { ok: false, reason: 'Q too small for single-mod convolution' }; return { ok: true }; }

// You may replace this stub with your fast NTT implementation. // For now it throws unless you provide a real implementation and enable ENABLE_NTT. function ntt_stub(arr, invert, n) { throw new Error('NTT not implemented in this worker stub. Provide an ntt() implementation and set ENABLE_NTT = true if you want to use NTT acceleration.'); }

let ntt = ntt_stub; // by default use stub; user can override by setting ntt = their function

// -------------------------- mul() with NTT-order fix and fallback -------------------------- function mul(a, b) { // a, b: MSB-first chunk arrays. Returns MSB-first chunk array.

// handle zero cases if (!a || !b) return [0]; if (a.length === 1 && a[0] === 0) return [0]; if (b.length === 1 && b[0] === 0) return [0];

// detect square (value-equality) let isSquare = false; if (a === b) isSquare = true; else if (a.length === b.length) { isSquare = true; for (let i = 0; i < a.length; i++) if (a[i] !== b[i]) { isSquare = false; break; } }

// choose algorithm: try NTT if enabled and params check out, else fallback to BigInt // compute required length const len = a.length + b.length - 1; let n = 1; while (n < len) n <<= 1;

if (ENABLE_NTT) { const check = checkNTTParams(NTT_PARAMS.Q, n, BASE); if (!check.ok) { console.warn('NTT disabled for this multiplication: ' + check.reason + '. Falling back to BigInt multiply.'); return bigintMultiplyChunks(a, b); }

// Prepare arrays in LSB-first order for NTT
const fa = new Array(n).fill(0);
const fb = new Array(n).fill(0);
for (let i = 0; i < a.length; i++) fa[i] = a[a.length - 1 - i] || 0; // reverse into LSB-first
if (!isSquare) {
  for (let i = 0; i < b.length; i++) fb[i] = b[b.length - 1 - i] || 0;
}

// run forward NTT (user's ntt must use modulus Q and integer arithmetic)
ntt(fa, false, n);
if (!isSquare) ntt(fb, false, n);

// pointwise multiply (BigInt safe)
for (let i = 0; i < n; i++) {
  if (isSquare) {
    const x = BigInt(fa[i]);
    fa[i] = Number((x * x) % NTT_PARAMS.Q);
  } else {
    fa[i] = Number((BigInt(fa[i]) * BigInt(fb[i])) % NTT_PARAMS.Q);
  }
}

// inverse NTT
ntt(fa, true, n);

// reconstruct integer from LSB-first fa (with carries)
const resultLSB = [];
let carry = 0n;
for (let i = 0; i < len; i++) {
  let val = BigInt(fa[i] || 0) + carry;
  resultLSB.push(Number(val % BASE_BI));
  carry = val / BASE_BI;
}
while (carry > 0n) {
  resultLSB.push(Number(carry % BASE_BI));
  carry = carry / BASE_BI;
}
// convert LSB-first back to MSB-first
return trim(resultLSB.reverse());

} else { // fallback to BigInt multiply (slower but correct). This guarantees correctness for LLT. return bigintMultiplyChunks(a, b); } }

// -------------------------- LLT modular reduction -------------------------- function LLT_modularReduction(xChunks, p, MpChunks) { // Reduce xChunks modulo M_p. xChunks in MSB-first. MpChunks MSB-first. // Strategy: if x is large, we can do quick reduction using 2^p chunk shifts, but for correctness // we finish with a strict loop of while (rem >= M_p) rem -= M_p.

// Ensure MpChunks provided const Mp = MpChunks || computeMpChunks(p);

// Quick path: convert to BigInt and reduce using bit shifts (safe but may be slower for huge inputs). // Convert xChunks -> BigInt const xStr = chunksToString(xChunks); let xBI = BigInt(xStr); const MpBI = (1n << BigInt(p)) - 1n; // exact 2^p - 1 let remBI = xBI % MpBI; // convert remBI back to chunks if (remBI === 0n) return [0]; const out = []; while (remBI > 0n) { out.push(Number(remBI % BASE_BI)); remBI = remBI / BASE_BI; } let remChunks = trim(out.reverse());

// final rigorous subtraction loop to ensure 0 <= rem < M_p while (cmp(remChunks, Mp) >= 0) { remChunks = subChunks(remChunks, Mp); } return remChunks; }

// -------------------------- Lucas-Lehmer Test runner -------------------------- function runLLT(p, onStep) { // p must be prime (user-supplied check elsewhere). Returns {isPrime:bool, steps:int, finalS:chunks} if (p < 2) throw new Error('Invalid p'); const MpChunks = computeMpChunks(p); // initial S = 4 let S = [4]; // MSB-first for (let i = 0; i < p - 2; i++) { // S = S^2 - 2 (mod M_p) let S2 = mul(S, S); S2 = subChunksBySmall(S2, 2); S = LLT_modularReduction(S2, p, MpChunks); if (typeof onStep === 'function') onStep(i + 1, chunksToString(S)); } const isPrime = cmp(S, [0]) === 0; return { isPrime, steps: p - 2, finalS: S }; }

// -------------------------- Quick test harness -------------------------- function testNTTMultiply(aStr, bStr) { const A = stringToChunks(aStr); const B = stringToChunks(bStr); const prodChunks = mul(A, B); const prodStr = chunksToString(prodChunks); const expected = (BigInt(aStr) * BigInt(bStr)).toString(); return { ok: expected === prodStr, expected, got: prodStr }; }

function verifyMultiplySamples() { const tests = [ ['123456789012345', '98765432109876'], ['99999999999999999', '88888888888888888'], ['100000000000000000000000', '12345678901234567890'] ]; for (const [a, b] of tests) { const res = testNTTMultiply(a, b); console.log('Test', a, '*', b, ':', res.ok ? 'PASS' : 'FAIL'); if (!res.ok) { console.log(' expected:', res.expected); console.log(' got     :', res.got); } } }

function quickLLTTest(p) { console.log('Running quick LLT for p =', p); const out = runLLT(p, (step, sStr) => { // optionally log some intermediate steps if (step <= 6 || step % 25 === 0) console.log(' step', step, 'S =', sStr.slice(0, 120)); }); console.log('Result for p=', p, ':', out.isPrime ? 'PRIME' : 'COMPOSITE', 'final S =', chunksToString(out.finalS).slice(0, 200)); return out; }

// -------------------------- Export / worker message handling -------------------------- // If using as a WebWorker, you can handle messages to run tests or LLT. if (typeof self !== 'undefined' && typeof self.addEventListener === 'function') { self.addEventListener('message', (e) => { const data = e.data || {}; try { if (data.cmd === 'verifyMultiplySamples') { verifyMultiplySamples(); self.postMessage({ ok: true, cmd: data.cmd }); } else if (data.cmd === 'quickLLT') { const p = Number(data.p || 13); const res = runLLT(p, (step, sStr) => { self.postMessage({ event: 'step', step, sStr }); }); self.postMessage({ ok: true, cmd: data.cmd, result: res }); } else if (data.cmd === 'setNTT') { // allow user to set their ntt function by serializing a flag only; actual function must be injected by code ENABLE_NTT = !!data.enable; self.postMessage({ ok: true, cmd: data.cmd, ENABLE_NTT }); } else if (data.cmd === 'mulTest') { const a = stringToChunks(String(data.a)); const b = stringToChunks(String(data.b)); const prod = mul(a, b); self.postMessage({ ok: true, cmd: data.cmd, product: chunksToString(prod) }); } else { self.postMessage({ ok: false, error: 'unknown command' }); } } catch (err) { self.postMessage({ ok: false, error: String(err) }); } }); }

// If running in main thread for quick manual use if (typeof window !== 'undefined' && !('WorkerGlobalScope' in window)) { // main-thread convenience API window.nttWorkerPatched = { mul, runLLT, computeMpChunks, verifyMultiplySamples, quickLLTTest, setNTTImplementation: (fn, params) => { ntt = fn; // user provided ntt(arr, invert, n) if (params) { if (params.Q) NTT_PARAMS.Q = BigInt(params.Q); if (params.root) NTT_PARAMS.root = BigInt(params.root); if (params.maxN) NTT_PARAMS.maxN = params.maxN; } ENABLE_NTT = true; console.log('NTT implementation injected. ENABLE_NTT = true'); } }; }

console.log('Patched ntt_worker.js loaded. ENABLE_NTT =', ENABLE_NTT); console.log('By default this worker uses BigInt fallback multiply for correctness. Set ENABLE_NTT = true and inject an ntt() implementation to use NTT acceleration.');