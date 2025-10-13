// lib/main.dart

import 'dart:isolate';
import 'dart:io';
import 'dart:math' as math;
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'factor_scanner_isolate.dart';
import 'math_utils.dart';
import 'info_page.dart'; // <--- ADDED IMPORT

const int trialDivisionLimit = 2000;
const String APP_VERSION = "1.0.0+1"; // <--- ADDED VERSION CONSTANT

void main() {
  runApp(const FactorHunterApp());
}

class FactorHunterApp extends StatelessWidget {
  const FactorHunterApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Factor Hunter',
      theme: ThemeData(
        brightness: Brightness.dark,
        primarySwatch: Colors.indigo,
        scaffoldBackgroundColor: const Color(0xFF121212),
        cardColor: const Color(0xFF1E1E1E),
        inputDecorationTheme: const InputDecorationTheme(
          border: OutlineInputBorder(),
          filled: true,
          fillColor: Color(0xFF2A2A2A),
        ),
        elevatedButtonTheme: ElevatedButtonThemeData(
          style: ElevatedButton.styleFrom(
            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
          ),
        ),
      ),
      home: const HomePage(),
    );
  }
}

class HomePage extends StatefulWidget {
  const HomePage({super.key});

  @override
  State<HomePage> createState() => _HomePageState();
}

class _HomePageState extends State<HomePage> {
  // --- UI Controllers ---
  final _baseController = TextEditingController(text: "10");
  final _exponentController = TextEditingController(text: "1000000000");
  final _addendController = TextEditingController(text: "19");
  final _divisorController = TextEditingController(text: "5104699");
  final _minLimitController = TextEditingController(text: "1");
  final _maxLimitController = TextEditingController(text: "10000000");
  final _chunkSizeController = TextEditingController(text: "200000");
  final _targetChunkSecondsController = TextEditingController(text: '1.5');
  final _minChunkSizeController = TextEditingController(text: '1000');
  final _maxChunkSizeController = TextEditingController(text: '50000000');
  final _logScrollController = ScrollController();
  final _kMultipleController = TextEditingController();
  final _kAddendController = TextEditingController();

  // --- Presets for famous numbers / examples ---
  final List<Map<String, String>> _presets = [
    {
      'id': 'project_benchmark',
      'title': 'Project Benchmark (10^1e9+19)',
      'base': '10',
      'exponent': '1000000000',
      'addend': '19',
      'min': '1',
      'max': '50000000',
      'description': 'The number used to develop this app. Has factors 5,104,699 and 28,863,011 in this range.',
      'divisor': '5104699'
    },
    {
      'id': 'cunningham_2_67',
      'title': 'Cunningham (2^67-1)',
      'base': '2',
      'exponent': '67',
      'addend': '-1',
      'min': '1',
      'max': '200000000',
      'description': "Cole's famous factorization: 193,707,721 * 761,838,257,287",
      'divisor': '193707721'
    },
    {
      'id': 'repunit_10',
      'title': 'Repunit R10 (111...1)',
      'base': '1111111111',
      'exponent': '1',
      'addend': '0',
      'min': '1',
      'max': '10000',
      'description': '1,111,111,111 = 11 * 41 * 271 * 9091',
      'divisor': '9091'
    },
    {
      'id': 'carmichael_561',
      'title': 'Carmichael (561)',
      'base': '561',
      'exponent': '1',
      'addend': '0',
      'min': '1',
      'max': '20',
      'description': 'The smallest Carmichael number. 561 = 3 * 11 * 17',
      'divisor': '17'
    },
    {
      'id': 'mersenne_31',
      'title': 'Mersenne (2^31-1)',
      'base': '2',
      'exponent': '31',
      'addend': '-1',
      'min': '2147480000',
      'max': '2147485000',
      'description': '2^31-1 = 2147483647 (Mersenne prime)',
      'divisor': '2147483647'
    },
    {
      'id': 'fermat_f5',
      'title': 'Fermat F5 (2^32+1)',
      'base': '2',
      'exponent': '32',
      'addend': '1',
      'min': '4294966000',
      'max': '4294969000',
      'description': '4294967297 is composite (factors 641 and 6700417)',
      'divisor': '641'
    },
    {
      'id': 'euler_600851',
      'title': 'Euler Example (600851475143)',
      'base': '600851475143',
      'exponent': '1',
      'addend': '0',
      'min': '1',
      'max': '8000',
      'description': 'Composite with factors 71, 839, 1471, 6857',
      'divisor': '6857'
    },
  ];

  String? _selectedPresetId;

  // --- State Variables ---
  String _status = "Idle";
  double _progress = 0.0;
  final List<String> _log = ["Log:"];
  final Set<String> _factors = {};
  bool _isScanning = false;
  bool _autoRepeatEnabled = false;

  // --- Isolate Communication & Worker State ---
  final Map<ReceivePort, Map<String, dynamic>> _workerState = {};
  BigInt _totalWork = BigInt.zero;
  BigInt _completedWork = BigInt.zero;
  double _throughputEMA = 0.0;
  final double _emaAlpha = 0.2;
  double _targetChunkSeconds = 1.5;
  int _minChunkSize = 1000;
  int _maxChunkSize = 50000000;
  BigInt? _remainingStart;
  BigInt? _rangeEnd;

  @override
  void dispose() {
    _stopScan();
    _baseController.dispose();
    _exponentController.dispose();
    _addendController.dispose();
    _divisorController.dispose();
    _minLimitController.dispose();
    _maxLimitController.dispose();
    _chunkSizeController.dispose();
    _targetChunkSecondsController.dispose();
    _minChunkSizeController.dispose();
    _maxChunkSizeController.dispose();
    _logScrollController.dispose();
    _kMultipleController.dispose();
    _kAddendController.dispose();
    super.dispose();
  }

  void _addLog(String message) {
    if (mounted) {
      setState(() {
        _log.add(message);
      });
      WidgetsBinding.instance.addPostFrameCallback((_) {
        if (_logScrollController.hasClients) {
          _logScrollController.jumpTo(_logScrollController.position.maxScrollExtent);
        }
      });
    }
  }

  void _applyPreset(Map<String, String> p) {
    _baseController.text = p['base'] ?? '';
    _exponentController.text = p['exponent'] ?? '';
    _addendController.text = p['addend'] ?? '';
    _minLimitController.text = p['min'] ?? '1';
    _maxLimitController.text = p['max'] ?? '10000';
    if (p.containsKey('divisor')) {
      _divisorController.text = p['divisor']!;
      _addLog('Applied preset: ${p['title']}: ${p['description'] ?? ''} (divisor prefilled)');
    } else {
      _addLog('Applied preset: ${p['title']}: ${p['description'] ?? ''}');
    }
    if (mounted) setState(() {});
  }

  void _addFactor(BigInt factor) {
    if (mounted) {
      setState(() {
        if (_factors.add(factor.toString())) {
          _addLog("Factor found: $factor");
        }
      });
    }
  }

  Future<void> _copyLogToClipboard() async {
    final text = _log.join('\n');
    await Clipboard.setData(ClipboardData(text: text));
    _addLog('Main log copied to clipboard');
    if (mounted) {
      ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Main log copied')));
    }
  }

  Future<void> _copyFactorsToClipboard() async {
    final text = _factors.join('\n');
    if (text.isEmpty) {
      if (mounted) ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('No factors to copy')));
      return;
    }
    await Clipboard.setData(ClipboardData(text: text));
    _addLog('Found factors copied to clipboard');
    if (mounted) {
      ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Found factors copied')));
    }
  }

  BigInt _parseBigInt(String text) {
    text = text.replaceAll(RegExp(r'\s+'), '');
    if (text.isEmpty) return BigInt.zero;
    
    // 1. Try to parse as scientific notation first
    final BigInt? sci = _tryParseScientific(text);
    if (sci != null) return sci;
    
    // 2. Fallback to standard BigInt parsing
    try {
        return BigInt.parse(text);
    } catch (e) {
        // Handle case where BigInt.parse fails (e.g., non-numeric characters)
        _addLog('Error parsing BigInt: $text is not a valid large integer or scientific notation.');
        // If parsing fails, return zero or throw, depending on desired behavior.
        // Returning BigInt.zero prevents a crash but logs the error.
        return BigInt.zero; 
    }
  }

  BigInt? _tryParseScientific(String text) {
    final lower = text.toLowerCase();
    
    // Quick exit if no scientific notation marker is found
    if (!lower.contains('e')) return null;

    final parts = lower.split('e');
    if (parts.length < 2) return null;
    
    // Manually parse parts for robustness
    final mantissaStr = parts[0];
    final exponentStr = parts.sublist(1).join('e'); // In case of weird input like '1e1e9'
    
    // 1. Parse Mantissa (Base number)
    final mantissaDouble = double.tryParse(mantissaStr);
    if (mantissaDouble == null) return null; // Not a valid number before 'e'

    // 2. Parse Exponent
    final exponent = int.tryParse(exponentStr);
    if (exponent == null) return null; // Not a valid exponent after 'e'

    // Convert the result of the double to a string without scientific notation, 
    // then parse as BigInt. This is the simplest way to handle standard scientific format 
    // like 1e9 or 5.2e12 when the result fits in a standard BigInt (which it should, 
    // as it's typically used for the exponent b, or the addend c, not the base a).
    try {
        // Use double arithmetic for the initial calculation, then convert to BigInt
        // for safety when dealing with very large numbers.
        final double resultDouble = mantissaDouble * math.pow(10, exponent).toDouble();
        
        // Return BigInt from the result string to maintain precision for large numbers
        return BigInt.parse(resultDouble.round().toString());

    } catch (e) {
        return null; 
    }
  }

  void _verifyDivisor() {
    setState(() {
      _status = "Verifying divisor...";
      _progress = 0.0;
    });
    _addLog("--- Single divisor verification ---");
    try {
      final a = _parseBigInt(_baseController.text);
      final b = _parseBigInt(_exponentController.text);
      final c = _parseBigInt(_addendController.text);
      final d = _parseBigInt(_divisorController.text);
      if (d <= BigInt.zero) throw const FormatException("Divisor must be positive.");
      
      // Error check: If any input failed to parse, the result will be zero, 
      // which would produce a bad division.
      if (a == BigInt.zero || b == BigInt.zero || d == BigInt.zero) {
          _addLog("Warning: Input parsing failed (value is zero). Cannot verify divisor.");
          setState(() { _status = "Error: Invalid Input"; });
          return;
      }
      
      final remPow = a.modPow(b, d);
      final finalRem = (remPow + c) % d;
      _addLog("a^b mod d = $remPow");
      _addLog("(a^b + c) mod d = $finalRem");
      if (finalRem == BigInt.zero) {
        _addLog("Result: 0 → $d divides a^b + c");
        _addFactor(d);
        setState(() {
          _status = "Divides exactly ✔";
        });
      } else {
        _addLog("Result: $finalRem → not divisible by $d");
        setState(() {
          _status = "Not a factor ✖";
        });
      }
    } catch (e) {
      _addLog("Error: ${e.toString()}");
      setState(() { _status = "Error"; });
    } finally {
      setState(() { _progress = 1.0; });
    }
  }

  Future<void> _checkAlgebraicFactors() async {
    _addLog('--- Skipping algebraic factor check for now ---');
  }

  Future<void> _trialDivision() async {
    _addLog('--- Starting pre-computation: trial division ---');
    setState(() => _status = 'Checking small primes up to $trialDivisionLimit...');
    await Future.delayed(const Duration(milliseconds: 10));

    final a = _parseBigInt(_baseController.text);
    final b = _parseBigInt(_exponentController.text);
    final c = _parseBigInt(_addendController.text);
    final smallPrimes = generateSmallPrimes(trialDivisionLimit);

    final kMultiple = _parseBigInt(_kMultipleController.text);
    final kAddend = _parseBigInt(_kAddendController.text);

    for (final p in smallPrimes) {
      if (kMultiple > BigInt.zero) {
        if ((p - kAddend) % kMultiple != BigInt.zero) {
          continue;
        }
      }
      final rem = (a.modPow(b, p) + c) % p;
      if (rem == BigInt.zero) {
        _addFactor(p);
      }
    }
    _addLog('--- Trial division finished ---');
  }

  Future<void> _startScan({bool isAutoRepeat = false}) async {
    if (_isScanning) return;

    setState(() {
      _isScanning = true;
      _status = "Initializing...";
      _progress = 0.0;
      if (!isAutoRepeat) {
        _log.clear();
        _log.add("Log:");
        _factors.clear();
      }
    });
    
    // We only need to check for fatal scan errors here. The actual BigInt values 
    // are sourced from the controllers when spawning the workers.
    final a = _parseBigInt(_baseController.text);
    final b = _parseBigInt(_exponentController.text);
    final min = _parseBigInt(_minLimitController.text);
    final max = _parseBigInt(_maxLimitController.text);
    
    if (a == BigInt.zero || b == BigInt.zero || min >= max) {
        _addLog("Scan Error: Base, Exponent, Min/Max range must be valid and positive.");
        _stopScan();
        setState(() { _status = "Error: Invalid Scan Parameters"; });
        return;
    }


    _addLog("Number to factor: ${_baseController.text}^${_exponentController.text} + ${_addendController.text}");

    if (!isAutoRepeat) {
      await _checkAlgebraicFactors();
      await _trialDivision();
    }
    
    _addLog("Main scan will begin from ${_minLimitController.text}.");

    
    final int initialChunk = int.tryParse(_chunkSizeController.text) ?? 200000;
    _targetChunkSeconds = double.tryParse(_targetChunkSecondsController.text) ?? _targetChunkSeconds;
    _minChunkSize = int.tryParse(_minChunkSizeController.text) ?? _minChunkSize;
    _maxChunkSize = int.tryParse(_maxChunkSizeController.text) ?? _maxChunkSize;
 
    _totalWork = (max - min) + BigInt.one;
    if (_totalWork < BigInt.zero) _totalWork = BigInt.zero;
    
    _completedWork = BigInt.zero;
    _throughputEMA = 0.0;
    _remainingStart = min;
    _rangeEnd = max;

    final int concurrency = math.max(1, Platform.numberOfProcessors - 1);
    
    for (int i = 0; i < concurrency; i++) {
      _spawnChunkWorker(initialChunk: initialChunk);
    }
  }

  void _startNextRange() {
    _addLog("--- Auto Repeat: Preparing next range... ---");
    final currentMin = _parseBigInt(_minLimitController.text);
    final currentMax = _parseBigInt(_maxLimitController.text);
    final rangeSize = currentMax - currentMin;

    final newMin = currentMax + BigInt.one;
    final newMax = newMin + rangeSize;

    setState(() {
      _minLimitController.text = newMin.toString();
      _maxLimitController.text = newMax.toString();
    });

    Future.delayed(const Duration(milliseconds: 100), () {
      if (mounted && _autoRepeatEnabled) {
         _startScan(isAutoRepeat: true);
      }
    });
  }
  
  void _suggestFilter() {
    final b = _parseBigInt(_exponentController.text);
    final c = _parseBigInt(_addendController.text);
    
    if (c == BigInt.one) {
        _addLog('Detected form a^b + 1. Suggesting filter p = 2*b*k + 1.');
        setState(() {
            _kMultipleController.text = (BigInt.two * b).toString();
            _kAddendController.text = '1';
        });
        return;
    }

    if (c == -BigInt.one) {
        _addLog('Detected form a^b - 1. Suggesting filter p = b*k + 1.');
        setState(() {
            _kMultipleController.text = b.toString();
            _kAddendController.text = '1';
        });
        return;
    }

    _addLog('No simple algebraic pattern detected for filter suggestion.');
  }

  void _spawnChunkWorker({int? initialChunk}) async {
    if (_remainingStart == null || _rangeEnd == null) return;
    if (_remainingStart! > _rangeEnd!) return;

    int chosenSize;
    if (_throughputEMA > 0.0) {
      chosenSize = (_throughputEMA * _targetChunkSeconds).round();
    } else if (initialChunk != null) {
      chosenSize = initialChunk;
    } else {
      chosenSize = int.tryParse(_chunkSizeController.text) ?? 200000;
    }
    chosenSize = chosenSize.clamp(_minChunkSize, _maxChunkSize);

    final BigInt start = _remainingStart!;
    final BigInt endCandidate = start + BigInt.from(chosenSize) - BigInt.one;
    final BigInt end = endCandidate < _rangeEnd! ? endCandidate : _rangeEnd!;
    final BigInt chunkSizeBig = (end - start) + BigInt.one;

    final Map<String, String> chunk = {
      'a': _baseController.text, 'b': _exponentController.text, 'c': _addendController.text,
      'min': start.toString(), 'max': end.toString(),
      'k_m': _kMultipleController.text, 'k_n': _kAddendController.text,
      'size': chunkSizeBig.toString(),
    };

    _remainingStart = end + BigInt.one;
    _addLog('Assigned chunk $start..$end (size $chunkSizeBig)');

    final ReceivePort rp = ReceivePort();
    final isolate = await Isolate.spawn(factorScannerEntry, rp.sendPort);

    _workerState[rp] = {
      'chunk': chunk, 'progress': 0, 'isolate': isolate, 'chunkSize': chunkSizeBig,
    };

    rp.listen((dynamic msg) { _onWorkerMessage(rp, msg); });
  }

  void _onWorkerMessage(ReceivePort rp, dynamic message) {
    final state = _workerState[rp];
    if (state == null) return;

    if (message is SendPort) {
      final SendPort sp = message;
      sp.send(state['chunk'] as Map<String, String>);
      return;
    }

    if (message is Map) {
      final type = message['type'];
      if (type == 'progress') {
        final v = message['value'] as int;
        state['progress'] = v;
        _aggregateProgress();
      } else if (type == 'factor') {
        _addFactor(BigInt.parse(message['value']));
      } else if (type == 'done') {
        final Isolate? isolate = state['isolate'] as Isolate?;
        final BigInt chunkSizeDone = state['chunkSize'] as BigInt? ?? BigInt.one;
        final int itemsReported = int.tryParse(message['items']?.toString() ?? '') ?? 0;
        final int durationMs = int.tryParse(message['duration_ms']?.toString() ?? '') ?? 0;
        if (itemsReported > 0 && durationMs > 0) {
          final double observed = itemsReported / (durationMs / 1000.0);
          if (_throughputEMA <= 0) {
            _throughputEMA = observed;
          } else {
            _throughputEMA = _emaAlpha * observed + (1 - _emaAlpha) * _throughputEMA;
          }
          _addLog('Chunk done: items=$itemsReported duration_ms=$durationMs observed=${observed.toStringAsFixed(2)} ips EMA=${_throughputEMA.toStringAsFixed(2)} ips');
        }

        try { if (isolate != null) isolate.kill(priority: Isolate.immediate); } catch (_) {}
        rp.close();
        _completedWork += chunkSizeDone;
        _workerState.remove(rp);

        if (_remainingStart != null && _remainingStart! > _rangeEnd! && _workerState.isEmpty) {
          _addLog('--- All chunks complete ---');
          
          if (_autoRepeatEnabled && mounted) {
            setState(() { _isScanning = false; });
            _startNextRange();
          } else {
            setState(() { 
              _status = 'Scan Complete';
              _progress = 1.0; 
              _isScanning = false;
            });
          }
        } else if (_remainingStart != null && _remainingStart! <= _rangeEnd!) {
          _spawnChunkWorker();
        }
      }
    }
  }

  void _aggregateProgress() {
    if (_totalWork <= BigInt.zero) {
      if (mounted) setState(() { _progress = 1.0; });
      return;
    }
    BigInt running = _completedWork;
    for (final s in _workerState.values) {
      final p = s['progress'] as int? ?? 0;
      final chunkSize = s['chunkSize'] as BigInt? ?? BigInt.one;
      running += (chunkSize * BigInt.from(p)) ~/ BigInt.from(100);
    }
    
    double newProgress = (running.toDouble() / _totalWork.toDouble()).clamp(0.0, 1.0);

    if (mounted) {
      setState(() {
        _progress = newProgress;
      });
    }
  }

  void _stopScan() {
    for (final entry in _workerState.entries) {
      final isolate = entry.value['isolate'] as Isolate?;
      try { if (isolate != null) isolate.kill(priority: Isolate.immediate); } catch (_) {}
      try { entry.key.close(); } catch (_) {}
    }
    _workerState.clear();
    if (mounted) {
      setState(() { _isScanning = false; });
    }
  }

  @override
  Widget build(BuildContext context) {
    final textTheme = Theme.of(context).textTheme;

    return Scaffold(
      appBar: AppBar(
        title: const Text("Factor Hunter"),
        actions: [ 
          IconButton( // <--- ADDED INFO BUTTON
            icon: const Icon(Icons.info_outline),
            tooltip: 'App Information',
            onPressed: () {
              // Navigate to the new info page
              Navigator.of(context).push(
                MaterialPageRoute(builder: (context) => const InfoPage()),
              );
            },
          ),
        ],
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            Text("Number to Factor", style: textTheme.titleLarge),
            const SizedBox(height: 16),
            Row(
              children: [
                const Text('Presets: '),
                const SizedBox(width: 8),
                // The Expanded widget will take up the remaining horizontal space
                Expanded(
                  child: DropdownButton<String>(
                    // This property tells the dropdown to fill the Expanded space
                    isExpanded: true, 
                    value: _selectedPresetId,
                    hint: const Text('Select example...'),
                    items: _presets.map((p) => DropdownMenuItem<String>(
                        value: p['id'],
                        // The Text widget will now automatically handle long text with an ellipsis (...)
                        child: Text(p['title']!, overflow: TextOverflow.ellipsis),
                      )).toList(),
                    onChanged: (val) {
                      if (val == null) return;
                      final preset = _presets.firstWhere((p) => p['id'] == val);
                      setState(() { _selectedPresetId = val; });
                      _applyPreset(preset);
                    },
                  ),
                ),
              ],
            ),
            const SizedBox(height: 8),
            TextField(controller: _baseController, decoration: const InputDecoration(labelText: "Base (a)")),
            const SizedBox(height: 12),
            TextField(controller: _exponentController, decoration: const InputDecoration(labelText: "Exponent (b)")),
            const SizedBox(height: 12),
            TextField(controller: _addendController, decoration: const InputDecoration(labelText: "Addend (c)")),
            const Divider(height: 40),
            Text("Single Divisor Verification", style: textTheme.titleLarge),
            const SizedBox(height: 16),
            TextField(controller: _divisorController, decoration: const InputDecoration(labelText: "Divisor to verify")),
            const SizedBox(height: 12),
            ElevatedButton(onPressed: _isScanning ? null : _verifyDivisor, child: const Text("Verify Divisor")),
            const Divider(height: 40),
            Text("Search Parameters", style: textTheme.titleLarge),
            const SizedBox(height: 16),
            TextField(controller: _minLimitController, decoration: const InputDecoration(labelText: "Min Limit")),
            const SizedBox(height: 12),
            TextField(controller: _maxLimitController, decoration: const InputDecoration(labelText: "Max Limit")),
            const SizedBox(height: 12),
            TextField(controller: _chunkSizeController, decoration: const InputDecoration(labelText: "Chunk Size")),
            
            const SizedBox(height: 12),
            Row(
              children: [
                Expanded(child: TextField(controller: _targetChunkSecondsController, decoration: const InputDecoration(labelText: 'Target chunk seconds'))),
                const SizedBox(width: 8),
                Expanded(child: TextField(controller: _minChunkSizeController, decoration: const InputDecoration(labelText: 'Min chunk size'))),
                const SizedBox(width: 8),
                Expanded(child: TextField(controller: _maxChunkSizeController, decoration: const InputDecoration(labelText: 'Max chunk size'))),
              ],
            ),

            const SizedBox(height: 12),
            ExpansionTile(
              title: const Text("Advanced Prime Filtering"),
              children: [
                Padding(
                  padding: const EdgeInsets.all(8.0),
                  child: Column(
                    children: [
                      const Text("Optionally, search only for prime factors of the form p = k*m + n."),
                      const SizedBox(height: 16),
                      TextField(controller: _kMultipleController, decoration: const InputDecoration(labelText: "Multiple (m)")),
                      const SizedBox(height: 12),
                      TextField(controller: _kAddendController, decoration: const InputDecoration(labelText: "Addend (n)")),
                      const SizedBox(height: 12),
                      ElevatedButton(onPressed: _isScanning ? null : _suggestFilter, child: const Text("Suggest Filter")),
                    ],
                  ),
                ),
              ],
            ),

            const Divider(height: 40),
            Text("Controls", style: textTheme.titleLarge),
            const SizedBox(height: 16),
            Row(
              children: [
                Expanded(child: ElevatedButton(onPressed: _isScanning ? null : () => _startScan(isAutoRepeat: false), child: const Text("Scan Primes"))),
                const SizedBox(width: 12),
                Expanded(child: ElevatedButton(onPressed: _isScanning ? _stopScan : null, style: ElevatedButton.styleFrom(backgroundColor: Colors.red.shade700), child: const Text("Stop"))),
              ],
            ),
            const SizedBox(height: 8),
            Row(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                Switch(
                  value: _autoRepeatEnabled,
                  onChanged: (value) {
                    if (!_isScanning) {
                      setState(() {
                        _autoRepeatEnabled = value;
                      });
                    }
                  },
                ),
                const Text("Auto Repeat"),
              ],
            ),
            const SizedBox(height: 16),
            Text(_status, style: textTheme.titleMedium, textAlign: TextAlign.center),
            const SizedBox(height: 8),
            Stack(
              alignment: Alignment.center,
              children: [
                LinearProgressIndicator(
                  value: _progress,
                  minHeight: 25,
                ),
                Text(
                  '${(_progress * 100).toStringAsFixed(2)}%',
                  style: const TextStyle(
                    color: Colors.white,
                    fontWeight: FontWeight.bold,
                  ),
                ),
              ],
            ),
            const SizedBox(height: 24),

            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Text("Main Log", style: textTheme.titleMedium),
                IconButton(
                  icon: const Icon(Icons.copy, size: 18),
                  tooltip: 'Copy Log',
                  onPressed: _copyLogToClipboard,
                )
              ],
            ),
            _buildLogBox(_log.join('\n'), _logScrollController),
            const SizedBox(height: 24),

            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Text("Found Factors", style: textTheme.titleMedium),
                IconButton(
                  icon: const Icon(Icons.copy, size: 18),
                  tooltip: 'Copy Factors',
                  onPressed: _copyFactorsToClipboard,
                )
              ],
            ),
            _buildLogBox(_factors.join('\n'), null),
          ],
        ),
      ),
    );
  }

  Widget _buildLogBox(String text, ScrollController? controller) {
    return Container(
      height: 150,
      padding: const EdgeInsets.all(8),
      decoration: BoxDecoration(
        color: const Color.fromRGBO(0, 0, 0, 0.2),
        border: Border.all(color: Colors.grey.shade700),
        borderRadius: BorderRadius.circular(4),
      ),
      child: SingleChildScrollView(
        controller: controller,
        child: Text(text, style: const TextStyle(fontFamily: 'monospace')),
      ),
    );
  }
}
