const { verifyToken } = require('../utils/token');
const User = require('../models/User');

const requireAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization || '';
    const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7).trim() : null;
    if (!token) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const decoded = verifyToken(token);
    const user = await User.findById(decoded.userId);
    if (!user) return res.status(401).json({ error: 'Invalid authentication token' });

    req.user = { id: user._id.toString(), _id: user._id, email: user.email };
    next();
  } catch (error) {
    console.error('Auth error:', error);
    res.status(401).json({ error: 'Invalid or expired token' });
  }
};

module.exports = {
  requireAuth,
};

