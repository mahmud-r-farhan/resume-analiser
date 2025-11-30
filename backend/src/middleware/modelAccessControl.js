const { isModelAvailable } = require('../models/LLMmodels');

/**
 * Middleware to validate that the user has access to the selected model
 * based on their premium status
 */
const validateModelAccess = async (req, res, next) => {
    try {
        const { model } = req.body;

        if (!model) {
            return res.status(400).json({
                error: 'Model selection required',
                message: 'Please select an AI model for analysis'
            });
        }

        // Determine if user is premium
        let isPremium = false;
        if (req.user) {
            const User = require('../models/User');
            const user = await User.findById(req.user.id);
            if (user) {
                isPremium = user.isPremium && (!user.premiumExpiresAt || user.premiumExpiresAt > new Date());
            }
        }

        // Validate model access
        if (!isModelAvailable(model, isPremium)) {
            return res.status(403).json({
                error: 'Model access denied',
                message: isPremium
                    ? 'Selected model is not available'
                    : 'This model requires a premium subscription. Please upgrade or select a free model.',
                isPremium,
                modelRequested: model
            });
        }

        next();
    } catch (error) {
        console.error(' Model validation error:', error);
        next(error);
    }
};

module.exports = { validateModelAccess };
