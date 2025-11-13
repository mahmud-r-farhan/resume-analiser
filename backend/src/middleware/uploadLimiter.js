const UploadLog = require('../models/UploadLog');
const crypto = require('crypto');

function getAnonIdentifier(req) {
  const ip = req.ip || req.connection?.remoteAddress || 'unknown_ip';
  const ua = req.get('User-Agent') || 'unknown_ua';
  return crypto.createHash('sha256').update(`${ip}|${ua}`).digest('hex');
}

module.exports = function uploadLimiter(maxUploads = 120, windowMs = 24 * 60 * 60 * 1000) {
  return async function (req, res, next) {
    try {
      const userId = req.user?._id ? String(req.user._id) : null;
      const userIdentifier = userId || getAnonIdentifier(req);

      const since = new Date(Date.now() - windowMs);
      const count = await UploadLog.countDocuments({ userIdentifier, createdAt: { $gte: since } });

      if (count >= maxUploads) {
        return res.status(429).json({ error: 'Upload limit reached', message: `You can upload up to ${maxUploads} CVs per 24 hours.` });
      }

      req._uploadUserIdentifier = userIdentifier;
      next();
    } catch (err) {
      next(err);
    }
  };
};