import 'dart:convert';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:shared_preferences/shared_preferences.dart';

final historyProvider = NotifierProvider<HistoryNotifier, List<Map<String, dynamic>>>(() {
  return HistoryNotifier();
});

class HistoryNotifier extends Notifier<List<Map<String, dynamic>>> {
  static const String _key = 'analysis_history';

  @override
  List<Map<String, dynamic>> build() {
    _loadHistory();
    return [];
  }

  Future<void> _loadHistory() async {
    try {
      final prefs = await SharedPreferences.getInstance();
      final String? historyJson = prefs.getString(_key);
      if (historyJson != null) {
        final List<dynamic> decoded = json.decode(historyJson);
        state = decoded.cast<Map<String, dynamic>>();
      }
    } catch (e) {
      state = [];
    }
  }

  Future<void> addEntry(Map<String, dynamic> result) async {
    final entry = {
      ...result,
      'timestamp': DateTime.now().toIso8601String(),
    };

    final newState = [entry, ...state];
    // Keep only last 10 entries
    if (newState.length > 10) {
      newState.removeRange(10, newState.length);
    }

    state = newState;

    try {
      final prefs = await SharedPreferences.getInstance();
      await prefs.setString(_key, json.encode(state));
    } catch (e) {
      // Ignore save errors
    }
  }

  Future<void> clearHistory() async {
    state = [];
    try {
      final prefs = await SharedPreferences.getInstance();
      await prefs.remove(_key);
    } catch (e) {
      // Ignore errors
    }
  }
}
