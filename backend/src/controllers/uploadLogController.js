const UploadLog = require('../models/UploadLog');

// Controller to fetch all upload logs
exports.getUploadLogs = async (req, res) => {
  try {
    const uploadLogs = await UploadLog.find();
    res.json(uploadLogs);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};