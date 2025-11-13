const mongoose = require('mongoose');

const otpSchema = new mongoose.Schema(
  {
    codeHash: String,
    expiresAt: Date,
  },
  { _id: false },
);

const resumeQuotaSchema = new mongoose.Schema(
  {
    count: { type: Number, default: 0 },
    windowStart: { type: Date, default: Date.now },
  },
  { _id: false },
);

const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true, trim: true },
    fullName: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true },
    emailVerified: { type: Boolean, default: false },
    emailOtp: otpSchema,
    resetOtp: otpSchema,
    resumeQuota: resumeQuotaSchema,
    isPremium: { type: Boolean, default: false },
    premiumExpiresAt: { type: Date },
  },
  { timestamps: true },
);

userSchema.index({ email: 1 });
userSchema.index({ username: 1 });

module.exports = mongoose.models.User || mongoose.model('User', userSchema);