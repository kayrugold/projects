That's a great question! This program, the **NTT-Accelerated GCD Calculator**, is designed to find the **Greatest Common Divisor (GCD)** of extremely large integers that exceed the standard limits of JavaScript numbers (and even sometimes the `BigInt` structure for intensive calculations).

It achieves this speed and capability by using an advanced mathematical technique called the **Number Theoretic Transform (NTT)**.

Here is a breakdown of what the program does and how it works:

### 1. User Interface (The HTML Part)

The main HTML file (`ntt_calculator.html`) provides the front-end features:

* **Flexible Input:** You can enter two numbers, A and B, using simple mathematical expressions (like `10**104 + 123456789`) or just paste in a very long string of digits. The front-end uses JavaScript's native `BigInt` to parse these expressions into a single, massive string of digits.
* **Worker Initialization:** When you click "Start," the main script converts the complex input expressions into raw number strings and launches a **Web Worker**. Using a worker is crucial because the GCD calculation is intense and would otherwise freeze the browser tab.
* **Status and Logging:** It displays the progress percentage and provides a log of the calculation steps, including how many digits the numbers currently have in the Euclidean Algorithm.

### 2. The Core Algorithm (The Worker Script)

The worker script (embedded within the HTML) performs the heavy lifting:

* **Chunking:** Since JavaScript numbers are limited, the script first converts the massive input strings into an array of smaller chunks (each chunk represents $10^4$). This allows it to handle numbers with thousands of digits.
* **Euclidean Algorithm:** The program uses the standard **Euclidean Algorithm** (the traditional method for finding GCD, based on repeated division). 
    * **The Challenge:** The Euclidean Algorithm requires performing many long-division and remainder (modulus) operations. For numbers with *N* digits, standard multiplication takes $O(N^2)$ time, making division even slower.
* **NTT Acceleration:** This is where the **Number Theoretic Transform** comes in.
    * NTT is essentially an optimization of the **Fast Fourier Transform (FFT)**, adapted for integer arithmetic using modular arithmetic (hence the name *Theoretic*).
    * **Purpose:** NTT allows the worker to perform the long **multiplication** step (which is the bottleneck of long division) in $O(N \log N)$ time, which is vastly faster than the standard $O(N^2)$ approach for very large numbers.
    * By accelerating the multiplication part of the long division process (`divMod` function), the entire Euclidean Algorithm runs much faster, enabling it to compute the GCD for numbers up to hundreds of thousands of digits long.

**In summary, the program uses the classical Euclidean Algorithm but replaces the slow, manual long division with a highly optimized version that leverages the Number Theoretic Transform to handle calculations involving truly colossal integers.**