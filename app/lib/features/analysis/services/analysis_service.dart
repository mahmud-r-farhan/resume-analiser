import 'package:dio/dio.dart';
import 'package:file_picker/file_picker.dart';
import 'package:flutter/foundation.dart';
import '../../../core/config/api_config.dart';

class AnalysisService {
  final Dio _dio = Dio();

  Future<Map<String, dynamic>> analyzeResume({
    required PlatformFile file,
    required String jobDescription,
    required String model,
  }) async {
    try {
      String fileName = file.name;
      MultipartFile multipartFile;

      if (kIsWeb) {
        multipartFile = MultipartFile.fromBytes(
          file.bytes!,
          filename: fileName,
        );
      } else {
        multipartFile = await MultipartFile.fromFile(
          file.path!,
          filename: fileName,
        );
      }

      FormData formData = FormData.fromMap({
        'cv': multipartFile,
        'jobDescription': jobDescription,
        'model': model,
      });

      final response = await _dio.post(
        '${ApiConfig.baseUrl}/analyze',
        data: formData,
        options: Options(
          headers: {
            'Accept': 'application/json',
          },
          // Increase timeout for analysis
          sendTimeout: const Duration(minutes: 2),
          receiveTimeout: const Duration(minutes: 2),
        ),
      );

      // Ensure fitScore is an integer
      final data = response.data as Map<String, dynamic>;
      if (data.containsKey('fitScore')) {
        final fitScoreData = data['fitScore'];
        if (fitScoreData is String) {
          data['fitScore'] = int.tryParse(fitScoreData) ?? 0;
        } else if (fitScoreData == null) {
          data['fitScore'] = 0;
        }
      } else {
        data['fitScore'] = 0;
      }

      // Ensure analysis is a string
      if (!data.containsKey('analysis') || data['analysis'] == null) {
        data['analysis'] = 'No analysis available.';
      }

      return data;
    } on DioException catch (e) {
      if (e.response != null) {
        throw Exception(e.response?.data['error'] ?? 'Analysis failed');
      }
      throw Exception('Connection error: ${e.message}');
    } catch (e) {
      throw Exception('An unexpected error occurred: $e');
    }
  }

  Future<Uint8List> generateAnalysisPDF({
    required String analysis,
    required int score,
    required String fileName,
  }) async {
    try {
      final response = await _dio.post(
        '${ApiConfig.baseUrl}/generate-pdf',
        data: {
          'markdown': '# Analysis Report for $fileName\n\n## Fit Score: $score%\n\n$analysis',
          'template': 'classic',
          'fileName': 'Analysis_Report',
        },
        options: Options(
          responseType: ResponseType.bytes,
          headers: {
            'Accept': 'application/pdf',
          },
        ),
      );

      return Uint8List.fromList(response.data);
    } on DioException catch (e) {
      if (e.response != null) {
        throw Exception('PDF generation failed');
      }
      throw Exception('Connection error: ${e.message}');
    } catch (e) {
      throw Exception('An unexpected error occurred: $e');
    }
  }
}
