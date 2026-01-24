import 'dart:io';
import 'package:dio/dio.dart';
import 'package:file_picker/file_picker.dart';
import 'package:flutter/foundation.dart';

class AnalysisService {
  final Dio _dio = Dio();

  String get _baseUrl {
    if (kIsWeb) return 'http://localhost:5000/api'; // should change with backend api (localhost or server url)
    if (Platform.isAndroid) return 'http://10.0.2.2:5000/api'; // should change with backend api (localhost or server url)
    return 'http://localhost:5000/api';
  }

  Future<Map<String, dynamic>> analyzeResume({
    required PlatformFile file,
    required String jobDescription,
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
        'model': 'deepseek/deepseek-chat-v3.1:free', //  Default model
      });

      final response = await _dio.post(
        '$_baseUrl/analyze',
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
}
