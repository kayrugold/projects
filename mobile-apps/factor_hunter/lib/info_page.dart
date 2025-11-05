// lib/info_page.dart

import 'package:flutter/material.dart';

// NOTE: This constant must be defined in main.dart or a shared file 
// for the code to compile, but we define it here for clarity.
// We will update main.dart to include it.
const String APP_VERSION = "1.0.0+1"; 

class InfoPage extends StatelessWidget {
  const InfoPage({super.key});

  @override
  Widget build(BuildContext context) {
    return DefaultTabController(
      length: 3,
      child: Scaffold(
        appBar: AppBar(
          title: const Text("Factor Hunter - Information Tome"),
          bottom: const TabBar(
            tabs: [
              Tab(icon: Icon(Icons.info_outline), text: "About"),
              Tab(icon: Icon(Icons.help_outline), text: "Help"),
              Tab(icon: Icon(Icons.gavel), text: "Licenses"),
            ],
          ),
        ),
        body: const TabBarView(
          children: [
            _AboutTab(),
            _HelpTab(),
            _LicensesTab(),
          ],
        ),
      ),
    );
  }
}

class _AboutTab extends StatelessWidget {
  const _AboutTab();

  @override
  Widget build(BuildContext context) {
    return SingleChildScrollView(
      padding: const EdgeInsets.all(16.0),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text("Andy's Dev Studio", style: Theme.of(context).textTheme.headlineMedium),
          const Divider(height: 20),
          Text(
            "Factor Hunter: The Tome of Numerical Alchemy",
            style: Theme.of(context).textTheme.titleLarge,
          ),
          const SizedBox(height: 10),
          const Text(
            "Version $APP_VERSION",
            style: TextStyle(fontStyle: FontStyle.italic),
          ),
          const SizedBox(height: 20),
          const Text(
            "Factor Hunter is a high-performance utility designed for engineers, mathematicians, and technical hobbyists. It specializes in finding prime factors for numbers in the form a^b + c using optimized algorithms and concurrent processing (isolates).",
            style: TextStyle(fontSize: 16),
          ),
          const SizedBox(height: 20),
          const Text("Developer: Andy's Dev Studio"),
          const Text("Contact: andysdevstudio@gmail.com"),
          const Text("Website: andysdevstudio.pages.dev"),
          const SizedBox(height: 30),
          Text("Legal", style: Theme.of(context).textTheme.titleLarge),
          const Divider(height: 10),
          const Text("This software is provided 'as-is' under a perpetual license. For full Privacy Policy and Terms of Service, please consult the links on the main screen of the Google Play Store listing."),
        ],
      ),
    );
  }
}

class _HelpTab extends StatelessWidget {
  const _HelpTab();

  @override
  Widget build(BuildContext context) {
    return SingleChildScrollView(
      padding: const EdgeInsets.all(16.0),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text("How to Use Factor Hunter", style: Theme.of(context).textTheme.headlineMedium),
          const Divider(height: 20),

          // --- Section 1: Number Input ---
          Text("1. Defining the Target Number (a^b + c)", style: Theme.of(context).textTheme.titleLarge),
          const SizedBox(height: 10),
          const Text("Input the Base (a), Exponent (b), and Addend (c) to define the number whose factors you wish to find. Presets are available for famous numbers."),
          const SizedBox(height: 20),

          // --- Section 2: Scanning ---
          Text("2. Setting Search Parameters", style: Theme.of(context).textTheme.titleLarge),
          const SizedBox(height: 10),
          const Text("**Min/Max Limit:** Defines the range of prime numbers to test."),
          const Text("**Chunk Size:** Controls the workload assigned to each processor (Isolate) for parallel scanning. The app attempts to auto-tune this."),
          const Text("**Advanced Filtering:** Use the Prime Filtering section to restrict the search to primes of the form p = k * m + n. This is useful for algebraic forms like Fermat or Mersenne numbers."),
          const SizedBox(height: 20),

          // --- Section 3: Results ---
          Text("3. Interpreting Results", style: Theme.of(context).textTheme.titleLarge),
          const SizedBox(height: 10),
          const Text("The app first runs a quick Trial Division check for factors up to 2,000. The **Main Log** tracks the search process, and the **Found Factors** box displays all divisors discovered. Use the copy buttons to transfer results to your clipboard."),
        ],
      ),
    );
  }
}

class _LicensesTab extends StatelessWidget {
  const _LicensesTab();

  @override
  Widget build(BuildContext context) {
    // This uses Flutter's built-in LicensePage widget to display all package licenses
    return const LicensePage(
      applicationName: 'Factor Hunter',
      applicationVersion: APP_VERSION,
    );
  }
}
