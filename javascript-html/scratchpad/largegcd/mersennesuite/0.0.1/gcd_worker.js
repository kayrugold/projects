// --- Worker Constants ---
const chunk_size = 9; 
const BASE = 10 ** chunk_size;

// --- Utility Functions (trim, cmp, add, sub, mulSmall, mulNaive, mul, pow, chunksToString, stringToChunks, isZero, isEven, divideByTwo remain the same as the previous version) ---
// Note: These functions are kept the same for brevity but must be present.
function trim(c) {
    let i = 0;
    if (!Array.isArray(c) || c.length === 0) return [0];
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

function isZero(c) {
    c = trim(c);
    return c.length === 1 && c[0] === 0;
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

function sub(a, b) { 
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
    if (!chunks || chunks.length === 0 || isZero(chunks)) return "0";
    let trimmed = trim(chunks);
    let s = trimmed[0].toString();
    for (let i = 1; i < trimmed.length; i++) {
        s += trimmed[i].toString().padStart(chunk_size, '0');
    }
    return s;
}

function stringToChunks(s) {
    if (typeof s !== 'string' || s.length === 0) return [0];
    s = s.trim();
    if (!/^\d+$/.test(s)) throw new Error("Input string is not a valid non-negative integer.");

    const padLength = (chunk_size - (s.length % chunk_size)) % chunk_size;
    s = '0'.repeat(padLength) + s;
    const chunks = [];
    for (let i = 0; i < s.length; i += chunk_size) {
        const chunkStr = s.substring(i, i + chunk_size);
        chunks.push(parseInt(chunkStr, 10));
    }
    return trim(chunks);
}

const KARATSUBA_THRESHOLD = 10; 

function mulNaive(a, b) {
    if (isZero(a) || isZero(b)) return [0];
    if (a.length < b.length) [a, b] = [b, a];

    let result = [0];
    let b_rev = b.slice().reverse();
    
    for (let i = 0; i < b_rev.length; i++) {
        const chunk_b = b_rev[i];
        let partial_product = mulSmall(a, chunk_b);
        for (let j = 0; j < i; j++) {
            partial_product.push(0);
        }
        result = add(result, partial_product);
    }
    return trim(result);
}

function mul(a, b) {
    a = trim(a); b = trim(b);
    if (isZero(a) || isZero(b)) return [0];

    if (a.length <= KARATSUBA_THRESHOLD || b.length <= KARATSUBA_THRESHOLD) {
        return mulNaive(a, b);
    }

    const n = Math.max(a.length, b.length);
    const m = Math.floor((n + 1) / 2);

    while (a.length < n) a.unshift(0);
    while (b.length < n) b.unshift(0);

    const a_hi = a.slice(0, n - m);
    const a_lo = a.slice(n - m);
    const b_hi = b.slice(0, n - m);
    const b_lo = b.slice(n - m);

    const z2 = mul(a_hi, b_hi);
    const z0 = mul(a_lo, b_lo);

    const a_sum = add(a_hi, a_lo);
    const b_sum = add(b_hi, b_lo);
    let z1 = mul(a_sum, b_sum);
    
    z1 = sub(z1, z2);
    z1 = sub(z1, z0);

    let shifted_z2 = z2.slice();
    for (let i = 0; i < 2 * m; i++) shifted_z2.push(0);

    let shifted_z1 = z1.slice();
    for (let i = 0; i < m; i++) shifted_z1.push(0);

    let result = add(shifted_z2, shifted_z1);
    result = add(result, z0);
    
    return trim(result);
}

function pow(baseChunks, exponentStr) {
    let exponent = BigInt(exponentStr);
    if (exponent < 0n) throw new Error("Exponent must be non-negative.");
    if (exponent === 0n) return stringToChunks("1");
    if (exponent === 1n) return baseChunks;
    
    let result = stringToChunks("1");
    let base = baseChunks.slice();

    const MAX_DIGIT_LIMIT = 2000000; 

    while (exponent > 0n) {
        if (exponent % 2n === 1n) {
            result = mul(result, base);
            self.postMessage({ type: 'log', message: '[Exponentiation] Multiplied into result. Current result size: ' + chunksToString(result).length + ' digits.' });
        }
        
        base = mul(base, base);
        exponent /= 2n;

        if (chunksToString(base).length > MAX_DIGIT_LIMIT) {
             throw new Error(`Base size exceeded ${MAX_DIGIT_LIMIT} digits during exponentiation.`);
        }
    }
    return trim(result);
}

// --- KARATSUBA-ACCELERATED LONG DIVISION (DIVMOD) ---
function divMod(A, B) {
    A = trim(A); B = trim(B);
    if (isZero(B)) throw new Error("Division by zero.");
    if (isZero(A)) return { quotient: [0], remainder: [0] };
    if (cmp(A, B) < 0) return { quotient: [0], remainder: A };

    const dividendLength = A.length;
    const divisorLength = B.length;
    let quotient = [];
    let remainder = [];
    let refinementSteps = 0;

    // Use the leading chunk of B (B[0]) for estimation
    const B_top_chunk = B[0]; 

    for (let i = 0; i < dividendLength; i++) {
        // Append the next chunk from A to the remainder
        remainder.push(A[i]);
        remainder = trim(remainder);

        // If the current remainder is shorter than the divisor, the quotient chunk is 0
        if (remainder.length < divisorLength) {
            quotient.push(0);
            continue;
        }

        // --- Estimate the Quotient Digit (q) ---
        let qEstimate;
        
        // Use up to 2 chunks of R and 1 chunk of B for initial guess (standard normalization)
        let R_top_val = remainder[0];
        if (remainder.length > divisorLength) {
            // R is longer than B, use two chunks of R to get better precision
            R_top_val = remainder[0] * BASE + remainder[1];
        }

        // Guess the quotient chunk
        qEstimate = Math.floor(R_top_val / B_top_chunk);
        
        // Clamp the estimate to prevent overflow and ensure it's not BASE
        let q = Math.min(BASE - 1, Math.max(0, qEstimate));


        // --- Refinement Loop ---
        while (q > 0) {
            // Check 1: If R is same length as B, but R is smaller, q must be 0 (handled by 'continue' above)
            // Check 2: Trial Product T = q * B (Uses mulSmall since q is a single chunk)
            const T = mulSmall(B, q); 
            
            // Optimization Check: If the trial product T exceeds the remainder R
            if (cmp(T, remainder) <= 0) {
                // Found the correct quotient chunk q (or maybe q is 0)
                remainder = sub(remainder, T);
                break; 
            }
            
            // If T > R, the guess q was too large. Decrement.
            q--;
            refinementSteps++;
            
            if (refinementSteps > 100000) { 
                throw new Error("Division stalled: Too many refinement steps.");
            }
        }
        
        quotient.push(q);
        
        // Progress update every few thousand steps
        if(i % 500 === 0 && i > 0) {
             self.postMessage({ type: 'progress', value: (i / dividendLength) * 50 }); // First half of total progress
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
    
    self.postMessage({ type: 'log', message: '[GCD] Starting Fast Euclidean Algorithm.' });
    
    while (!isZero(b)) {
        // Calculate: R = A mod B using the fast divMod
        const { remainder: r } = divMod(a, b);
        
        // A = B, B = R
        a = b;
        b = r;
        
        steps++;

        // Progress update 
        self.postMessage({ type: 'progress', value: 50 + (1 - (a.length + b.length) / (A.length + B.length)) * 50 });
        
        if (steps > 10000) { // Safety break
             self.postMessage({ type: 'error', message: "Exceeded max iterations (10,000). Terminating calculation to prevent lockup." });
             return { gcd: [0], steps: steps };
        }
        
        self.postMessage({ type: 'log', message: `[GCD Step ${steps}] New divisor has ${chunksToString(b).length} digits.` });
    }

    self.postMessage({ type: 'result', gcd: chunksToString(a), steps: steps });
    return { gcd: a, steps: steps };
}

// --- Worker Entry Point ---
self.onmessage = function(e) {
    self.postMessage({ type: 'log', message: 'Worker initialized and ready.' });
    
    const { n1_a, n1_b, n1_c, n2_a, n2_b, n2_c } = e.data;
    
    let N1_chunks, N2_chunks;
    
    try {
        // --- Calculate N = a^b + c ---
         self.postMessage({ type: 'log', message: `Calculating N = ${n1_a}^${n1_b} + ${n1_c}` });
         
         const base1Chunks = stringToChunks(n1_a);
         const power1Chunks = pow(base1Chunks, n1_b);
         const addend1Chunks = stringToChunks(n1_c);
         N1_chunks = add(power1Chunks, addend1Chunks);

        // --- Calculate M = a^b + c ---
         self.postMessage({ type: 'log', message: `Calculating M = ${n2_a}^${n2_b} + ${n2_c}` });
         
         const base2Chunks = stringToChunks(n2_a);
         const power2Chunks = pow(base2Chunks, n2_b);
         const addend2Chunks = stringToChunks(n2_c);
         N2_chunks = add(power2Chunks, addend2Chunks);
         
         // --- Start GCD ---
         self.postMessage({ type: 'log', message: 'Starting Karatsuba-Euclidean GCD for ' + chunksToString(N1_chunks).length + ' and ' + chunksToString(N2_chunks).length + ' digit numbers.' });
         
         chunkedGCD_Euclidean(N1_chunks, N2_chunks);
         
    } catch (err) {
        self.postMessage({ type: 'error', message: 'Failed to calculate GCD: ' + err.message });
        return;
    }
};