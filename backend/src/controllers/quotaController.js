const User = require('../models/User');
const { ensureResumeQuota } = require('../utils/security');

const checkQuota = async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    ensureResumeQuota(user);

    const isPremium = user.isPremium && (!user.premiumExpiresAt || user.premiumExpiresAt > new Date());
    const maxResumes = isPremium ? Infinity : 3;
    const remaining = Math.max(0, maxResumes - user.resumeQuota.count);
    const resetDate = new Date(user.resumeQuota.windowStart);
    resetDate.setUTCDate(resetDate.getUTCDate() + 7);

    res.status(200).json({
      success: true,
      quota: {
        count: user.resumeQuota.count,
        max: maxResumes,
        remaining,
        resetAt: resetDate,
        isPremium,
        isLimitReached: !isPremium && user.resumeQuota.count >= 3,
      },
    });
  } catch (error) {
    console.error('Quota check error:', error);
    next(error);
  }
};

module.exports = { checkQuota };

