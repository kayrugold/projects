// --- LLT Worker: Karatsuba Arithmetic and Modular Reduction ---

const chunk_size = 9; 
const BASE = 10 ** chunk_size;
const EXPONENT_LIMIT = 32000; 
const KARATSUBA_THRESHOLD = 10; 

// --- Utility Functions ---
function trim(c) {
    let i = 0;
    if (!Array.isArray(c) || c.length === 0) return [0];
    while (i < c.length - 1 && c[i] === 0) i++;
    if (i === c.length) return [0];
    return c.slice(i);
}

function isZero(c) {
    c = trim(c);
    return c.length === 1 && c[0] === 0;
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

function chunksToBigInt(chunks) {
    return BigInt(chunksToString(chunks));
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

// --- Karatsuba Multiplication ---
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


// --- LUCAS-LEHMER TEST CORE SEQUENCE ---

// Helper to convert chunked base 10 to a very long binary string (slow, but needed for slicing)
// This is the bottleneck, but only runs once per reduction.
function chunksToBinary(chunks) {
    // This is slow but necessary for accurate bit-slicing
    return chunksToBigInt(chunks).toString(2);
}

// Helper to convert binary string back to chunked base 10 (slow)
function binaryToChunks(binStr) {
    return stringToChunks(BigInt('0b' + binStr).toString(10));
}

// --- Specialized Mersenne Reduction: R = (A >> p) + (A & M_p) mod M_p ---
function LLT_modularReduction(A_chunks, p) {
    // 1. Convert the chunked number A to its binary string representation
    let A_bin = chunksToBinary(A_chunks);
    let n = A_bin.length;
    
    // 2. The Mersenne Modulus is M_p = 2^p - 1.
    // This means M_p has p bits, all set to 1.
    // The modulus operation is simple:
    
    // R_top = A >> p
    let R_top_bin = (n > p) ? A_bin.substring(0, n - p) : '0';
    
    // R_bottom = A & M_p (which is A mod 2^p)
    let R_bottom_bin = (n > p) ? A_bin.substring(n - p) : A_bin;
    
    // If the binary string is shorter than p, pad the bottom part with leading zeros
    if (R_bottom_bin.length < p) {
        R_bottom_bin = '0'.repeat(p - R_bottom_bin.length) + R_bottom_bin;
    }
    
    // 3. R = R_top + R_bottom (still potentially > M_p)
    let R_top_chunks = binaryToChunks(R_top_bin);
    let R_bottom_chunks = binaryToChunks(R_bottom_bin);
    
    let R = add(R_top_chunks, R_bottom_chunks);
    
    // 4. Final reduction (R is now at most 2*M_p - 2, so at most one subtraction needed)
    // We assume M_p is slightly less than 2^p
    const Mp_bi = BigInt(2)**BigInt(p) - 1n;
    const Mp_chunks = stringToChunks(Mp_bi.toString());
    
    if (cmp(R, Mp_chunks) >= 0) {
        R = sub(R, Mp_chunks);
    }
    
    return R;
}

function runLLT(p_str) {
    const p = parseInt(p_str, 10);
    
    if (p < 3 || p > EXPONENT_LIMIT) {
        throw new Error(`Exponent p must be between 3 and ${EXPONENT_LIMIT}.`);
    }

    self.postMessage({ type: 'log', message: `--- Starting Lucas-Lehmer Test for M_${p} ---` });
    
    // 1. Modulus Display
    const Mp_bi = BigInt(2)**BigInt(p) - 1n;
    self.postMessage({ type: 'modulus', Mp: Mp_bi.toString(), p: p, digits: Mp_bi.toString().length });
    
    // 2. Initialize S_0 = 4 (as chunked array)
    let S = stringToChunks("4");
    
    const steps = p - 2;
    
    for (let i = 0; i < steps; i++) {
        // --- Core Sequence: S_i = (S_{i-1}^2 - 2) mod M_p ---
        
        // Step A: S^2 (Karatsuba multiplication)
        let S_squared = mul(S, S); 
        
        // Step B: S^2 - 2
        let S_minus_2 = sub(S_squared, stringToChunks("2"));
        
        // Step C: Mod M_p (The Fast Mersenne Reduction)
        S = LLT_modularReduction(S_minus_2, p);
        
        // --- Progress and Log ---
        if (i % 10 === 0 || i === steps - 1) { // Increased logging for visibility
            const progress = ((i + 1) / steps) * 100;
            self.postMessage({ 
                type: 'progress', 
                value: progress, 
                step: i + 1, 
                totalSteps: steps
            });
        }
    }
    
    // 3. Final Check: S_{p-2} = 0?
    if (isZero(S)) {
        self.postMessage({ type: 'result', isPrime: true, p: p, finalS: "0" });
    } else {
        self.postMessage({ type: 'result', isPrime: false, p: p, finalS: chunksToString(S) });
    }
}


self.onmessage = function(e) {
    try {
        if (e.data.mode === 'LLT') {
            runLLT(e.data.p);
        } else {
            self.postMessage({ type: 'error', message: "Unknown mode received. LLT worker only supports 'LLT' mode." });
        }
    } catch (error) {
        self.postMessage({ type: 'error', message: error.message });
    }
};