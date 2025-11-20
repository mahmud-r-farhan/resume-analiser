const User = require('../models/User');

// Controller to get the user count
exports.getUserCount = async (req, res) => {
  try {
    const userCount = await User.countDocuments();
    res.status(200).json({ userCount });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch user count', error: error.message });
  }
};