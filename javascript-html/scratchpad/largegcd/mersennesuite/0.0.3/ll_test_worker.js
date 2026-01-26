// Worker for Karatsuba-Optimized Lucas-Lehmer Test (LLT)
// Uses a specialized Mersenne modular reduction for speed and stability.

self.importScripts('https://unpkg.com/big-integer@1.6.48/BigInteger.min.js');

// --- Helper function to convert chunked BigInt to a 2's Complement string ---
// This is necessary to simulate the bitwise shift/add property of Mersenne numbers.
function bigIntToBinaryString(n) {
    if (n.isZero()) return "0";
    let binary = "";
    let temp = n;
    while (temp.greater(0)) {
        if (temp.isOdd()) {
            binary = "1" + binary;
        } else {
            binary = "0" + binary;
        }
        temp = temp.shiftRight(1);
    }
    return binary;
}


// --- Specialized Modular Reduction for Mp = 2^p - 1 ---
// This is the CRITICAL optimization that replaces general division/modulo (which fails)
// A = S^2 - 2
// Modulus M_p = 2^p - 1
// Identity: A mod (2^p - 1) = (A >> p) + (A & (2^p - 1))
function LLT_modularReduction(S_sq, p_bi) {
    const p = p_bi.toJSNumber();
    
    let remainder = S_sq;
    const M_p = self.bigInt(2).pow(p).subtract(1);

    // This loop is a safety net, but ideally, the shift/add should only run 1-2 times.
    let reductionSteps = 0;
    const maxReductionSteps = 3; 

    // Because we are in base-10 chunks, we use BigInt shift/mask operations, which are
    // built on top of the library's Karatsuba-accelerated BigInt operations.
    // This is significantly faster than repeated subtraction.

    while (remainder.greaterOrEquals(M_p) && reductionSteps < maxReductionSteps) {
        // High part (A >> p)
        const high = remainder.shiftRight(p);
        
        // Low part (A & M_p)
        const low = remainder.and(M_p);
        
        // Next remainder = high + low
        remainder = high.add(low);
        reductionSteps++;
    }

    // Final subtraction might be needed if the number is slightly over 2^p - 1
    if (remainder.greaterOrEquals(M_p)) {
        remainder = remainder.subtract(M_p);
    }
    
    return remainder;
}

// --- Main LLT Sequence ---
self.onmessage = function(e) {
    const pStr = e.data.p;
    const p = self.bigInt(pStr);
    const p_int = p.toJSNumber();

    const M_p = self.bigInt(2).pow(p).subtract(1);
    const sequenceLength = p.subtract(2);
    
    // S_0 = 4
    let S = self.bigInt(4); 
    
    let lastProgress = 0;
    const startTime = Date.now();

    for (let i = 0; S.lesser(M_p) && i < p_int - 2; i++) {
        
        // 1. S^2 (Karatsuba multiplication is used internally by big-integer.js)
        let S_sq = S.square();

        // 2. S^2 - 2
        let S_minus_2 = S_sq.subtract(2);

        // 3. Modular Reduction (The core LLT optimization)
        // This is equivalent to S_i = (S_{i-1}^2 - 2) mod M_p
        S = LLT_modularReduction(S_minus_2, p);

        // 4. Progress Reporting (Throttle to prevent UI lockup)
        if (i % 25 === 0) {
            const currentProgress = Math.floor((i / sequenceLength) * 100);
            if (currentProgress > lastProgress) {
                self.postMessage({ type: 'progress', progress: currentProgress });
                lastProgress = currentProgress;
            }
        }
    }

    // Final result check: S_{p-2} = 0
    const isPrime = S.isZero();

    // Final result
    self.postMessage({ type: 'result', isPrime: isPrime });
};
