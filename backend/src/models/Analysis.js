const mongoose = require('mongoose');

const analysisSchema = new mongoose.Schema({
  userId: {
    type: String,
    index: true
  },
  cvFileName: {
    type: String,
    required: true
  },
  jobDescription: {
    type: String,
    required: true,
    maxlength: 10000
  },
  model: {
    type: String,
    required: true
  },
  analysis: {
    type: String,
    required: true
  },
  fitScore: {
    type: Number,
    min: 0,
    max: 100
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 2592000 // Auto-delete after 30 days
  }
}, {
  timestamps: true
});

// Index for efficient queries
analysisSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Analysis', analysisSchema);