// Worker for Karatsuba-Optimized Modular Exponentiation (PowMod)

self.importScripts('https://unpkg.com/big-integer@1.6.48/BigInteger.min.js');

// Implements base^exp mod modulus using exponentiation by squaring (binary exponentiation).
// Leveraging big-integer.js ensures Karatsuba multiplication is used for large base*base steps.
function modularExponentiation(base_str, exp_str, mod_str, postMessage) {
    let base = self.bigInt(base_str);
    let exp = self.bigInt(exp_str);
    const mod = self.bigInt(mod_str);

    if (mod.lesserOrEquals(1)) {
        throw new Error("Modulus must be greater than 1.");
    }
    
    let result = self.bigInt.one;
    base = base.mod(mod); // Initial reduction
    
    // We use the binary representation of the exponent to track progress
    const expBinary = exp_str;
    const totalBits = expBinary.length;
    let processedBits = 0;
    
    // Safety check and loop control
    const expZero = self.bigInt.zero;

    while (exp.greater(expZero)) {
        
        // If exp is odd (last bit is 1), multiply result by base mod modulus
        if (exp.isOdd()) {
            result = result.multiply(base).mod(mod);
        }
        
        // exp = exp / 2 (right shift)
        exp = exp.shiftRight(1);
        
        // base = base^2 mod modulus
        // Karatsuba multiplication is used here by big-integer.js's .square() and .multiply()
        base = base.square().mod(mod);
        
        processedBits++;
        
        // Progress reporting (Throttle)
        if (processedBits % 100 === 0) {
            const progress = (processedBits / totalBits) * 100;
            postMessage({ type: 'progress', progress: progress });
        }
    }
    
    postMessage({ type: 'progress', progress: 100 });
    return result;
}


self.onmessage = function(e) {
    const { base, exp, mod } = e.data;
    
    try {
        const result = modularExponentiation(base, exp, mod, self.postMessage);
        self.postMessage({ type: 'result', result: result.toString() });

    } catch (error) {
        self.postMessage({ type: 'error', message: error.message });
    }
};
