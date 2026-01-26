// Worker for Karatsuba-Optimized Extended Euclidean Algorithm (EEA)
// Requires big-integer.js for all operations

self.importScripts('https://unpkg.com/big-integer@1.6.48/BigInteger.min.js');

// --- EEA Implementation ---
// Finds g = gcd(a, b) and coefficients x, y such that a*x + b*y = g
function extendedEuclideanAlgorithm(a_str, b_str, postMessage, labelA, labelB) {
    let r0 = self.bigInt(a_str);
    let r1 = self.bigInt(b_str);

    // Initial coefficient values
    let x0 = self.bigInt.one;
    let y0 = self.bigInt.zero;
    let x1 = self.bigInt.zero;
    let y1 = self.bigInt.one;

    let steps = 0;
    const startTime = Date.now();
    const safetyLimit = 1000000;

    postMessage({ type: 'log', message: `EEA Step 1: r = ${r0}, ${r1}` });

    while (r1.greater(0)) {
        if (steps > safetyLimit) {
            throw new Error(`EEA stalled: Exceeded ${safetyLimit} steps.`);
        }
        
        // r0 = q * r1 + r2
        const q = r0.divide(r1);
        
        // r2 = r0 - q * r1
        const r2 = r0.subtract(q.multiply(r1));
        
        // Update r, x, and y coefficients
        const x2 = x0.subtract(q.multiply(x1));
        const y2 = y0.subtract(q.multiply(y1));

        // Shift register
        r0 = r1; r1 = r2;
        x0 = x1; x1 = x2;
        y0 = y1; y1 = y2;
        
        steps++;

        if (steps % 1000 === 0) {
            postMessage({ type: 'progress', progress: 50 + (steps / safetyLimit) * 50 }); // Rough progress
        }
        
        if (steps % 1 === 0 && r1.greater(0)) { // Log every step for smaller problems
            postMessage({ type: 'log', message: `EEA Step ${steps + 1}: r = ${r0}, ${r1}` });
        }
    }

    // Final result is stored in r0 (the last non-zero remainder)
    const g = r0;
    const x = x0;
    const y = y0;

    // Handle negative GCD results if input was negative (should not happen with BigInt, but ensures positive GCD)
    if (g.lesser(0)) {
        return { g: g.negate(), x: x.negate(), y: y.negate(), steps, labelA, labelB };
    }

    // The calculated x might be negative. Normalize x to be within [0, |b|/g - 1].
    // This is useful for finding the standard modular inverse.
    const b_abs = self.bigInt(b_str).abs();
    const g_div = b_abs.divide(g); // |b| / gcd(a,b)
    
    // Normalize x such that 0 <= x < |b|/g
    let normalizedX = x.mod(g_div);
    if (normalizedX.lesser(0)) {
        normalizedX = normalizedX.add(g_div);
    }
    
    // Recalculate y based on normalizedX to maintain the identity
    // y = (g - a*x) / b
    const newY = g.subtract(self.bigInt(a_str).multiply(normalizedX)).divide(self.bigInt(b_str));
    
    postMessage({ type: 'progress', progress: 100 });

    return { 
        g: g.toString(), 
        x: normalizedX.toString(), 
        y: newY.toString(), 
        steps,
        labelA,
        labelB
    };
}


self.onmessage = function(e) {
    const { a, b, labelA, labelB } = e.data;
    
    try {
        const result = extendedEuclideanAlgorithm(a, b, self.postMessage, labelA, labelB);
        self.postMessage({ type: 'result', ...result });

    } catch (error) {
        self.postMessage({ type: 'error', message: error.message });
    }
};
