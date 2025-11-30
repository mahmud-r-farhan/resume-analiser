const mongoose = require('mongoose');

const resumeParseSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  // Raw markdown from LLM
  rawMarkdown: {
    type: String,
    required: true,
    maxlength: 50000
  },
  // Parsed structure
  parsed: {
    header: {
      name: String,
      title: String,
      contact: [String]
    },
    sections: [
      {
        title: String,
        items: mongoose.Schema.Types.Mixed // Flexible for different item types
      }
    ]
  },
  // Metadata
  template: {
    type: String,
    enum: ['classic', 'modern', 'functional'],
    default: 'classic'
  },
  jobTitle: String,
  fitScore: {
    type: Number,
    min: 0,
    max: 100
  },
  model: String,
  
  // PDF references
  pdfUrl: String, // URL to stored PDF (if using cloud storage)
  pdfBuffer: Buffer, // Or store buffer directly
  
  // Timestamps
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 2592000 // Auto-delete after 30 days
  }
}, { timestamps: true });

resumeParseSchema.index({ userId: 1, createdAt: -1 });
resumeParseSchema.index({ createdAt: -1 });

module.exports = mongoose.models.ResumeParse || mongoose.model('ResumeParse', resumeParseSchema);
