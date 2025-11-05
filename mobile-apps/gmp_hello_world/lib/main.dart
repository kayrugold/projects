import 'dart:ffi';
import 'package:ffi/ffi.dart';
import 'package:flutter/material.dart';

// 1. Load our native C library
final DynamicLibrary gmpBridge = DynamicLibrary.open('libgmp_bridge.so');

// 2. Look up the C function 'get_gmp_version'.
// The Dart function type must match the C type (it returns a Pointer).
final Pointer<Utf8> Function() _nativeGetGmpVersion = gmpBridge
    .lookup<NativeFunction<Pointer<Utf8> Function()>>('get_gmp_version')
    .asFunction();

// 3. Look up the C function 'calculate_big_number'.
final Pointer<Utf8> Function() _nativeCalculateBigNumber = gmpBridge
    .lookup<NativeFunction<Pointer<Utf8> Function()>>('calculate_big_number')
    .asFunction();

// 4. Create safe Dart wrappers for each native function.

// Wrapper for the version function
String getGmpVersion() {
  // Call the native function and convert the C string pointer to a Dart String.
  return _nativeGetGmpVersion().toDartString();
}

// Wrapper for the calculation function
String getBigNumber() {
  final pointer = _nativeCalculateBigNumber();
  final bigNumberString = pointer.toDartString();
  
  // IMPORTANT: Free the memory allocated by the C code to prevent memory leaks.
  calloc.free(pointer);
  
  return bigNumberString;
}

void main() {
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Flutter GMP Demo',
      theme: ThemeData.dark().copyWith(
        scaffoldBackgroundColor: const Color(0xFF1E1E1E),
        textTheme: const TextTheme(
          bodyMedium: TextStyle(color: Colors.white, fontSize: 16),
          headlineMedium: TextStyle(color: Colors.lightBlueAccent, fontWeight: FontWeight.bold),
        ),
      ),
      home: const MyHomePage(),
    );
  }
}

class MyHomePage extends StatelessWidget {
  const MyHomePage({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Flutter ❤️ GMP'),
      ),
      body: Center(
        child: Padding(
          padding: const EdgeInsets.all(16.0),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: <Widget>[
              Text(
                'Connected to GMP Version:',
                style: Theme.of(context).textTheme.headlineMedium,
              ),
              const SizedBox(height: 8),
              Text(
                getGmpVersion(), // Call our corrected wrapper function
                style: Theme.of(context).textTheme.bodyMedium,
              ),
              const SizedBox(height: 40),
              Text(
                'Result of 2^256 - 1:',
                style: Theme.of(context).textTheme.headlineMedium,
              ),
              const SizedBox(height: 8),
              SelectableText(
                getBigNumber(), // Call the other wrapper function
                textAlign: TextAlign.center,
                style: Theme.of(context).textTheme.bodyMedium?.copyWith(fontFamily: 'monospace'),
              ),
            ],
          ),
        ),
      ),
    );
  }
}