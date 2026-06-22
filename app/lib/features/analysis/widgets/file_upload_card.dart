import 'dart:ui';
import 'package:animate_do/animate_do.dart';
import 'package:file_picker/file_picker.dart';
import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

class FileUploadCard extends StatelessWidget {
  final PlatformFile? selectedFile;
  final VoidCallback onTap;
  final VoidCallback? onRemove;
  final bool isLoading;

  const FileUploadCard({
    super.key,
    required this.selectedFile,
    required this.onTap,
    this.onRemove,
    this.isLoading = false,
  });

  @override
  Widget build(BuildContext context) {
    final scheme = Theme.of(context).colorScheme;
    final isDark = scheme.brightness == Brightness.dark;
    final isSelected = selectedFile != null;

    return FadeInUp(
      duration: const Duration(milliseconds: 500),
      child: GestureDetector(
        onTap: isLoading ? null : onTap,
        child: ClipRRect(
          borderRadius: BorderRadius.circular(20),
          child: BackdropFilter(
            filter: ImageFilter.blur(sigmaX: 20, sigmaY: 20),
            child: Container(
              padding: const EdgeInsets.all(24),
              decoration: BoxDecoration(
                color: scheme.surface.withValues(alpha: isDark ? 0.35 : 0.55),
                borderRadius: BorderRadius.circular(20),
                border: Border.all(
                  color: isSelected
                      ? scheme.primary.withValues(alpha: 0.6)
                      : (isDark ? Colors.white.withValues(alpha: 0.1) : Colors.grey.shade300),
                  width: isSelected ? 2 : 1.5,
                ),
                boxShadow: isSelected
                    ? [
                        BoxShadow(
                          color: scheme.primary.withValues(alpha: 0.25),
                          blurRadius: 24,
                          spreadRadius: 1,
                        )
                      ]
                    : [
                        BoxShadow(
                          color: Colors.black.withValues(alpha: 0.03),
                          blurRadius: 10,
                          offset: const Offset(0, 4),
                        )
                      ],
              ),
              child: Stack(
                children: [
                  Center(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.center,
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        _UploadIcon(
                          isSelected: isSelected,
                          isLoading: isLoading,
                        ),
                        const SizedBox(height: 16),
                        Text(
                          isSelected ? 'Resume Selected' : 'Upload Your Resume',
                          textAlign: TextAlign.center,
                          style: GoogleFonts.outfit(
                            fontSize: 18,
                            fontWeight: FontWeight.w700,
                            color: scheme.onSurface,
                          ),
                        ),
                        const SizedBox(height: 8),
                        Text(
                          isSelected
                              ? selectedFile!.name
                              : 'Click to upload a PDF file',
                          textAlign: TextAlign.center,
                          maxLines: 1,
                          overflow: TextOverflow.ellipsis,
                          style: GoogleFonts.inter(
                            fontSize: 14,
                            fontWeight: FontWeight.w500,
                            color: isSelected
                                ? scheme.primary
                                : Colors.grey.shade500,
                          ),
                        ),
                        if (isSelected) ...[
                          const SizedBox(height: 14),
                          TextButton.icon(
                            onPressed: isLoading ? null : onRemove,
                            icon: const Icon(Icons.close_rounded, size: 18),
                            label: const Text('Remove file'),
                          ),
                        ],
                      ],
                    ),
                  ),

                  // LOADING OVERLAY
                  if (isLoading)
                    Positioned.fill(
                      child: Container(
                        decoration: BoxDecoration(
                          color: scheme.surface.withValues(alpha: 0.65),
                          borderRadius: BorderRadius.circular(20),
                        ),
                        child: const Center(
                          child: CircularProgressIndicator(strokeWidth: 2),
                        ),
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

class _UploadIcon extends StatelessWidget {
  final bool isSelected;
  final bool isLoading;

  const _UploadIcon({
    required this.isSelected,
    required this.isLoading,
  });

  @override
  Widget build(BuildContext context) {
    final scheme = Theme.of(context).colorScheme;

    return AnimatedContainer(
      duration: const Duration(milliseconds: 300),
      width: 84,
      height: 84,
      decoration: BoxDecoration(
        shape: BoxShape.circle,
        gradient: isSelected
            ? LinearGradient(
                colors: [
                  scheme.primary,
                  scheme.secondary,
                ],
              )
            : null,
        color: !isSelected
            ? scheme.primary.withValues(alpha: 0.15)
            : null,
        boxShadow: isSelected
            ? [
                BoxShadow(
                  color: scheme.primary.withValues(alpha: 0.4),
                  blurRadius: 18,
                )
              ]
            : [],
      ),
      child: isLoading
          ? const Padding(
              padding: EdgeInsets.all(22),
              child: CircularProgressIndicator(strokeWidth: 2),
            )
          : Icon(
              isSelected
                  ? Icons.description_rounded
                  : Icons.cloud_upload_rounded,
              size: 38,
              color: Colors.white,
            ),
    );
  }
}