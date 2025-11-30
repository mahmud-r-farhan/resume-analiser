const crypto = require('crypto');

const DEDUP_CACHE = new Map();
const CACHE_TTL = 60000; // 60 seconds

module.exports = (action) => {
  return (req, res, next) => {
    try {
      // Generate dedup key from: user + action + file hash + body hash
      const userId = req.user?.id || req.ip || 'anon';
      const fileHash = req.file 
        ? crypto.createHash('sha256').update(req.file.buffer).digest('hex').slice(0, 16)
        : 'no-file';
      const bodyHash = crypto.createHash('sha256')
        .update(JSON.stringify(req.body))
        .digest('hex')
        .slice(0, 16);
      
      const dedupKey = `${action}:${userId}:${fileHash}:${bodyHash}`;
      
      const cached = DEDUP_CACHE.get(dedupKey);
      if (cached && Date.now() - cached.time < CACHE_TTL) {
        return res.status(429).json({
          error: 'Duplicate request detected',
          message: 'This exact request was processed recently. Please wait before retrying.',
          retryAfter: Math.ceil((CACHE_TTL - (Date.now() - cached.time)) / 1000)
        });
      }
      
      // Mark this request
      DEDUP_CACHE.set(dedupKey, { time: Date.now() });
      
      // Cleanup old entries every 100 requests
      if (DEDUP_CACHE.size > 1000) {
        const now = Date.now();
        for (const [key, val] of DEDUP_CACHE.entries()) {
          if (now - val.time > CACHE_TTL * 2) {
            DEDUP_CACHE.delete(key);
          }
        }
      }
      
      next();
    } catch (err) {
      next(err);
    }
  };
};
