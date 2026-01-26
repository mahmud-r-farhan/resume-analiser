import 'package:animate_do/animate_do.dart';
import 'package:file_picker/file_picker.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:google_fonts/google_fonts.dart';

import '../../../core/providers/theme_provider.dart';
import '../providers/analysis_provider.dart';
import '../providers/model_provider.dart';
import '../widgets/app_drawer.dart';
import '../widgets/file_upload_card.dart';
import '../widgets/model_selector.dart';
import '../widgets/step_indicator.dart';
import 'analysis_loading_screen.dart';
import 'analysis_result_screen.dart';

class HomeScreen extends ConsumerStatefulWidget {
  const HomeScreen({super.key});

  @override
  ConsumerState<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends ConsumerState<HomeScreen> {
  final TextEditingController _jobDescController = TextEditingController();
  PlatformFile? _selectedFile;
  int _currentStep = 0;

  @override
  void dispose() {
    _jobDescController.dispose();
    super.dispose();
  }

  Future<void> _pickFile() async {
    FilePickerResult? result = await FilePicker.platform.pickFiles(
      type: FileType.custom,
      allowedExtensions: ['pdf'],
    );

    if (result != null) {
      setState(() {
        _selectedFile = result.files.first;
        if (_currentStep == 0) {
          _currentStep = 1;
        }
      });
    }
  }

  void _analyze() {
    if (_selectedFile == null || _jobDescController.text.trim().isEmpty) {
      _showErrorSnackBar('Please select a file and enter a job description.');
      return;
    }

    if (_jobDescController.text.trim().length < 50) {
      _showErrorSnackBar('Job description must be at least 50 characters.');
      return;
    }

    setState(() {
      _currentStep = 2;
    });

    final selectedModel = ref.read(selectedModelProvider);
    ref.read(analysisProvider.notifier).analyze(
          file: _selectedFile!,
          jobDescription: _jobDescController.text,
          model: selectedModel,
        );
  }

  void _showErrorSnackBar(String message) {
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Row(
          children: [
            Icon(Icons.error_outline, color: Colors.white),
            const SizedBox(width: 12),
            Expanded(
              child: Text(message),
            ),
          ],
        ),
        backgroundColor: Colors.red.shade400,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(12),
        ),
        margin: const EdgeInsets.all(16),
        behavior: SnackBarBehavior.floating,
      ),
    );
  }

  void _showSuccessSnackBar(String message) {
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Row(
          children: [
            Icon(Icons.check_circle, color: Colors.white),
            const SizedBox(width: 12),
            Expanded(
              child: Text(message),
            ),
          ],
        ),
        backgroundColor: Colors.green.shade400,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(12),
        ),
        margin: const EdgeInsets.all(16),
        behavior: SnackBarBehavior.floating,
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    ref.listen<AsyncValue<Map<String, dynamic>?>>(analysisProvider, (previous, next) {
      next.whenData((data) {
        if (data != null) {
          Navigator.of(context).push(
            MaterialPageRoute(
              builder: (context) => AnalysisResultScreen(data: data),
            ),
          ).then((_) {
            // Reset to step 0 when returning
            setState(() {
              _currentStep = 0;
              _selectedFile = null;
              _jobDescController.clear();
            });
            ref.read(analysisProvider.notifier).reset();
          });
        }
      });
      if (next.hasError) {
        _showErrorSnackBar(next.error.toString().replaceAll('Exception: ', ''));
        setState(() {
          _currentStep = 1;
        });
      }
    });

    final isLoading = ref.watch(analysisProvider).isLoading;

    if (isLoading) {
      return const AnalysisLoadingScreen();
    }

    final steps = [
      StepItem(
        title: 'Upload PDF',
        description: 'Select your resume',
        icon: Icons.upload_file,
      ),
      StepItem(
        title: 'Job Details',
        description: 'Paste job description',
        icon: Icons.description,
      ),
      StepItem(
        title: 'Analyze',
        description: 'AI Processing',
        icon: Icons.analytics,
      ),
      StepItem(
        title: 'Results',
        description: 'View report',
        icon: Icons.check_circle,
      ),
    ];

    return Scaffold(
      drawer: const AppDrawer(),
      appBar: AppBar(
        elevation: 0,
        scrolledUnderElevation: 0,
        leading: Builder(
          builder: (context) {
            return IconButton(
              icon: const Icon(Icons.menu_rounded, size: 28),
              onPressed: () {
                Scaffold.of(context).openDrawer();
              },
            );
          },
        ),
        centerTitle: false,
        actions: [
          Padding(
            padding: const EdgeInsets.only(right: 16.0),
            child: Consumer(
              builder: (context, ref, child) {
                final themeMode = ref.watch(themeProvider);
                final isDarkMode = themeMode == ThemeMode.dark;

                return IconButton(
                  onPressed: () {
                    ref.read(themeProvider.notifier).toggleTheme();
                  },
                  icon: AnimatedSwitcher(
                    duration: const Duration(milliseconds: 300),
                    transitionBuilder: (child, animation) {
                      return ScaleTransition(scale: animation, child: child);
                    },
                    child: Icon(
                      isDarkMode ? Icons.light_mode_rounded : Icons.dark_mode_rounded,
                      key: ValueKey(isDarkMode),
                      size: 24,
                    ),
                  ),
                  tooltip: isDarkMode ? 'Light Mode' : 'Dark Mode',
                );
              },
            ),
          ),
        ],
      ),
      body: SingleChildScrollView(
        child: Padding(
          padding: const EdgeInsets.all(24.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Step Indicator
              FadeInDown(
                child: StepIndicator(
                  currentStep: _currentStep,
                  steps: steps,
                ),
              ),
              const SizedBox(height: 40),

              // Content based on current step
              if (_currentStep == 0) ...[
                _buildStep1Content(context),
              ] else if (_currentStep == 1) ...[
                _buildStep2Content(context),
              ],
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildStep1Content(BuildContext context) {
  return LayoutBuilder(
    builder: (context, constraints) {
      return Padding(
        padding: const EdgeInsets.symmetric(horizontal: 16), // 👈 left/right padding
        child: ConstrainedBox(
          constraints: BoxConstraints(
            minWidth: constraints.maxWidth,
          ),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              FadeInUp(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      'Step 1: Upload Your Resume',
                      style: GoogleFonts.outfit(
                        fontSize: 20,
                        fontWeight: FontWeight.w700,
                        color: Theme.of(context)
                            .textTheme
                            .headlineMedium
                            ?.color,
                      ),
                    ),
                    const SizedBox(height: 8),
                    Text(
                      'Upload your PDF resume to get started. We\'ll analyze it against the job description.',
                      style: GoogleFonts.inter(
                        fontSize: 14,
                        fontWeight: FontWeight.w400,
                        color: Colors.grey.shade600,
                        height: 1.5,
                      ),
                    ),
                  ],
                ),
              ),

              const SizedBox(height: 24),

              /// FULL WIDTH FILE UPLOAD
              SizedBox(
                width: double.infinity,
                child: FileUploadCard(
                  selectedFile: _selectedFile,
                  onTap: _pickFile,
                  onRemove: () {
                    setState(() {
                      _selectedFile = null;
                    });
                  },
                ),
              ),

              const SizedBox(height: 24),

              /// FULL WIDTH BUTTON
              SizedBox(
                width: double.infinity,
                height: 56,
                child: ElevatedButton.icon(
                  onPressed: _selectedFile != null
                      ? () {
                          _showSuccessSnackBar(
                              'Resume uploaded successfully!');
                          setState(() {
                            _currentStep = 1;
                          });
                        }
                      : null,
                  icon: const Icon(Icons.arrow_forward, size: 20),
                  label: Text(
                    'Continue to Next Step',
                    style: GoogleFonts.inter(
                      fontSize: 16,
                      fontWeight: FontWeight.w600,
                    ),
                  ),
                ),
              ),
            ],
          ),
        ),
      );
    },
  );
}

  Widget _buildStep2Content(BuildContext context) {
    final modelState = ref.watch(modelStateProvider);

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        FadeInUp(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                'Step 2: Enter Job Description',
                style: GoogleFonts.outfit(
                  fontSize: 20,
                  fontWeight: FontWeight.w700,
                  color: Theme.of(context).textTheme.headlineMedium?.color,
                ),
              ),
              const SizedBox(height: 8),
              Text(
                'Paste the job description you want to match against. The more details, the better the analysis.',
                style: GoogleFonts.inter(
                  fontSize: 14,
                  fontWeight: FontWeight.w400,
                  color: Colors.grey.shade600,
                  height: 1.5,
                ),
              ),
            ],
          ),
        ),
        const SizedBox(height: 24),
        FadeInUp(
          child: Container(
            decoration: BoxDecoration(
              borderRadius: BorderRadius.circular(16),
              boxShadow: [
                BoxShadow(
                  color: Colors.black.withValues(alpha: 0.05),
                  blurRadius: 12,
                  offset: const Offset(0, 4),
                ),
              ],
            ),
            child: TextField(
              controller: _jobDescController,
              maxLines: 8,
              minLines: 6,
              enabled: !ref.watch(analysisProvider).isLoading,
              decoration: InputDecoration(
                hintText: 'Paste the complete job description here...',
                hintStyle: GoogleFonts.inter(
                  fontSize: 14,
                  fontWeight: FontWeight.w400,
                  color: Colors.grey.shade500,
                ),
                border: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(16),
                  borderSide: BorderSide(color: Colors.grey.shade300, width: 1),
                ),
                enabledBorder: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(16),
                  borderSide: BorderSide(color: Colors.grey.shade300, width: 1),
                ),
                focusedBorder: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(16),
                  borderSide: BorderSide(
                    color: Theme.of(context).colorScheme.primary,
                    width: 2,
                  ),
                ),
                filled: true,
                fillColor: Theme.of(context).scaffoldBackgroundColor,
              ),
              style: GoogleFonts.inter(
                fontSize: 14,
                fontWeight: FontWeight.w400,
                height: 1.6,
              ),
            ),
          ),
        ),
        const SizedBox(height: 24),
        // Model Selector
        FadeInUp(
          child: ModelSelector(
            selectedModelId: modelState.selectedId,
            models: modelState.models,
            isLoading: modelState.isLoading,
            onModelSelected: (modelId) {
              ref.read(selectedModelProvider.notifier).setModel(modelId);
            },
          ),
        ),
        const SizedBox(height: 24),
        // Button row
        FadeInUp(
          child: Row(
            children: [
              Expanded(
                child: OutlinedButton.icon(
                  onPressed: () {
                    setState(() {
                      _currentStep = 0;
                    });
                  },
                  icon: const Icon(Icons.arrow_back, size: 20),
                  label: Text(
                    'Back',
                    style: GoogleFonts.inter(
                      fontSize: 16,
                      fontWeight: FontWeight.w600,
                    ),
                  ),
                ),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: ElevatedButton.icon(
                  onPressed: _analyze,
                  icon: const Icon(Icons.rocket_launch, size: 20),
                  label: Text(
                    'Analyze',
                    style: GoogleFonts.inter(
                      fontSize: 16,
                      fontWeight: FontWeight.w600,
                    ),
                  ),
                ),
              ),
            ],
          ),
        ),
        const SizedBox(height: 24),
        // Info box
        FadeInUp(
          child: Container(
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              borderRadius: BorderRadius.circular(12),
              color: Theme.of(context).colorScheme.primary.withValues(alpha: 0.08),
              border: Border.all(
                color: Theme.of(context).colorScheme.primary.withValues(alpha: 0.2),
                width: 1,
              ),
            ),
            child: Row(
              children: [
                Icon(
                  Icons.info_outline,
                  color: Theme.of(context).colorScheme.primary,
                  size: 20,
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: Text(
                    'Tip: Include job requirements, responsibilities, and desired skills for better analysis.',
                    style: GoogleFonts.inter(
                      fontSize: 13,
                      fontWeight: FontWeight.w400,
                      color: Theme.of(context).colorScheme.primary,
                      height: 1.4,
                    ),
                  ),
                ),
              ],
            ),
          ),
        ),
      ],
    );
  }
}
