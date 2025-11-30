const mongoose = require('mongoose');

const optimizedResumeSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true 
  },
  markdown: {
    type: String,
    required: true,
    maxlength: 50000
  },
  template: {
    type: String,
    enum: ['classic', 'modern', 'functional'],
    default: 'classic'
  },
  jobTitle: {
    type: String,
    maxlength: 200
  },
  fitScore: {
    type: Number,
    min: 0,
    max: 100
  },
  model: {
    type: String,
    required: true
  },
  downloadCount: {
    type: Number,
    default: 0
  },
  createdAt: { 
    type: Date, 
    default: Date.now,
    index: true,
    expires: 7776000 // 90 days auto-delete
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

optimizedResumeSchema.index({ userId: 1, createdAt: -1 });
optimizedResumeSchema.index({ createdAt: -1 });

module.exports = mongoose.models.OptimizedResume || mongoose.model('OptimizedResume', optimizedResumeSchema);
