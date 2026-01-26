import math

def lucas_lehmer_test(p: int) -> bool:
    """
    Performs the Lucas-Lehmer test to determine if M_p = 2^p - 1 is prime.
    This works for prime p.
    """
    if p == 2:
        return True  # M_2 = 3 is prime
        
    # 1. Define the Mersenne number (the modulus)
    M_p = 2**p - 1
    print(f"--- Testing M_{p} ({M_p:,}) ---")
    
    # 2. Initialize the sequence
    S = 4  
    
    # 3. Iterate p - 2 times (the core deterministic sequence)
    # The loop runs p - 2 times (i = 0 to p-3)
    for i in range(p - 2):
        
        # S_i = (S_{i-1}^2 - 2) mod M_p
        # The result must be calculated first, then the modulus applied.
        S = (S * S - 2) % M_p
        
        # Optional: Print progress for small numbers
        if p <= 60:
            print(f"Step {i + 1} / {p - 2}: S = {S}")

    # 4. Final Deterministic Check
    # If the final result is 0, M_p is prime.
    if S == 0:
        return True
    else:
        return False

# --- Test Cases ---
p_prime_example = 7  # M_7 = 127 (Prime)
p_composite_example = 11 # M_11 = 2047 (Composite: 23 x 89)

# Run the test
is_prime_7 = lucas_lehmer_test(p_prime_example)
print(f"\nResult for M_{p_prime_example} (127): {'PRIME' if is_prime_7 else 'COMPOSITE'}")

print("\n" + "="*30 + "\n")

is_prime_11 = lucas_lehmer_test(p_composite_example)
print(f"\nResult for M_{p_composite_example} (2047): {'PRIME' if is_prime_11 else 'COMPOSITE'}")

