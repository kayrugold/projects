// lib/math_utils.dart

import 'dart:math';

// Your powMod function, directly translated to Dart.
BigInt powMod(BigInt base, BigInt exp, BigInt mod) {
  BigInt result = BigInt.one;
  base %= mod;
  while (exp > BigInt.zero) {
    if ((exp & BigInt.one) == BigInt.one) result = (result * base) % mod;
    exp >>= 1;
    base = (base * base) % mod;
  }
  return result;
}

// A helper for Miller-Rabin
BigInt _randomBigInt(BigInt low, BigInt high) {
  final random = Random.secure();
  final range = high - low;
  final bitLength = range.bitLength;
  BigInt result;
  do {
    result = BigInt.from(0);
    for (int i = 0; i < bitLength; i++) {
      if (random.nextBool()) {
        result |= (BigInt.one << i);
      }
    }
  } while (result >= range);
  return low + result;
}


// Your millerRabinTest, directly translated.
bool millerRabinTest(BigInt n, {int k = 20}) {
  if (n <= BigInt.one) return false;
  if (n <= BigInt.from(3)) return true;
  if ((n & BigInt.one) == BigInt.zero) return false;

  // Reduce iterations for extremely large numbers, as in your JS.
  if (n > BigInt.parse("1000000000000000000")) k = 5;

  BigInt d = n - BigInt.one;
  BigInt r = BigInt.zero;
  while ((d & BigInt.one) == BigInt.zero) {
    d >>= 1;
    r = r + BigInt.one; // CORRECTED
  }

  // Pre-computed witnesses for smaller numbers
  final witnesses = (n < BigInt.parse("3825123056546413051"))
      ? [BigInt.from(2), BigInt.from(3), BigInt.from(5), BigInt.from(7), BigInt.from(11), BigInt.from(13), BigInt.from(23)]
      : null;
  if (witnesses != null && k > witnesses.length) k = witnesses.length;

  for (int i = 0; i < k; i++) {
    BigInt a = witnesses != null ? witnesses[i] : _randomBigInt(BigInt.from(2), n - BigInt.from(2));
    if (a >= n - BigInt.one) continue;

    BigInt x = powMod(a, d, n);
    if (x == BigInt.one || x == n - BigInt.one) continue;

    bool composite = true;
    // CORRECTED the increment part of the loop
    for (BigInt j = BigInt.one; j < r; j = j + BigInt.one) {
      x = powMod(x, BigInt.from(2), n);
      if (x == n - BigInt.one) {
        composite = false;
        break;
      }
      if (x == BigInt.one) break;
    }
    if (composite) return false;
  }
  return true;
}

// Add this to lib/math_utils.dart

int legendreSymbol(BigInt a, BigInt p) {
  final ls = powMod(a, (p - BigInt.one) >> 1, p);
  if (ls == p - BigInt.one) return -1;
  return ls.toInt();
}

// Add this function to lib/math_utils.dart

BigInt? nthRoot(BigInt n, int k) {
  if (k < 1) return null;
  if (k == 1) return n;

  BigInt low = BigInt.one;
  // Create an initial high estimate
  BigInt high = BigInt.one << (n.bitLength ~/ k + 1);

  while (low <= high) {
    final mid = (low + high) >> 1;
    if (mid == BigInt.zero) {
      low = BigInt.one;
      continue;
    }
    final power = mid.pow(k);

    if (power == n) {
      return mid;
    } else if (power < n) {
      low = mid + BigInt.one;
    } else {
      high = mid - BigInt.one;
    }
  }
  return null; // No integer root found
}

// Sieve utility function
List<BigInt> generateSmallPrimes(int limit) {
  final isPrime = List<bool>.filled(limit + 1, true);
  isPrime[0] = isPrime[1] = false;
  for (int i = 2; i * i <= limit; i++) {
    if (isPrime[i]) {
      for (int j = i * i; j <= limit; j += i) { isPrime[j] = false; }
    }
  }
  final primes = <BigInt>[];
  for (int i = 2; i <= limit; i++) {
    if (isPrime[i]) primes.add(BigInt.from(i));
  }
  return primes;
}

// NOTE: We will add the other functions (sieve, legendreSymbol, etc.) as we build the features.
// This is the core engine.
