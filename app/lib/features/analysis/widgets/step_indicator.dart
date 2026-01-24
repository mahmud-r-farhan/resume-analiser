import 'dart:ui';
import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

class StepIndicator extends StatelessWidget {
  final int currentStep;
  final List<StepItem> steps;

  const StepIndicator({
    super.key,
    required this.currentStep,
    required this.steps,
  });

  @override
  Widget build(BuildContext context) {
    final scheme = Theme.of(context).colorScheme;
    final isDark = scheme.brightness == Brightness.dark;

    return ClipRRect(
      borderRadius: BorderRadius.circular(20),
      child: BackdropFilter(
        filter: ImageFilter.blur(sigmaX: 18, sigmaY: 18),
        child: Container(
          padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 28),
          decoration: BoxDecoration(
            color: scheme.surface.withOpacity(isDark ? 0.35 : 0.55),
            borderRadius: BorderRadius.circular(20),
            border: Border.all(
              color: Colors.white.withOpacity(0.15),
            ),
          ),
          child: Column(
            children: [
              Row(
                children: List.generate(
                  steps.length,
                  (index) => Expanded(
                    child: _GlassStepNode(
                      step: steps[index],
                      isActive: index == currentStep,
                      isCompleted: index < currentStep,
                      showLine: index != steps.length - 1,
                    ),
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}

class StepDescription extends StatelessWidget {
  final String description;

  const StepDescription({
    super.key,
    required this.description,
  });

  @override
  Widget build(BuildContext context) {
    final scheme = Theme.of(context).colorScheme;
    final isDark = scheme.brightness == Brightness.dark;

    return ClipRRect(
      borderRadius: BorderRadius.circular(20),
      child: BackdropFilter(
        filter: ImageFilter.blur(sigmaX: 18, sigmaY: 18),
        child: Container(
          width: double.infinity,
          padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 20),
          decoration: BoxDecoration(
            color: scheme.surface.withOpacity(isDark ? 0.35 : 0.55),
            borderRadius: BorderRadius.circular(20),
            border: Border.all(
              color: Colors.white.withOpacity(0.15),
            ),
          ),
          child: Center(
            child: Text(
              description,
              textAlign: TextAlign.center,
              style: GoogleFonts.inter(
                fontSize: 14,
                fontWeight: FontWeight.w500,
                color: scheme.onSurface.withOpacity(0.8),
                height: 1.5,
              ),
            ),
          ),
        ),
      ),
    );
  }
}

class _GlassStepNode extends StatelessWidget {
  final StepItem step;
  final bool isActive;
  final bool isCompleted;
  final bool showLine;

  const _GlassStepNode({
    required this.step,
    required this.isActive,
    required this.isCompleted,
    required this.showLine,
  });

  @override
  Widget build(BuildContext context) {
    final scheme = Theme.of(context).colorScheme;

    final gradient = LinearGradient(
      colors: [scheme.primary, scheme.secondary],
      begin: Alignment.topLeft,
      end: Alignment.bottomRight,
    );

    return Column(
      mainAxisSize: MainAxisSize.min,
      children: [
        Row(
          children: [
            Expanded(
              child: Align(
                alignment: Alignment.center,
                child: AnimatedScale(
                  duration: const Duration(milliseconds: 300),
                  scale: isActive ? 1.15 : 1.0,
                  child: Container(
                    width: 48,
                    height: 48,
                    decoration: BoxDecoration(
                      shape: BoxShape.circle,
                      gradient: (isActive || isCompleted) ? gradient : null,
                      color: (!isActive && !isCompleted)
                          ? scheme.surfaceContainerHighest.withOpacity(0.6)
                          : null,
                      boxShadow: isActive
                          ? [
                              BoxShadow(
                                color: scheme.primary.withOpacity(0.35),
                                blurRadius: 20,
                                spreadRadius: 2,
                              )
                            ]
                          : isCompleted
                              ? [
                                  BoxShadow(
                                    color: scheme.primary.withOpacity(0.2),
                                    blurRadius: 12,
                                    spreadRadius: 0,
                                  )
                                ]
                              : [],
                      border: Border.all(
                        color: Colors.white.withOpacity(0.25),
                      ),
                    ),
                    child: Icon(
                      isCompleted ? Icons.check_rounded : step.icon,
                      color: Colors.white,
                      size: 22,
                    ),
                  ),
                ),
              ),
            ),
            if (showLine)
              Expanded(
                child: Padding(
                  padding: const EdgeInsets.symmetric(horizontal: 8),
                  child: AnimatedContainer(
                    duration: const Duration(milliseconds: 300),
                    height: 2.5,
                    decoration: BoxDecoration(
                      gradient: isCompleted
                          ? gradient
                          : LinearGradient(
                              colors: [
                                Colors.grey.withOpacity(0.2),
                                Colors.grey.withOpacity(0.2),
                              ],
                            ),
                      borderRadius: BorderRadius.circular(2),
                    ),
                  ),
                ),
              ),
          ],
        ),
        const SizedBox(height: 12),
        Padding(
          padding: const EdgeInsets.symmetric(horizontal: 8),
          child: Text(
            step.title,
            textAlign: TextAlign.center,
            maxLines: 2,
            overflow: TextOverflow.ellipsis,
            style: GoogleFonts.inter(
              fontSize: 12,
              fontWeight: isActive ? FontWeight.w700 : FontWeight.w500,
              color: isActive
                  ? scheme.primary
                  : scheme.onSurface.withOpacity(0.6),
              letterSpacing: isActive ? 0.3 : 0,
            ),
          ),
        ),
      ],
    );
  }
}

class StepItem {
  final String title;
  final String description;
  final IconData icon;

  StepItem({
    required this.title,
    required this.description,
    required this.icon,
  });
}