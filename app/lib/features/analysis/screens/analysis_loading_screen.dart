import 'package:animate_do/animate_do.dart';
import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

class AnalysisLoadingScreen extends StatefulWidget {
  const AnalysisLoadingScreen({super.key});

  @override
  State<AnalysisLoadingScreen> createState() => _AnalysisLoadingScreenState();
}

class _AnalysisLoadingScreenState extends State<AnalysisLoadingScreen> with TickerProviderStateMixin {
  late AnimationController _pulseController;
  late AnimationController _orbitController;
  late List<AnimationController> _dotControllers;

  @override
  void initState() {
    super.initState();
    _pulseController = AnimationController(
      duration: const Duration(milliseconds: 1500),
      vsync: this,
    )..repeat();

    _orbitController = AnimationController(
      duration: const Duration(seconds: 3),
      vsync: this,
    )..repeat();

    _dotControllers = List.generate(
      4,
      (index) => AnimationController(
        duration: const Duration(milliseconds: 800),
        vsync: this,
      )..repeat(reverse: true),
    );

    for (var i = 0; i < _dotControllers.length; i++) {
      _dotControllers[i].forward(from: (i * 200) / 1000);
    }
  }

  @override
  void dispose() {
    _pulseController.dispose();
    _orbitController.dispose();
    for (var controller in _dotControllers) {
      controller.dispose();
    }
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: SafeArea(
        child: Center(
          child: SingleChildScrollView(
            child: Padding(
              padding: const EdgeInsets.all(24.0),
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  // Animated loading indicator
                  FadeInUp(
                    child: SizedBox(
                      width: 200,
                      height: 200,
                      child: Stack(
                        alignment: Alignment.center,
                        children: [
                          // Pulse circle
                          ScaleTransition(
                            scale: Tween<double>(begin: 1.0, end: 1.3).animate(
                              CurvedAnimation(parent: _pulseController, curve: Curves.easeInOut),
                            ),
                            child: Container(
                              width: 180,
                              height: 180,
                              decoration: BoxDecoration(
                                shape: BoxShape.circle,
                                border: Border.all(
                                  color: Theme.of(context).colorScheme.primary.withOpacity(0.2),
                                  width: 2,
                                ),
                              ),
                            ),
                          ),
                          // Orbit circle
                          SizedBox(
                            width: 150,
                            height: 150,
                            child: RotationTransition(
                              turns: _orbitController,
                              child: Stack(
                                children: [
                                  // Orbiting dot
                                  Positioned(
                                    top: 0,
                                    left: 75,
                                    child: Container(
                                      width: 12,
                                      height: 12,
                                      decoration: BoxDecoration(
                                        shape: BoxShape.circle,
                                        color: Theme.of(context).colorScheme.primary,
                                        boxShadow: [
                                          BoxShadow(
                                            color: Theme.of(context).colorScheme.primary.withOpacity(0.5),
                                            blurRadius: 8,
                                          )
                                        ],
                                      ),
                                    ),
                                  ),
                                ],
                              ),
                            ),
                          ),
                          // Center icon
                          Container(
                            width: 100,
                            height: 100,
                            decoration: BoxDecoration(
                              shape: BoxShape.circle,
                              color: Theme.of(context).colorScheme.primary.withOpacity(0.1),
                            ),
                            child: Icon(
                              Icons.analytics_outlined,
                              size: 50,
                              color: Theme.of(context).colorScheme.primary,
                            ),
                          ),
                        ],
                      ),
                    ),
                  ),
                  const SizedBox(height: 40),
                  // Status text
                  FadeInUp(
                    delay: const Duration(milliseconds: 300),
                    child: Text(
                      'Analyzing Your Resume',
                      style: GoogleFonts.outfit(
                        fontSize: 24,
                        fontWeight: FontWeight.w700,
                        color: Theme.of(context).textTheme.headlineLarge?.color,
                      ),
                    ),
                  ),
                  const SizedBox(height: 12),
                  FadeInUp(
                    delay: const Duration(milliseconds: 400),
                    child: Text(
                      'Comparing your resume with job description',
                      textAlign: TextAlign.center,
                      style: GoogleFonts.inter(
                        fontSize: 15,
                        fontWeight: FontWeight.w400,
                        color: Colors.grey.shade600,
                        height: 1.4,
                      ),
                    ),
                  ),
                  const SizedBox(height: 24),
                  // Loading dots
                  FadeInUp(
                    delay: const Duration(milliseconds: 500),
                    child: Row(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: List.generate(
                        4,
                        (index) => Padding(
                          padding: const EdgeInsets.symmetric(horizontal: 6),
                          child: ScaleTransition(
                            scale: Tween<double>(begin: 0.6, end: 1.0).animate(
                              CurvedAnimation(parent: _dotControllers[index], curve: Curves.easeInOut),
                            ),
                            child: Container(
                              width: 10,
                              height: 10,
                              decoration: BoxDecoration(
                                shape: BoxShape.circle,
                                color: Theme.of(context).colorScheme.primary,
                              ),
                            ),
                          ),
                        ),
                      ),
                    ),
                  ),
                  const SizedBox(height: 40),
                  // Progress steps
                  FadeInUp(
                    delay: const Duration(milliseconds: 600),
                    child: Column(
                      children: [
                        _ProgressStep(
                          icon: Icons.check_circle,
                          label: 'Extracting resume content',
                          isActive: true,
                        ),
                        const SizedBox(height: 12),
                        _ProgressStep(
                          icon: Icons.schedule,
                          label: 'Processing job description',
                          isActive: false,
                        ),
                        const SizedBox(height: 12),
                        _ProgressStep(
                          icon: Icons.auto_awesome,
                          label: 'Running AI analysis',
                          isActive: false,
                        ),
                      ],
                    ),
                  ),
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }
}

class _ProgressStep extends StatelessWidget {
  final IconData icon;
  final String label;
  final bool isActive;

  const _ProgressStep({
    required this.icon,
    required this.label,
    required this.isActive,
  });

  @override
  Widget build(BuildContext context) {
    return Row(
      children: [
        Icon(
          icon,
          color: isActive
              ? Theme.of(context).colorScheme.primary
              : Colors.grey.shade400,
          size: 20,
        ),
        const SizedBox(width: 12),
        Expanded(
          child: Text(
            label,
            style: GoogleFonts.inter(
              fontSize: 14,
              fontWeight: FontWeight.w500,
              color: isActive
                  ? Theme.of(context).textTheme.bodyMedium?.color
                  : Colors.grey.shade400,
            ),
          ),
        ),
        if (isActive)
          SizedBox(
            width: 16,
            height: 16,
            child: CircularProgressIndicator(
              strokeWidth: 2,
              valueColor: AlwaysStoppedAnimation<Color>(
                Theme.of(context).colorScheme.primary,
              ),
            ),
          ),
      ],
    );
  }
}
