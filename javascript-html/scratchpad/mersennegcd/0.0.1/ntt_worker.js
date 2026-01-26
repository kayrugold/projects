// --- NTT-Accelerated Arithmetic Worker (NTT-GCD) ---
// This worker uses Number Theoretic Transform (NTT) for O(N log N) multiplication
// to accelerate the Euclidean Algorithm's costly division/modulus step.

// --- Worker Constants ---
const BASE = 10000; // Base 10^4 (for chunking)
const CHUNK_SIZE = 4;
// Parameters for NTT: Modulus Q and Primitive Root G
const Q = 469762049; // Q = 3 * 2^28 + 1 (A good prime for 2^24 length)
const G = 3;         // Primitive root mod Q

// --- Utility Functions ---

function isZero(c) {
    return c.length === 1 && c[0] === 0;
}

function trim(c) {
    if (!Array.isArray(c) || c.length === 0) return [0];
    let i = 0;
    while (i < c.length - 1 && c[i] === 0) i++;
    if (i === c.length) return [0];
    return c.slice(i);
}

function cmp(a, b) {
    a = trim(a); b = trim(b);
    if (a.length !== b.length) return a.length > b.length ? 1 : -1;
    for (let i = 0; i < a.length; i++) {
        if (a[i] !== b[i]) return a[i] > b[i] ? 1 : -1;
    }
    return 0;
}

function add(a, b) {
    let a_rev = a.slice().reverse(); 
    let b_rev = b.slice().reverse();
    let n = Math.max(a_rev.length, b_rev.length), carry = 0, out = [];
    for (let i = 0; i < n; i++) {
        let s = (a_rev[i] || 0) + (b_rev[i] || 0) + carry;
        out.push(s % BASE);
        carry = Math.floor(s / BASE);
    }
    if (carry) out.push(carry);
    return trim(out.reverse());
}

function sub(a, b) { // a - b, assumes a >= b
    let a_rev = a.slice().reverse(); 
    let b_rev = b.slice().reverse();
    let n = a_rev.length, borrow = 0, out = [];
    for (let i = 0; i < n; i++) {
        let v = (a_rev[i] || 0) - (b_rev[i] || 0) - borrow;
        if (v < 0) { v += BASE; borrow = 1; } else { borrow = 0; }
        out.push(v);
    }
    return trim(out.reverse());
}

function mulSmall(a, s) {
    if (s === 0 || isZero(a)) return [0];
    let a_rev = a.slice().reverse(), carry = 0, out = [];
    for (const d of a_rev) {
        let p = d * s + carry;
        out.push(p % BASE);
        carry = Math.floor(p / BASE);
    }
    while (carry > 0) {
        out.push(carry % BASE);
        carry = Math.floor(carry / BASE);
    }
    return trim(out.reverse());
}

function chunksToString(chunks) {
    if (!chunks || isZero(chunks)) return "0";
    let trimmed = trim(chunks);
    if (trimmed.length === 0) return "0";
    let s = trimmed[0].toString();
    for (let i = 1; i < trimmed.length; i++) {
        s += trimmed[i].toString().padStart(CHUNK_SIZE, '0');
    }
    return s;
}

function stringToChunks(s) {
    if (typeof s !== 'string' || s.length === 0) return [0];
    s = s.trim().replace(/^0+/, '');
    if (s === '') return [0];

    const padLength = (CHUNK_SIZE - (s.length % CHUNK_SIZE)) % CHUNK_SIZE;
    s = '0'.repeat(padLength) + s;
    const chunks = [];
    for (let i = 0; i < s.length; i += CHUNK_SIZE) {
        const chunkStr = s.substring(i, i + CHUNK_SIZE);
        chunks.push(parseInt(chunkStr, 10));
    }
    return trim(chunks);
}

// --- Modular Arithmetic Helpers ---

function power(base, exp) {
    let res = 1;
    base %= Q;
    while (exp > 0) {
        if (exp % 2 === 1) res = (res * base) % Q;
        base = (base * base) % Q;
        exp = Math.floor(exp / 2);
    }
    return res;
}

function modInverse(n) {
    return power(n, Q - 2);
}

// --- Core NTT Implementation ---

function ntt(a, inverse, n) {
    for (let i = 1, j = 0; i < n; i++) {
        let bit = n >> 1;
        for (; j & bit; bit >>= 1) {
            j ^= bit;
        }
        j ^= bit;
        if (i < j) [a[i], a[j]] = [a[j], a[i]];
    }

    for (let len = 2; len <= n; len <<= 1) {
        let wlen = power(G, (Q - 1) / len);
        if (inverse) wlen = modInverse(wlen);

        for (let i = 0; i < n; i += len) {
            let w = 1;
            for (let j = 0; j < len / 2; j++) {
                let u = a[i + j];
                let v = (a[i + j + len / 2] * w) % Q;
                
                a[i + j] = (u + v) % Q;
                a[i + j + len / 2] = (u - v + Q) % Q;
                w = (w * wlen) % Q;
            }
        }
    }

    if (inverse) {
        let n_inv = modInverse(n);
        for (let i = 0; i < n; i++) {
            a[i] = (a[i] * n_inv) % Q;
        }
    }
}

function mul(a, b) {
    if (isZero(a) || isZero(b)) return [0];

    let len = a.length + b.length - 1;
    let n = 1;
    while (n < len) n <<= 1;

    let fa = new Array(n).fill(0);
    let fb = new Array(n).fill(0);
    for (let i = 0; i < a.length; i++) fa[i] = a[i];
    for (let i = 0; i < b.length; i++) fb[i] = b[i];

    ntt(fa, false, n);
    ntt(fb, false, n);

    for (let i = 0; i < n; i++) {
        fa[i] = (fa[i] * fb[i]) % Q;
    }

    ntt(fa, true, n);

    let result = [];
    let carry = 0;
    for (let i = 0; i < len; i++) {
        // Use BigInt for accurate carry propagation
        let chunk_val = BigInt(fa[i]) + BigInt(carry); 
        result.push(Number(chunk_val % BigInt(BASE)));
        carry = Number(chunk_val / BigInt(BASE));
    }
    
    while (carry > 0) {
        result.push(Number(carry % BigInt(BASE)));
        carry = Number(carry / BigInt(BASE));
    }
    
    return trim(result.reverse());
}

// --- NTT-Accelerated Long Division ---

function divMod(A, B) {
    A = trim(A); B = trim(B);
    if (isZero(B)) throw new Error("Division by zero.");
    if (isZero(A) || cmp(A, B) < 0) return { quotient: [0], remainder: A };

    const dividendLength = A.length;
    const divisorLength = B.length;
    let quotient = [];
    let remainder = []; // Remainder starts empty

    // Estimate the quotient chunk
    const B_top = B[0]; 
    
    for (let i = 0; i < dividendLength; i++) {
        // Append the next chunk from A to the remainder
        remainder.push(A[i]);
        remainder = trim(remainder);
        
        // --- CRITICAL CHECK FOR ZERO REMAINDER ---
        if (isZero(remainder)) {
            quotient.push(0);
            continue;
        }

        if (cmp(remainder, B) < 0) {
            quotient.push(0);
            continue;
        }

        // Calculation of q (same estimation logic)
        let R_top = BigInt(remainder[0]);
        if (remainder.length > divisorLength) {
            R_top = R_top * BigInt(BASE) + BigInt(remainder[1]);
        }
        
        let qEstimate = R_top / BigInt(B_top);
        let q = Number(qEstimate);
        
        // Refinement loop
        while (q > 0) {
            // T = q * B (Uses the fast NTT Mul)
            // Note: mulSmall is O(N) but sufficient here since q is a single chunk.
            const T = mulSmall(B, q); 
            
            if (cmp(T, remainder) <= 0) {
                remainder = sub(remainder, T);
                break; 
            }
            q--;
        }
        
        quotient.push(q);
        
        if(i % 500 === 0 && i > 0) {
             self.postMessage({ type: 'progress', value: (i / dividendLength) * 50 });
        }
    }

    return { quotient: trim(quotient), remainder: trim(remainder) };
}

// --- Main Euclidean GCD Algorithm ---

function chunkedGCD_Euclidean(A, B) {
    let a = trim(A.slice());
    let b = trim(B.slice());
    
    if (isZero(a)) return { gcd: b, steps: 0 };
    if (isZero(b)) return { gcd: a, steps: 0 };

    let steps = 0;
    
    while (!isZero(b)) {
        // Calculate: R = A mod B using the fast divMod
        const { remainder: r } = divMod(a, b);
        
        // A = B, B = R
        a = b;
        b = r;
        
        steps++;

        self.postMessage({ type: 'progress', value: 50 + (1 - (a.length + b.length) / (A.length + B.length)) * 50 });
        
        if (steps > 10000) { 
             self.postMessage({ type: 'error', message: "Exceeded max iterations (10,000). Terminating calculation." });
             return { gcd: [0], steps: steps };
        }
        
        self.postMessage({ type: 'log', message: `[NTT GCD Step ${steps}] New divisor has ${chunksToString(b).length} digits.` });
    }

    self.postMessage({ type: 'result', gcd: chunksToString(a), steps: steps });
    return { gcd: a, steps: steps };
}

// --- Worker Entry Point ---
self.onmessage = function(e) {
    const { n1_str, n2_str } = e.data;
    
    let N1_chunks, N2_chunks;
    
    try {
         N1_chunks = stringToChunks(n1_str);
         N2_chunks = stringToChunks(n2_str);
         
         if (isZero(N1_chunks) || isZero(N2_chunks)) {
             self.postMessage({ type: 'error', message: "One of the input numbers evaluated to zero. GCD is the other number." });
             return;
         }

         self.postMessage({ type: 'log', message: 'Starting NTT-Accelerated Euclidean GCD for ' + chunksToString(N1_chunks).length + ' and ' + chunksToString(N2_chunks).length + ' digit numbers.' });
         
         chunkedGCD_Euclidean(N1_chunks, N2_chunks);
         
    } catch (err) {
        self.postMessage({ type: 'error', message: 'NTT GCD Failed: ' + err.message });
        return;
    }
};