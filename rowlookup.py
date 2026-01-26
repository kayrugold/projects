def lookup_rows(middle_number):
    results = []
    # Optimization: n^2 - k^2 = X implies n must be at least sqrt(X)
    # and (n-k) must be a factor of X.
    for n in range(int(middle_number**0.5), middle_number + 1):
        k_squared = n**2 - middle_number
        if k_squared >= 0:
            k = int(k_squared**0.5)
            if k**2 == k_squared:
                # Format: [Row#] n (n^2-k^2) n k
                results.append((n, middle_number, n, k))
    return results

# Example: Lookup for 21
target = 71641520761751435455133616475667090434063332228247871795429
rows = lookup_rows(target)
for r in rows:
    print(f"Match found: {r[0]}\t{r[1]}\t{r[2]}\t{r[3]}")
