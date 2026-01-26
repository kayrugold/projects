// --- Worker Constants ---
const chunk_size = 9; 
const BASE = 10 ** chunk_size;

// --- Chunked Arithmetic Utilities (MSB-first) ---

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

/**
 * FULL Chunked Multiplication (Schoolbook Algorithm): A * B
 * This is O(L^2) where L is the number of chunks.
 */
function mul(a, b) {
    if (isZero(a) || isZero(b)) return [0];
    
    // Ensure B is the shorter number for slightly faster loop setup
    if (a.length < b.length) [a, b] = [b, a];

    let result = [0];
    let b_rev = b.slice().reverse();
    
    for (let i = 0; i < b_rev.length; i++) {
        const chunk_b = b_rev[i];
        
        // Multiply A by one chunk of B
        let partial_product = mulSmall(a, chunk_b);
        
        // Apply positional shift (multiply by BASE^i)
        for (let j = 0; j < i; j++) {
            partial_product.push(0);
        }
        
        // Add to the final result
        result = add(result, partial_product);
        
        // Progress indicator update
        if (i % 20 === 0 && i > 0) {
            self.postMessage({ type: 'log', message: '[Multiplication] Processed ' + (i + 1) + '/' + b_rev.length + ' chunks of the second factor.' });
        }
    }
    return trim(result);
}


/**
 * Chunked Exponentiation (Binary Exponentiation / Power Modulo)
 * Calculates A^b using binary exponentiation (multiplications)
 * b is a BigInt for the exponent.
 */
function pow(baseChunks, exponentStr) {
    let exponent = BigInt(exponentStr);
    if (exponent < 0n) throw new Error("Exponent must be non-negative.");
    if (exponent === 0n) return stringToChunks("1");
    if (exponent === 1n) return baseChunks;
    
    let result = stringToChunks("1");
    let base = baseChunks.slice();

    while (exponent > 0n) {
        if (exponent % 2n === 1n) {
            result = mul(result, base);
            self.postMessage({ type: 'log', message: '[Exponentiation] Multiplied into result. Current result size: ' + chunksToString(result).length + ' digits.' });
        }
        
        base = mul(base, base);
        exponent /= 2n;

        // Safety break
        if (chunksToString(base).length > 200000) { // Limit number of digits to 200k for O(L^2) complexity
             throw new Error("Base size exceeded 200,000 digits during exponentiation (limit for Naive Multiplication).");
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
    
    // Ensure input is trimmed and valid before chunking
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