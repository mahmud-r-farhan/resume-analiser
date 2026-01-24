import 'package:file_picker/file_picker.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../services/analysis_service.dart';

final analysisServiceProvider = Provider<AnalysisService>((ref) {
  return AnalysisService();
});

final analysisProvider = NotifierProvider<AnalysisNotifier, AsyncValue<Map<String, dynamic>?>>(() {
  return AnalysisNotifier();
});

class AnalysisNotifier extends Notifier<AsyncValue<Map<String, dynamic>?>> {
  @override
  AsyncValue<Map<String, dynamic>?> build() {
    return const AsyncValue.data(null);
  }

  Future<void> analyze({
    required PlatformFile file,
    required String jobDescription,
  }) async {
    final service = ref.read(analysisServiceProvider);
    state = const AsyncValue.loading();
    try {
      final result = await service.analyzeResume(
        file: file,
        jobDescription: jobDescription,
      );
      state = AsyncValue.data(result);
    } catch (e, stack) {
      state = AsyncValue.error(e, stack);
    }
  }

  void reset() {
    state = const AsyncValue.data(null);
  }
}
