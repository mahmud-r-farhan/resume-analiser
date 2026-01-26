import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

class ModelInfo {
  final String id;
  final String name;
  final String provider;
  final String description;
  final bool recommended;

  ModelInfo({
    required this.id,
    required this.name,
    required this.provider,
    required this.description,
    this.recommended = false,
  });

  factory ModelInfo.fromJson(Map<String, dynamic> json) {
    return ModelInfo(
      id: json['id'] as String,
      name: json['name'] as String,
      provider: json['provider'] as String,
      description: json['description'] as String,
      recommended: json['recommended'] as bool? ?? false,
    );
  }
}

class ModelSelector extends StatefulWidget {
  final String? selectedModelId;
  final List<ModelInfo> models;
  final bool isLoading;
  final Function(String) onModelSelected;

  const ModelSelector({
    super.key,
    required this.selectedModelId,
    required this.models,
    required this.isLoading,
    required this.onModelSelected,
  });

  @override
  State<ModelSelector> createState() => _ModelSelectorState();
}

class _ModelSelectorState extends State<ModelSelector> {
  @override
  Widget build(BuildContext context) {
    final isDarkMode = Theme.of(context).brightness == Brightness.dark;
    final selectedModel = widget.models.firstWhere(
      (m) => m.id == widget.selectedModelId,
      orElse: () => widget.models.isNotEmpty ? widget.models.first : ModelInfo(
        id: '',
        name: 'No model',
        provider: 'N/A',
        description: 'No models available',
      ),
    );

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          'AI Model',
          style: GoogleFonts.outfit(
            fontSize: 14,
            fontWeight: FontWeight.w600,
            color: Theme.of(context).textTheme.bodyMedium?.color,
          ),
        ),
        const SizedBox(height: 12),
        Container(
          decoration: BoxDecoration(
            borderRadius: BorderRadius.circular(12),
            border: Border.all(
              color: isDarkMode ? Colors.grey.shade700 : Colors.grey.shade300,
            ),
            color: isDarkMode ? Colors.grey.shade900 : Colors.grey.shade50,
          ),
          child: DropdownButton<String>(
            value: widget.selectedModelId ?? (widget.models.isNotEmpty ? widget.models.first.id : null),
            isExpanded: true,
            underline: const SizedBox.shrink(),
            icon: Padding(
              padding: const EdgeInsets.only(right: 12.0),
              child: Icon(
                Icons.expand_more,
                color: Theme.of(context).textTheme.bodyMedium?.color,
              ),
            ),
            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
            borderRadius: BorderRadius.circular(12),
            items: widget.isLoading
                ? []
                : widget.models
                    .map((model) => DropdownMenuItem<String>(
                          value: model.id,
                          child: Row(
                            children: [
                              Expanded(
                                child: Column(
                                  crossAxisAlignment: CrossAxisAlignment.start,
                                  mainAxisAlignment: MainAxisAlignment.center,
                                  children: [
                                    Text(
                                      model.name,
                                      style: GoogleFonts.inter(
                                        fontSize: 14,
                                        fontWeight: FontWeight.w500,
                                        color: Theme.of(context).textTheme.bodyMedium?.color,
                                      ),
                                      overflow: TextOverflow.ellipsis,
                                    ),
                                    Text(
                                      '${model.provider} • ${model.description}',
                                      style: GoogleFonts.inter(
                                        fontSize: 12,
                                        fontWeight: FontWeight.w400,
                                        color: Colors.grey.shade600,
                                      ),
                                      overflow: TextOverflow.ellipsis,
                                    ),
                                  ],
                                ),
                              ),
                              if (model.recommended) ...[
                                const SizedBox(width: 8),
                                const Text('⭐'),
                              ],
                            ],
                          ),
                        ))
                    .toList(),
            onChanged: widget.isLoading
                ? null
                : (value) {
                    if (value != null) {
                      widget.onModelSelected(value);
                    }
                  },
          ),
        ),
        const SizedBox(height: 12),
        if (!widget.isLoading && widget.models.isNotEmpty && selectedModel.id.isNotEmpty)
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 4.0),
            child: Row(
              children: [
                Container(
                  width: 6,
                  height: 6,
                  decoration: const BoxDecoration(
                    color: Color(0xFF4DCFFF),
                    shape: BoxShape.circle,
                  ),
                ),
                const SizedBox(width: 8),
                Expanded(
                  child: Text(
                    '${selectedModel.provider}: ${selectedModel.description}',
                    style: GoogleFonts.inter(
                      fontSize: 12,
                      fontWeight: FontWeight.w400,
                      color: Colors.grey.shade600,
                    ),
                    overflow: TextOverflow.ellipsis,
                  ),
                ),
              ],
            ),
          ),
      ],
    );
  }
}
