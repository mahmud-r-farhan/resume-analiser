import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:dio/dio.dart';
import '../../../core/config/api_config.dart';
import '../widgets/model_selector.dart';

class ModelProvider {
  static final Dio _dio = Dio();

  static Future<List<ModelInfo>> fetchModels() async {
    try {
      final response = await _dio.get(
        '${ApiConfig.baseUrl}/models',
        options: Options(
          sendTimeout: const Duration(seconds: 10),
          receiveTimeout: const Duration(seconds: 10),
        ),
      );

      if (response.statusCode == 200 && response.data['success'] == true) {
        final models = (response.data['models'] as List)
            .map((m) => ModelInfo.fromJson(m as Map<String, dynamic>))
            .toList();
        return models;
      } else {
        throw Exception('Failed to fetch models');
      }
    } catch (e) {
      // Fallback models if API fails
      return [
        ModelInfo(
          id: 'deepseek/deepseek-chat-v3.1:free',
          name: 'DeepSeek Chat V3.1',
          provider: 'DeepSeek',
          description: 'Fast & Free',
        ),
        ModelInfo(
          id: 'meta-llama/llama-3.2-3b-instruct:free',
          name: 'Llama 3.2 3B',
          provider: 'Meta',
          description: 'Compact & Fast',
        ),
      ];
    }
  }
}

// Selected Model Notifier
class SelectedModelNotifier extends Notifier<String> {
  @override
  String build() {
    return 'deepseek/deepseek-chat-v3.1:free';
  }

  void setModel(String modelId) {
    state = modelId;
  }
}

// Riverpod Providers
final modelsProvider = FutureProvider<List<ModelInfo>>((ref) async {
  return ModelProvider.fetchModels();
});

final selectedModelProvider = NotifierProvider<SelectedModelNotifier, String>(() {
  return SelectedModelNotifier();
});

// Watch models and update default if needed
final modelStateProvider = Provider<({List<ModelInfo> models, String selectedId, bool isLoading})>((ref) {
  final modelsAsync = ref.watch(modelsProvider);
  final selectedId = ref.watch(selectedModelProvider);

  return modelsAsync.when(
    data: (models) {
      // If selected model doesn't exist in the list, pick the first one
      final isValidSelection = models.any((m) => m.id == selectedId);
      final finalSelectedId = isValidSelection && selectedId.isNotEmpty
          ? selectedId
          : (models.isNotEmpty ? models.first.id : '');

      return (
        models: models,
        selectedId: finalSelectedId,
        isLoading: false,
      );
    },
    loading: () {
      return (
        models: [],
        selectedId: selectedId,
        isLoading: true,
      );
    },
    error: (err, stack) {
      // Return fallback models on error
      final fallbackModels = [
        ModelInfo(
          id: 'deepseek/deepseek-chat-v3.1:free',
          name: 'DeepSeek Chat V3.1',
          provider: 'DeepSeek',
          description: 'Fast & Free',
        ),
        ModelInfo(
          id: 'meta-llama/llama-3.2-3b-instruct:free',
          name: 'Llama 3.2 3B',
          provider: 'Meta',
          description: 'Compact & Fast',
        ),
      ];
      return (
        models: fallbackModels,
        selectedId: selectedId,
        isLoading: false,
      );
    },
  );
});
