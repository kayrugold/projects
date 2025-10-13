// lib/factor_scanner_isolate.dart

import 'dart:isolate';
import 'dart:math';
import 'math_utils.dart';

// Use a smaller constant here, focused on the size of a single chunk
final MAX_SIEVE_CHUNK_SIZE = BigInt.from(10000000); // 10 million

// Helper to check if a prime candidate passes all filters
bool _passesFilters(BigInt p, BigInt b, BigInt c, BigInt kM, BigInt kN) {
  if (kM > BigInt.zero) {
    if ((p - kN) % kM != BigInt.zero) return false;
  }
  if (b.isEven) {
    if (p != BigInt.two && legendreSymbol(-c, p) == -1) return false;
  }
  return true;
}

// Helper to test a single prime number candidate
void _testPrime(BigInt p, BigInt a, BigInt b, BigInt c, SendPort sendPort) {
  final rem = (powMod(a, b, p) + c) % p;
  if (rem == BigInt.zero) {
    sendPort.send({'type': 'factor', 'value': p.toString()});
  }
}

void factorScannerEntry(SendPort sendPort) {
  final receivePort = ReceivePort();
  sendPort.send(receivePort.sendPort);

  receivePort.listen((dynamic message) {
    if (message is Map<String, String>) {
      final stopwatch = Stopwatch()..start();
      int itemsTested = 0;

      // --- Parse Input ---
      final a = BigInt.parse(message['a']!);
      final b = BigInt.parse(message['b']!);
      final c = BigInt.parse(message['c']!);
      final min = BigInt.parse(message['min']!);
      final max = BigInt.parse(message['max']!);
      final kM = BigInt.tryParse(message['k_m'] ?? '') ?? BigInt.zero;
      final kN = BigInt.tryParse(message['k_n'] ?? '') ?? BigInt.zero;
      
      final chunkRange = max - min;
      int lastProgress = -1;
      
      // THIS IS THE CRITICAL LOGIC CHANGE:
      // Decide to use the Sieve based on the chunk size, not the absolute max value.
      final bool useSieve = chunkRange < MAX_SIEVE_CHUNK_SIZE;
      
      if (useSieve) {
        // Method 1: Sieve of Eratosthenes for this chunk
        try {
          final int rangeSize = (max - min + BigInt.one).toInt();
          final isPrimeInRange = List<bool>.filled(rangeSize, true);
          final int sqrtMax = sqrt(max.toDouble()).ceil();
          final smallPrimes = generateSmallPrimes(sqrtMax);

          for (final p in smallPrimes) {
            if (p * p > max) break;
            BigInt start = (min ~/ p) * p;
            if (start < min) start += p;
            for (BigInt multiple = start; multiple <= max; multiple += p) {
              final index = (multiple - min).toInt();
              if (index >= 0 && index < rangeSize) isPrimeInRange[index] = false;
            }
          }
          
          for (int i = 0; i < rangeSize; i++) {
            itemsTested++;
            if (isPrimeInRange[i]) {
              final p = min + BigInt.from(i);
              if (p > max) break;
              if (p < BigInt.two) continue;

              if (_passesFilters(p, b, c, kM, kN)) {
                _testPrime(p, a, b, c, sendPort);
              }
            }
            final progress = (i * 100) ~/ rangeSize;
            if (progress > lastProgress) {
                sendPort.send({'type': 'progress', 'value': progress});
                lastProgress = progress;
            }
          }
        } catch (e) {
          // Fallback for safety if range is too big for toInt()
        }
      } else {
        // Method 2: Miller-Rabin for very large chunks
        BigInt current = min;
        if (current.isEven) current = current + BigInt.one;
        
        final wheel = [4, 2, 4, 2, 4, 6, 2, 6].map(BigInt.from).toList();
        int wheelIndex = 0;
        
        while (current <= max) {
            itemsTested++;
            if (millerRabinTest(current)) {
              if (_passesFilters(current, b, c, kM, kN)) {
                _testPrime(current, a, b, c, sendPort);
              }
            }
            if (chunkRange > BigInt.zero) {
                final progress = ((current - min) * BigInt.from(100) ~/ chunkRange).toInt();
                if (progress > lastProgress) {
                  sendPort.send({'type': 'progress', 'value': progress});
                  lastProgress = progress;
                }
            }
            current += wheel[wheelIndex];
            wheelIndex = (wheelIndex + 1) % 8;
        }
      }

      stopwatch.stop();
      sendPort.send({'type': 'done', 'items': itemsTested.toString(), 'duration_ms': stopwatch.elapsedMilliseconds.toString()});
    }
  });
}