const UploadLog = require('../models/UploadLog');
const crypto = require('crypto');

function getAnonIdentifier(req) {
  const ip = req.ip || req.connection?.remoteAddress || 'unknown_ip';
  const ua = req.get('User-Agent') || 'unknown_ua';
  // hash IP + UA so it's not stored in plaintext
  return crypto.createHash('sha256').update(`${ip}|${ua}`).digest('hex');
}

// MaxUpload :)
module.exports = function uploadLimiter(maxUploads = 120, windowMs = 24 * 60 * 60 * 1000) {
  return async function (req, res, next) {
    try {
      // Identify user (if authenticated) or fallback to anonymous fingerprint
      const userId = req.user && req.user._id ? String(req.user._id) : null;
      const userIdentifier = userId || getAnonIdentifier(req);

      // Count uploads in the last 24h
      const since = new Date(Date.now() - windowMs);
      const count = await UploadLog.countDocuments({
        userIdentifier,
        createdAt: { $gte: since }
      });

      if (count >= maxUploads) {
        return res.status(429).json({
          error: 'Upload limit reached',
          message: `You can upload up to ${maxUploads} CVs per 24 hours.`
        });
      }

      // Store identifier for use after successful upload
      req._uploadUserIdentifier = userIdentifier;
      next();
    } catch (err) {
      next(err);
    }
  };
};