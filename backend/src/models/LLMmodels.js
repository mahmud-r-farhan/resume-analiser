const AI_MODELS = {
    free: [
        {
            id: 'x-ai/grok-4.1-fast:free',
            name: 'Grok 4.1 Fast',
            description: 'XAI’s optimized fast model',
            provider: 'xAI',
            contextLength: '128K tokens',
            recommended: true,
        },
        {
            id: 'mistralai/mistral-small-3.1-24b-instruct:free',
            name: 'Mistral Small 3.1 24B',
            description: 'High-quality instruction-tuned model',
            provider: 'Mistral AI',
            contextLength: '128K tokens',
            recommended: true,
        },
        {
            id: 'deepseek/deepseek-chat-v3.1:free',
            name: 'DeepSeek Chat V3.1',
            description: 'Fast and efficient model for resume analysis',
            provider: 'DeepSeek',
            contextLength: '32K tokens',
            recommended: true,
        },
        {
            id: 'meta-llama/llama-3.2-3b-instruct:free',
            name: 'Llama 3.2 3B',
            description: "Meta's latest compact model, great for quick analysis",
            provider: 'Meta',
            contextLength: '128K tokens',
            recommended: false,
        },
        {
            id: 'google/gemma-2-9b-it:free',
            name: 'Gemma 2 9B',
            description: "Google's efficient model for text generation",
            provider: 'Google',
            contextLength: '8K tokens',
            recommended: false,
        },
        {
            id: 'qwen/qwen-2-7b-instruct:free',
            name: 'Qwen 2 7B',
            description: 'Alibaba\'s multilingual model',
            provider: 'Alibaba',
            contextLength: '32K tokens',
            recommended: false,
        },
        {
            id: 'microsoft/phi-3-mini-128k-instruct:free',
            name: 'Phi-3 Mini',
            description: "Microsoft's compact yet powerful model",
            provider: 'Microsoft',
            contextLength: '128K tokens',
            recommended: false,
        },

        {
            id: 'meituan/longcat-flash-chat:free',
            name: 'LongCat Flash Chat',
            description: 'Extremely long-context flash model',
            provider: 'Meituan',
            contextLength: '1M tokens',
            recommended: false,
        },
        {
            id: 'openai/gpt-oss-20b:free',
            name: 'GPT-OSS 20B',
            description: 'Open-source GPT-class model by OpenAI',
            provider: 'OpenAI',
            contextLength: '64K tokens',
            recommended: false,
        },
        {
            id: 'tngtech/tng-r1t-chimera:free',
            name: 'TNG R1T Chimera',
            description: 'Reasoning-focused open model',
            provider: 'TNG Tech',
            contextLength: '128K tokens',
            recommended: false,
        },
        {
            id: 'z-ai/glm-4.5-air:free',
            name: 'GLM 4.5 Air',
            description: 'Lightweight high-performance model',
            provider: 'Zhipu AI',
            contextLength: '128K tokens',
            recommended: false,
        },
    ],

    premium: [
        {
            id: 'openai/gpt-5.1',
            name: 'GPT-5.1',
            description: 'Next-generation OpenAI flagship model',
            provider: 'OpenAI',
            contextLength: '1M tokens',
            recommended: true,
        },
        {
            id: 'anthropic/claude-opus-4.5',
            name: 'Claude Opus 4.5',
            description: 'Advanced reasoning and large-context capabilities',
            provider: 'Anthropic',
            contextLength: '1M tokens',
            recommended: true,
        },
        {
            id: 'google/gemini-3-pro-preview',
            name: 'Gemini 3 Pro',
            description: 'Latest multimodal intelligence from Google',
            provider: 'Google',
            contextLength: '4M tokens',
            recommended: true,
        },
        {
            id: 'mistralai/mistral-large-3.1',
            name: 'Mistral Large 3.1',
            description: 'Mistral’s strongest general-purpose model',
            provider: 'Mistral AI',
            contextLength: '256K tokens',
            recommended: false,
        },
    ],
};

// Get models available to a user based on their subscription status
const getAvailableModels = (isPremium = false) => {
    if (isPremium) {
        return [...AI_MODELS.free, ...AI_MODELS.premium];
    }
    return AI_MODELS.free;
};

// Get default model for a user
const getDefaultModel = (isPremium = false) => {
    if (isPremium) {
        const recommended = AI_MODELS.premium.find(m => m.recommended);
        return recommended ? recommended.id : AI_MODELS.premium[0].id;
    }
    const recommended = AI_MODELS.free.find(m => m.recommended);
    return recommended ? recommended.id : AI_MODELS.free[0].id;
};

// Validate if a model is available to the user
const isModelAvailable = (modelId, isPremium = false) => {
    const availableModels = getAvailableModels(isPremium);
    return availableModels.some(m => m.id === modelId);
};

module.exports = {
    AI_MODELS,
    getAvailableModels,
    getDefaultModel,
    isModelAvailable,
};
