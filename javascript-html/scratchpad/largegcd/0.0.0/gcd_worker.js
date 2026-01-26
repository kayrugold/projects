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
 * Multiplication by a small integer S. Used only for the final result step (GCD * 2^k).
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
 * Converts a large number string into a chunked array (MSB-first).
 */
function stringToChunks(s) {
    if (typeof s !== 'string' || s.length === 0) return [0];
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
    // Carry must be 0 or 1. BASE (10^9) is even.
    for (const chunk of c) {
        let val = chunk + carry * BASE;
        out.push(Math.floor(val / 2));
        carry = val % 2; 
    }
    return trim(out);
}

// --- N String Generation (limited to base 10) ---

/**
 * Generates the massive number string from the a^b+c components.
 */
function generateNString(aStr, bStr, cStr, name) {
    const a = BigInt(aStr);
    if (a !== 10n) {
        throw new Error('String generation currently only supports base 10 for ' + name + '.');
    }
    
    const b = BigInt(bStr);
    const c = BigInt(cStr);
    
    if (b < 0n) {
        throw new Error('Exponent (' + bStr + ') for ' + name + ' must be non-negative.');
    }
    
    const cStrVal = c.toString();
    const cLen = cStrVal.length;

    // Handle case where exponent is too small for the a^b+c format
    if (b < cLen) {
         const result = (10n ** b + c).toString(); 
         self.postMessage({ type: 'log', message: name + ' is small (' + result.length + ' digits). Direct BigInt calculation.' });
         return result;
    }

    const numZeros = b - BigInt(cLen);
    let nStr = '1';

    // Protect against massive memory allocation in JS engine
    const practicalZeroLimit = 2000000; 
    const zerosToRepeat = numZeros < BigInt(practicalZeroLimit) ? numZeros : BigInt(practicalZeroLimit);
    
    if (zerosToRepeat < numZeros) {
        self.postMessage({ type: 'log', message: 'WARNING: ' + name + ' exponent (' + bStr + ') is huge. Limiting string to ' + (Number(zerosToRepeat) + cLen + 1) + ' digits for calculation.' });
    }
    
    if (zerosToRepeat > 0) {
        nStr += '0'.repeat(Number(zerosToRepeat));
    }
    nStr += cStrVal.padStart(cLen, '0');

    return nStr;
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
        if(++steps % 25000 === 0) self.postMessage({ type: 'log', message: '[GCD Step ' + steps + ']: Factoring out 2\'s. Common factor 2^' + k + '.' });
    }
    
    // Step 2: Divide out factors of 2 from A until A is odd
    while (isEven(a)) {
        a = divideByTwo(a);
        if(++steps % 25000 === 0) self.postMessage({ type: 'log', message: '[GCD Step ' + steps + ']: Halving even A (A is now odd).' });
    }
    
    // Step 3: Main loop (A is odd, B might be even or odd)
    while (!isZero(b)) {
        // Step 3a: Divide out factors of 2 from B
        while (isEven(b)) {
            b = divideByTwo(b);
            if(++steps % 25000 === 0) self.postMessage({ type: 'log', message: '[GCD Step ' + steps + ']: Halving even B.' });
        }
        
        // Step 3b: Ensure a <= b, then subtract (b = |a - b|)
        if (cmp(a, b) > 0) { 
            b = sub(a, b); 
            [a, b] = [b, a]; // Swap: a becomes the new smaller number
        } else {
            b = sub(b, a); // b is now the difference, which must be even
        }
        
        // Note: The difference (b) must be even, and it will be halved in the next iteration 
        // by the inner `while(isEven(b))` loop.
        
        // Progress reporting (every 1000 steps)
        if(steps % 1000 === 0) {
             const currentTotalLength = a.length + b.length;
             const initialTotalLength = A.length + B.length;
             const progressEstimate = ((initialTotalLength - currentTotalLength) / initialTotalLength) * 100;
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
    
    let n1Str, n2Str;
    
    try {
         self.postMessage({ type: 'log', message: 'Generating string representation of Number 1 (N)...' });
         n1Str = generateNString(n1_a, n1_b, n1_c, "Number 1");
         
         self.postMessage({ type: 'log', message: 'Generating string representation of Number 2 (M)...' });
         n2Str = generateNString(n2_a, n2_b, n2_c, "Number 2");
         
         self.postMessage({ type: 'log', message: 'Converting strings to chunked arrays...' });
         const N1_chunks = stringToChunks(n1Str);
         const N2_chunks = stringToChunks(n2Str);
         
         self.postMessage({ type: 'log', message: 'Starting Binary GCD for ' + chunksToString(N1_chunks).length + ' and ' + chunksToString(N2_chunks).length + ' digit numbers.' });
         
         chunkedGCD(N1_chunks, N2_chunks);
         
    } catch (err) {
        self.postMessage({ type: 'error', message: 'Failed to calculate GCD: ' + err.message });
        return;
    }
};