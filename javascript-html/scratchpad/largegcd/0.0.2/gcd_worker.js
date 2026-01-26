// --- Worker Constants ---
const chunk_size = 9; 
const BASE = 10 ** chunk_size;

// --- Utility Functions (trim, cmp, add, sub, mulSmall, chunksToString, stringToChunks, isZero, isEven, divideByTwo remain the same as the previous version) ---
// Note: Only the main 'mul' function is changing, but all arithmetic dependencies must be present.

/**
 * Removes leading zeros from a chunked array. Returns [0] if the number is zero.
 */
function trim(c) {
    let i = 0;
    if (!Array.isArray(c) || c.length === 0) return [0];
    while (i < c.length - 1 && c[i] === 0) i++;
    if (i === c.length) return [0];
    return c.slice(i);
}

/**
 * Compares two chunked numbers: 1 if A > B, -1 if A < B, 0 if A = B.
 */
function cmp(a, b) {
    a = trim(a); b = trim(b);
    if (a.length !== b.length) return a.length > b.length ? 1 : -1;
    for (let i = 0; i < a.length; i++) {
        if (a[i] !== b[i]) return a[i] > b[i] ? 1 : -1;
    }
    return 0;
}

/**
 * Addition: A + B
 */
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

/**
 * Subtraction: A - B, assumes A >= B.
 */
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

/**
 * Multiplication by a single chunk/small integer S. 
 */
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

// --- NEW KARATSUBA MULTIPLICATION ---

/**
 * Karatsuba Multiplication: A * B
 * O(L^1.58) where L is the number of chunks.
 * Switches to naive multiplication below a certain threshold for efficiency.
 */
function mul(a, b) {
    a = trim(a);
    b = trim(b);
    if (isZero(a) || isZero(b)) return [0];

    // Naive threshold: Karatsuba is only efficient for large numbers
    const KARATSUBA_THRESHOLD = 10; 

    // If numbers are small enough, use efficient naive multiplication (O(L^2))
    if (a.length <= KARATSUBA_THRESHOLD || b.length <= KARATSUBA_THRESHOLD) {
        return mulNaive(a, b);
    }

    // Ensure lengths are equal by padding with zeros (Karatsuba requirement)
    const n = Math.max(a.length, b.length);
    const m = Math.floor((n + 1) / 2); // Split point (index relative to the left/MSB)

    // Pad A and B to the same length for splitting
    while (a.length < n) a.unshift(0);
    while (b.length < n) b.unshift(0);

    // Split A and B: A = A_hi * BASE^m + A_lo, B = B_hi * BASE^m + B_lo
    const a_hi = a.slice(0, n - m);
    const a_lo = a.slice(n - m);
    const b_hi = b.slice(0, n - m);
    const b_lo = b.slice(n - m);

    // 1. Recursive calculation of z2 = A_hi * B_hi
    const z2 = mul(a_hi, b_hi);
    
    // 2. Recursive calculation of z0 = A_lo * B_lo
    const z0 = mul(a_lo, b_lo);

    // 3. Recursive calculation of z1 = (A_hi + A_lo) * (B_hi + B_lo) - z2 - z0
    const a_sum = add(a_hi, a_lo);
    const b_sum = add(b_hi, b_lo);
    let z1 = mul(a_sum, b_sum);
    
    z1 = sub(z1, z2);
    z1 = sub(z1, z0);

    // Final result is: z2 * BASE^(2m) + z1 * BASE^m + z0
    
    // Shift z2 by 2m (append 2m zeros)
    let shifted_z2 = z2.slice();
    for (let i = 0; i < 2 * m; i++) shifted_z2.push(0);

    // Shift z1 by m (append m zeros)
    let shifted_z1 = z1.slice();
    for (let i = 0; i < m; i++) shifted_z1.push(0);

    // Combine: result = shifted_z2 + shifted_z1 + z0
    let result = add(shifted_z2, shifted_z1);
    result = add(result, z0);
    
    return trim(result);
}

/**
 * Naive (Schoolbook) Multiplication, used as the base case for Karatsuba.
 */
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

// --- Chunked Exponentiation (uses the new Karatsuba-based mul) ---

function pow(baseChunks, exponentStr) {
    let exponent = BigInt(exponentStr);
    if (exponent < 0n) throw new Error("Exponent must be non-negative.");
    if (exponent === 0n) return stringToChunks("1");
    if (exponent === 1n) return baseChunks;
    
    let result = stringToChunks("1");
    let base = baseChunks.slice();

    // Safety break limit increased significantly due to Karatsuba speed
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


/**
 * Converts chunked array to a single string for display.
 */
function chunksToString(chunks) {
    if (!chunks || chunks.length === 0 || isZero(chunks)) return "0";
    let trimmed = trim(chunks);
    let s = trimmed[0].toString();
    for (let i = 1; i < trimmed.length; i++) {
        s += trimmed[i].toString().padStart(chunk_size, '0');
    }
    return s;
}

/**
 * Converts a number string into a chunked array (MSB-first).
 */
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


// --- Specific Binary GCD Utilities ---

function isZero(c) {
    c = trim(c);
    return c.length === 1 && c[0] === 0;
}

function isEven(c) {
    c = trim(c);
    if (isZero(c)) return true;
    return c[c.length - 1] % 2 === 0;
}

/**
 * Divides a chunked number by 2 (right shift).
 */
function divideByTwo(c) {
    c = trim(c);
    if (isZero(c)) return [0];
    let out = [];
    let carry = 0; 
    for (const chunk of c) {
        let val = chunk + carry * BASE;
        out.push(Math.floor(val / 2));
        carry = val % 2; 
    }
    return trim(out);
}

// --- Main Binary GCD (Stein's) Algorithm ---

function chunkedGCD(A, B) {
    let a = trim(A.slice());
    let b = trim(B.slice());
    
    if (isZero(a)) return b;
    if (isZero(b)) return a;

    let k = 0; 
    let steps = 0;
    
    // Step 1: Divide out common factors of 2
    while (isEven(a) && isEven(b)) {
        a = divideByTwo(a);
        b = divideByTwo(b);
        k++;
        if(++steps % 2500 === 0) self.postMessage({ type: 'log', message: '[GCD Step ' + steps + ']: Factoring out 2\'s. Common factor 2^' + k + '.' });
    }
    
    // Step 2: Divide out factors of 2 from A until A is odd
    while (isEven(a)) {
        a = divideByTwo(a);
        if(++steps % 2500 === 0) self.postMessage({ type: 'log', message: '[GCD Step ' + steps + ']: Halving even A (A is now odd).' });
    }
    
    // Step 3: Main loop (A is odd, B might be even or odd)
    while (!isZero(b)) {
        // Step 3a: Divide out factors of 2 from B
        while (isEven(b)) {
            b = divideByTwo(b);
            if(++steps % 2500 === 0) self.postMessage({ type: 'log', message: '[GCD Step ' + steps + ']: Halving even B.' });
        }
        
        // Step 3b: Ensure a <= b, then subtract (b = |a - b|)
        if (cmp(a, b) > 0) { 
            b = sub(a, b); 
            [a, b] = [b, a]; // Swap: a becomes the new smaller number
        } else {
            b = sub(b, a); // b is now the difference, which must be even
        }
        
        // Progress reporting (every 100 steps)
        if(steps % 100 === 0) {
             const progressEstimate = k * 10 + Math.min(10, (1 - (a.length + b.length) / (A.length + B.length)) * 100);
             self.postMessage({ type: 'progress', value: Math.min(99.9, progressEstimate) });
        }
        
        // Safety break for extremely long calculations
        if(steps > 4000000) { 
             self.postMessage({ type: 'error', message: "Exceeded max iterations (4,000,000). Terminating calculation to prevent lockup." });
             return [0];
        }
    }

    // Step 4: GCD is A * 2^k
    let result = a;
    for(let i = 0; i < k; i++) {
         result = mulSmall(result, 2);
    }
    
    self.postMessage({ type: 'result', gcd: chunksToString(result), steps: steps });
    return result;
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
         self.postMessage({ type: 'log', message: 'Starting Binary GCD for ' + chunksToString(N1_chunks).length + ' and ' + chunksToString(N2_chunks).length + ' digit numbers.' });
         
         chunkedGCD(N1_chunks, N2_chunks);
         
    } catch (err) {
        self.postMessage({ type: 'error', message: 'Failed to calculate GCD: ' + err.message });
        return;
    }
};