const bcrypt = require('bcryptjs');
const crypto = require('crypto');

const OTP_LENGTH = 6;
const OTP_EXPIRY_MINUTES = 10;
const SALT_ROUNDS = 10;

const generateOtp = () => {
  const min = 10 ** (OTP_LENGTH - 1);
  const max = 10 ** OTP_LENGTH - 1;
  return `${crypto.randomInt(min, max + 1)}`;
};

const hashValue = async (value) => bcrypt.hash(value, SALT_ROUNDS);

const compareHash = async (value, hash) => bcrypt.compare(value, hash);

const createOtpPayload = async () => {
  const otp = generateOtp();
  const codeHash = await hashValue(otp);
  const expiresAt = new Date(Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000);
  return { otp, payload: { codeHash, expiresAt } };
};

const hashPassword = (password) => bcrypt.hash(password, SALT_ROUNDS);

const startOfCurrentWeek = () => {
  const now = new Date();
  const start = new Date(now);
  const day = start.getUTCDay();
  const diff = start.getUTCDate() - day + (day === 0 ? -6 : 1); // Monday as start
  start.setUTCDate(diff);
  start.setUTCHours(0, 0, 0, 0);
  return start;
};

const ensureResumeQuota = (user) => {
  if (!user) return;
  const now = new Date();
  const windowStart = user.resumeQuota?.windowStart
    ? new Date(user.resumeQuota.windowStart)
    : startOfCurrentWeek();

  if (!user.resumeQuota || now - windowStart >= 7 * 24 * 60 * 60 * 1000) {
    user.resumeQuota = {
      count: 0,
      windowStart: startOfCurrentWeek(),
    };
  }
};

module.exports = {
  generateOtp,
  createOtpPayload,
  hashValue,
  compareHash,
  hashPassword,
  startOfCurrentWeek,
  ensureResumeQuota,
  OTP_EXPIRY_MINUTES,
};

