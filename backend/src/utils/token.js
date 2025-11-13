const jwt = require('jsonwebtoken');

const TOKEN_EXPIRY = '7d';
const RESET_TOKEN_EXPIRY = '15m';

const signToken = (payload, options = {}) => {
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET not configured');
  }
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: TOKEN_EXPIRY,
    ...options,
  });
};

const signResetToken = (payload) => {
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET not configured');
  }
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: RESET_TOKEN_EXPIRY });
};

const verifyToken = (token) => {
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET not configured');
  }
  return jwt.verify(token, process.env.JWT_SECRET);
};

module.exports = {
  signToken,
  signResetToken,
  verifyToken,
};

