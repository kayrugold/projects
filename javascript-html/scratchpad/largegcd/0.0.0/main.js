// --- UI Element References ---
const baseInput1 = document.getElementById('baseInput1');
const exponentInput1 = document.getElementById('exponentInput1');
const addendInput1 = document.getElementById('addendInput1');
const baseInput2 = document.getElementById('baseInput2');
const exponentInput2 = document.getElementById('exponentInput2');
const addendInput2 = document.getElementById('addendInput2');

const gcdButton = document.getElementById('gcdButton');
const stopButton = document.getElementById('stopButton');
const progressBar = document.getElementById('progressBar');
const progressBarContainer = document.getElementById('progressBarContainer');
const resultsDiv = document.getElementById('results');
const logOutput = document.getElementById('logOutput');

// --- Global State ---
let gcdWorker = null;
let isCalculating = false;

// --- Utility Functions ---
function log(msg) {
  logOutput.textContent += msg + '\n';
  logOutput.scrollTop = logOutput.scrollHeight;
}

function setStatus(t) { resultsDiv.textContent = 'Status: ' + t; }

function setProgress(p) {
  const percent = Math.min(100, p).toFixed(2);
  progressBar.style.width = percent + '%';
  progressBar.textContent = percent + '%';
}

// --- Event Handlers ---
function startGCD() {
    if (isCalculating) return;

    logOutput.textContent = 'Log:\n';
    log('--- Starting Optimized Chunked GCD (Main Thread) ---');
    setStatus('Initializing worker...');
    progressBarContainer.classList.remove('hidden');
    setProgress(0);

    const n1_a = baseInput1.value;
    const n1_b = exponentInput1.value;
    const n1_c = addendInput1.value;
    const n2_a = baseInput2.value;
    const n2_b = exponentInput2.value;
    const n2_c = addendInput2.value;

    if (!n1_b || !n2_b) {
        log("Error: Exponents must be provided.");
        setStatus('Error: Missing input.');
        stopCalculation();
        return;
    }

    isCalculating = true;
    gcdButton.disabled = true;
    stopButton.disabled = false;

    // CRITICAL FIX: Load the worker from its external file
    // This bypasses the inline string parsing issues entirely.
    gcdWorker = new Worker('gcd_worker.js');

    gcdWorker.onmessage = (e) => {
        if (e.data.type === 'progress') {
            setStatus(`Calculating GCD... ~${e.data.value.toFixed(2)}% done.`);
            setProgress(e.data.value);
        } else if (e.data.type === 'log') {
            log(e.data.message);
        } else if (e.data.type === 'result') {
            const { gcd, steps } = e.data;
            log(`\nBinary GCD complete in ${steps} steps.`);
            log(`Result has ${gcd.length} digits.`);
            setStatus('GCD Result:');
            resultsDiv.textContent = 'GCD(N, M) = ' + gcd;
            stopCalculation();
        } else if (e.data.type === 'error') {
            log(`\nWorker Error: ${e.data.message}`);
            setStatus('Error occurred. Check log for details.');
            stopCalculation();
        }
    };

    gcdWorker.onerror = (e) => {
        log(`\nWorker Initialization Error: ${e.message}. Critical failure.`);
        setStatus('Critical Error. Check console.');
        stopCalculation();
    };

    gcdWorker.postMessage({ n1_a, n1_b, n1_c, n2_a, n2_b, n2_c });
}

function stopCalculation() {
    if (gcdWorker) {
        gcdWorker.terminate();
        gcdWorker = null;
    }
    isCalculating = false;
    gcdButton.disabled = false;
    stopButton.disabled = true;
    progressBarContainer.classList.add('hidden');

    if (resultsDiv.textContent.includes('Calculating')) {
        setStatus('Stopped by user.');
    }
}

// Initial default settings and event listeners
window.addEventListener('load', () => {
    gcdButton.addEventListener('click', startGCD);
    stopButton.addEventListener('click', stopCalculation);
});