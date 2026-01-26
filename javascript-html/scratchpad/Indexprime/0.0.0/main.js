// main.js

const NUM_WORKERS = 8;
const workers = [];
let targetNumber = 0;
let factorFound = false;

// --- Step 1: Initial Setup and UI Generation ---
function setupWorkers() {
    const container = document.getElementById('workerProgress');
    container.innerHTML = '';
    
    for (let i = 0; i < NUM_WORKERS; i++) {
        // Create progress bar element for each core
        const progressDiv = document.createElement('div');
        progressDiv.className = 'progress-container';
        progressDiv.innerHTML = `
            Core ${i}: Checking P-range <span id="range-${i}">...</span>
            <div class="progress-bar"><div class="progress-fill" id="fill-${i}" style="width: 0%;"></div></div>
        `;
        container.appendChild(progressDiv);

        // Initialize the Web Worker
        const worker = new Worker('factor_worker.js');
        worker.id = i;
        worker.onmessage = handleWorkerMessage;
        workers.push(worker);
    }
}

// --- Step 2: Calculate Search Ranges and Start Workers ---
function startFactoring() {
    targetNumber = BigInt(document.getElementById('numberInput').value);
    document.getElementById('result').textContent = 'Searching...';
    factorFound = false;

    // --- Critical Scaling Step ---
    // The search limit is the square root of N.
    // For large numbers, this must be calculated efficiently.
    const sqrtN = Math.floor(Math.sqrt(Number(targetNumber))); 
    const startP = 3; // Always start with the 3-Family
    const totalRange = sqrtN - startP;
    const chunkSize = Math.ceil(totalRange / NUM_WORKERS);

    // Initialize progress and distribute the work
    for (let i = 0; i < NUM_WORKERS; i++) {
        const worker = workers[i];
        
        let workerStartP = startP + (i * chunkSize);
        let workerEndP = Math.min(sqrtN, startP + ((i + 1) * chunkSize) - 1);
        
        // Ensure odd starting point (all primes except 2 are odd)
        if (workerStartP % 2 === 0) workerStartP++;

        // Update range display for user
        document.getElementById(`range-${i}`).textContent = `[${workerStartP} to ${workerEndP}]`;

        // Tell the worker to start
        worker.postMessage({
            N: Number(targetNumber), // Workers must use standard number type for Math.sqrt and division
            startP: workerStartP,
            endP: workerEndP,
            workerId: i
        });
    }
}

// --- Step 3: Handle Worker Communications (Progress & Results) ---
function handleWorkerMessage(e) {
    const { type, data, workerId, progress } = e.data;
    const resultElement = document.getElementById('result');
    const fillElement = document.getElementById(`fill-${workerId}`);

    if (type === 'progress' && fillElement) {
        // Update the progress bar for the specific core
        fillElement.style.width = `${progress}%`;
    } 
    else if (type === 'result' && !factorFound) {
        // Factor found! Stop all workers immediately (Efficiency)
        factorFound = true;
        workers.forEach(w => w.terminate());
        
        const N = BigInt(data.N);
        const P = BigInt(data.P);
        const Fk = BigInt(data.Fk);
        
        resultElement.innerHTML = `
            ✅ **FACTOR FOUND!**<br>
            N = ${N}<br>
            Factors: **${P} x ${Fk}**<br>
            (Found by Core ${workerId})
        `;
        // Ensure all bars are full or show the result
        document.querySelectorAll('.progress-fill').forEach(fill => fill.style.width = '100%');
    }
    else if (type === 'finished' && !factorFound) {
        // Worker finished its segment without finding a factor
        fillElement.style.width = '100%';
        console.log(`Core ${workerId} finished checking its range.`);

        // Check if all workers have finished
        const finishedWorkers = workers.filter((w, i) => document.getElementById(`fill-${i}`).style.width === '100%');
        if (finishedWorkers.length === NUM_WORKERS) {
            resultElement.textContent = `✅ **PRIME!** No factors found up to the square root of N.`;
        }
    }
}

// Initial setup when the script loads
setupWorkers();
