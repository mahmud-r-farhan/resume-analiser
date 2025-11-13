const mongoose = require('mongoose');

const uploadLogSchema = new mongoose.Schema({
  userIdentifier: { 
    type: String, 
    required: true, 
    index: true 
  },
  createdAt: { 
    type: Date, 
    default: Date.now, 
    index: true 
  }
});

module.exports = mongoose.models.UploadLog || mongoose.model('UploadLog', uploadLogSchema);