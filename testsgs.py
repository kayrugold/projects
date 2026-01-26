import math
import time

def is_square(n):
    """
    Checks if a number is a perfect square and returns its integer square root.
    This is the core of Step 4 (Discriminant Check).
    """
    if n < 0:
        return None
    root = int(math.isqrt(n))
    if root * root == n:
        return root
    return None

def factor_by_sum_of_roots(N):
    """
    Implements the Sum of Roots Factorization Concept (Steps 3, 4, and 6).

    The method iterates over candidate sums 'S' (where S = Factor_X + Factor_Y)
    and checks if the discriminant (S^2 - 4N) is a perfect square.
    """
    # ----------------------------------------------------
    # Step 1: Start with N Target Number
    # ----------------------------------------------------
    if N <= 1:
        return (N, 1)

    # Check for even numbers (special case optimization)
    if N % 2 == 0:
        return (2, N // 2)

    # Calculate the integer square root of N (N must be odd here)
    root_N = math.isqrt(N)

    # ----------------------------------------------------
    # Step 3: Start with s-value (Sum of Roots)
    # The smallest possible S is 2*sqrt(N)
    # Since X+Y must be even (N is odd, X, Y are odd), S must be even.
    # We start S at the smallest even integer >= 2*root_N.
    # ----------------------------------------------------

    S_start = 2 * root_N
    if S_start % 2 != 0:
        S_start += 1 # Ensure S starts as an even number

    print(f"Target N: {N}")
    print(f"Starting S search at: {S_start} (2 * sqrt({N}) = {2 * root_N})")
    
    # ----------------------------------------------------
    # Steps 4, 7, & 8: Loop, Discriminant Check, and Calculation
    # ----------------------------------------------------
    S = S_start
    while True:
        # Calculate the Discriminant Squared: D^2 = S^2 - 4N
        D_squared = S * S - 4 * N
        
        # S^2 must be increasing, so if D_squared is negative, N is not an integer. 
        # Since N is an integer, this is primarily a mathematical safeguard 
        # and should only happen if N is a prime or has large factors.
        if D_squared < 0:
            # We should technically never hit this loop if N is composite, 
            # but for safety against overflow or very large primes:
            if S > N + 1:
                return (N, 1) # N is prime or search limit reached
            S += 2
            continue

        # Check if D_squared is a perfect square (Step 4 check)
        D = is_square(D_squared)
        
        if D is not None:
            # D is the integer root. Factors are X=(S-D)/2 and Y=(S+D)/2.
            # Since S and D must have the same parity (S^2 - D^2 = 4N, which is even),
            # (S-D) and (S+D) are both even, guaranteeing X and Y are integers.
            
            Factor_X = (S - D) // 2
            Factor_Y = (S + D) // 2
            
            # Step 6: Final check (ensured by the perfect square check, but verified here)
            if Factor_X * Factor_Y == N:
                return (Factor_X, Factor_Y)

        # Increment S by 2 (since N is odd, both factors must be odd, and thus S=X+Y must be even)
        S += 2

# --- Example Usage ---
if __name__ == "__main__":
    
    # Example 1: N with small factors (12345679 is prime, so 12345679*3 = 37037037)
    TARGET_N_1 = 37037037
    
    # Example 2: N with factors close to sqrt(N) (500003 * 500009)
    TARGET_N_2 = 250009000027
    
    # Example 3: N that is a square (12345 * 12345)
    TARGET_N_3 = 152399025
    
    print("-" * 50)
    print("Testing Factorization by Sum of Roots")
    print("-" * 50)
    
    # Test 1
    N = TARGET_N_1
    start_time = time.time()
    factor_x, factor_y = factor_by_sum_of_roots(N)
    end_time = time.time()
    print(f"\nResult for N={N}:")
    print(f"Factors found: ({factor_x}, {factor_y})")
    print(f"Time taken: {end_time - start_time:.6f} seconds")
    print("-" * 50)

    # Test 2
    N = TARGET_N_2
    start_time = time.time()
    factor_x, factor_y = factor_by_sum_of_roots(N)
    end_time = time.time()
    print(f"\nResult for N={N}:")
    print(f"Factors found: ({factor_x}, {factor_y})")
    print(f"Time taken: {end_time - start_time:.6f} seconds")
    print("-" * 50)
    
    # Test 3
    N = TARGET_N_3
    start_time = time.time()
    factor_x, factor_y = factor_by_sum_of_roots(N)
    end_time = time.time()
    print(f"\nResult for N={N}:")
    print(f"Factors found: ({factor_x}, {factor_y})")
    print(f"Time taken: {end_time - start_time:.6f} seconds")
    print("-" * 50)