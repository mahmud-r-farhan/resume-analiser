import 'package:flutter/material.dart';

void main() {
  runApp(const ResumeCopilotApp());
}

class ResumeCopilotApp extends StatelessWidget {
  const ResumeCopilotApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      debugShowCheckedModeBanner: false,
      title: 'Resume Copilot',
      theme: ThemeData(
        useMaterial3: true,
        colorScheme: ColorScheme.fromSeed(
          seedColor: Colors.deepPurple,
          brightness: Brightness.dark,
        ),
      ),
      home: const LandingPage(),
    );
  }
}

class LandingPage extends StatelessWidget {
  const LandingPage({super.key});

  @override
  Widget build(BuildContext context) {
    final colorScheme = Theme.of(context).colorScheme;

    return Scaffold(
      backgroundColor: colorScheme.surface,
      body: Stack(
        children: [
          // Main Center Content
          Center(
            child: Padding(
              padding: const EdgeInsets.symmetric(horizontal: 29),
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Text(
                    'Resume Copilot',
                    textAlign: TextAlign.center,
                    style: TextStyle(
                      fontSize: 39,
                      fontWeight: FontWeight.w700,
                      color: colorScheme.primary,
                      letterSpacing: -0.5,
                    ),
                  ),

                  const SizedBox(height: 16),

                  Text(
                    'An AI-powered career copilot that helps candidates\n'
                    'personalise their resume for every job.',
                    textAlign: TextAlign.center,
                    style: TextStyle(
                      fontSize: 16,
                      height: 1.5,
                      color: colorScheme.onSurface.withOpacity(0.75),
                    ),
                  ),

                  const SizedBox(height: 48),

                  const CircularProgressIndicator(strokeWidth: 2.5),

                  const SizedBox(height: 16),

                  Text(
                    'Coming Soon',
                    style: TextStyle(
                      fontSize: 14,
                      fontWeight: FontWeight.w500,
                      color: colorScheme.onSurface.withOpacity(0.6),
                      letterSpacing: 0.6,
                    ),
                  ),
                ],
              ),
            ),
          ),

          // Footer / Copyright
          Positioned(
            bottom: 16,
            left: 0,
            right: 0,
            child: Column(
              children: [
                Container(
                  width: 40,
                  height: 1,
                  color: colorScheme.onSurface.withOpacity(0.1),
                ),
                const SizedBox(height: 8),
                Text(
                  '© 2026 Mahmud Rahman',
                  style: TextStyle(
                    fontSize: 10,
                    letterSpacing: 1.2,
                    color: colorScheme.onSurface.withOpacity(0.35),
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}