// This is a basic Flutter widget test.
//
// To perform an interaction with a widget in your test, use the WidgetTester
// utility in the flutter_test package. For example, you can send tap and scroll
// gestures. You can also use WidgetTester to find child widgets in the widget
// tree, read text, and verify that the values of widget properties are correct.

import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';

import 'package:factor_hunter/main.dart';

void main() {
  testWidgets('App renders the main title and key widgets', (WidgetTester tester) async {
    // Build our app and trigger a frame.
    // CORRECTED: Changed MyApp() to FactorHunterApp()
    await tester.pumpWidget(const FactorHunterApp());

    // Verify that the main title is present.
    expect(find.text('Factor Hunter'), findsOneWidget);

    // Verify that a key input field is present.
    expect(find.widgetWithText(TextField, 'Base (a)'), findsOneWidget);
    
    // Verify that the initial status is 'Idle'.
    expect(find.text('Idle'), findsOneWidget);
  });
}