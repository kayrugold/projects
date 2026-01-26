// factor_worker.js

// The core predictive function from your algorithm
function findFactor(N, startP, endP) {
    let P = startP;

    while (P <= endP) {
        // --- Step 3: Predictive Factor Test ---
        // Formula: k = ((N/P) - 1) / 2
        
        // Check for divisibility (N % P === 0) first for fast exit
        if (N % P === 0) {
            let k = (N / P - 1) / 2;
            
            // Check if the resulting factor Fk is an odd integer (k must be a whole number or 0)
            if (Number.isInteger(k)) {
                // Factor found! P is the smallest prime, Fk is the second factor.
                return { 
                    P: P, 
                    Fk: (2 * k) + 1,
                    N: N
                };
            }
        }

        // --- Step 4: Factor Increment Jump ---
        // Move to the next potential prime P.
        // We use P += 2 because all primes (except 2) are odd.
        if (P === 3) {
            P = 5; // Special jump from 3 to 5
        } else if (P % 2 !== 0) {
            P += 2; // Jump to the next odd number (potential prime)
        } else {
             // If P somehow became even, this is a safeguard
             P += 1;
        }

        // Report progress back to the main thread (for the progress bar)
        let progress = Math.min(100, ((P - startP) / (endP - startP)) * 100);
        postMessage({ type: 'progress', progress: progress });
    }

    // If the loop finishes without finding a factor in this range
    return null;
}

// Worker receives a message to start processing
self.onmessage = function(e) {
    const { N, startP, endP, workerId } = e.data;
    
    // N = Number to Factor, startP/endP define the search range for this Worker
    const factorResult = findFactor(N, startP, endP);
    
    if (factorResult) {
        // Found a factor! Send the result back.
        postMessage({ type: 'result', data: factorResult, workerId: workerId });
    } else {
        // Range checked, no factor found.
        postMessage({ type: 'finished', workerId: workerId });
    }
};
