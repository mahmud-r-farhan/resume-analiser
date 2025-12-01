import { useState, useEffect } from 'react';
import { ChevronDown, Sparkles, Lock } from 'lucide-react';

export default function ModelSelector({ value, onChange, isPremium }) {
    const [models, setModels] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchModels();
    }, [isPremium]);

    const fetchModels = async () => {
        try {
            const token = localStorage.getItem('auth-storage')
                ? JSON.parse(localStorage.getItem('auth-storage')).state?.token
                : null;

            const headers = {};
            if (token) {
                headers.Authorization = `Bearer ${token}`;
            }

            const res = await fetch(`${import.meta.env.VITE_API_ENDPOINT}/models`, {
                headers
            });

            // If endpoint fails (e.g. 404), fall back to hardcoded list
            if (!res.ok) {
                throw new Error('Failed to fetch models');
            }

            const data = await res.json();
            if (data.success) {
                setModels(data.models);
                // Only set default if no value selected yet
                if (!value && data.defaultModel) {
                    onChange(data.defaultModel);
                }
            }
        } catch (error) {
            console.warn('Using fallback models due to API error:', error);
            // Fallback models if API fails
            const fallbackModels = [
                { id: 'deepseek/deepseek-chat-v3.1:free', name: 'DeepSeek Chat V3.1', provider: 'DeepSeek', description: 'Fast & Free' },
                { id: 'meta-llama/llama-3.2-3b-instruct:free', name: 'Llama 3.2 3B', provider: 'Meta', description: 'Compact & Fast' },
            ];
            setModels(fallbackModels);
            if (!value) onChange(fallbackModels[0].id);
        } finally {
            setLoading(false);
        }
    };

    const selectedModel = models.find(m => m.id === value);

    return (
        <div className="relative group">
            <label className="block text-xs font-medium text-gray-400 mb-1.5 uppercase tracking-wider">
                AI Model
            </label>
            <div className="relative">
                <select
                    value={value || ''}
                    onChange={(e) => onChange(e.target.value)}
                    className="w-full bg-[#1A0F3D]/50 border border-white/10 rounded-xl px-4 py-3 pr-10 text-white appearance-none cursor-pointer hover:bg-white/5 hover:border-white/20 transition-all focus:outline-none focus:ring-2 focus:ring-[#4DCFFF]/50"
                    disabled={loading}
                >
                    {loading ? (
                        <option>Loading models...</option>
                    ) : (
                        models.map((model) => (
                            <option key={model.id} value={model.id} className="bg-[#0f1b43] text-white py-2">
                                {model.name} {model.recommended ? '⭐' : ''}
                            </option>
                        ))
                    )}
                </select>

                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none flex items-center gap-2">
                    {isPremium && <Sparkles className="w-4 h-4 text-yellow-400" />}
                    <ChevronDown className="w-4 h-4 text-gray-400" />
                </div>
            </div>

            {!loading && selectedModel && (
                <div className="mt-2 flex items-start gap-2 text-xs text-gray-400 px-1">
                    <div className="min-w-[4px] h-[4px] rounded-full bg-[#4DCFFF] mt-1.5" />
                    <p>
                        <span className="text-gray-300 font-medium">{selectedModel.provider}:</span> {selectedModel.description}
                    </p>
                </div>
            )}
        </div>
    );
}
