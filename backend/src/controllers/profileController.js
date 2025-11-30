const User = require('../models/User');
const Analysis = require('../models/Analysis');
const ResumeParse = require('../models/ResumeParse');
const { ensureResumeQuota } = require('../utils/security');

// Get user profile
const getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) return res.status(404).json({ error: 'User not found' });

    ensureResumeQuota(user);

    res.json({
      success: true,
      user: {
        id: user._id,
        username: user.username,
        fullName: user.fullName,
        email: user.email,
        emailVerified: user.emailVerified,
        isPremium: user.isPremium,
        premiumExpiresAt: user.premiumExpiresAt,
        resumeQuota: user.resumeQuota,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    console.error('Get profile error:', error);
    next(error);
  }
};

// Update user profile
const updateProfile = async (req, res, next) => {
  try {
    const { fullName, username } = req.body;

    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ error: 'User not found' });

    // Validate username uniqueness if changed
    if (username && username !== user.username) {
      const existing = await User.findOne({ username });
      if (existing) return res.status(409).json({ error: 'Username already taken' });
      user.username = username;
    }

    if (fullName) user.fullName = fullName;

    await user.save();

    res.json({
      success: true,
      message: 'Profile updated successfully',
      user: {
        id: user._id,
        username: user.username,
        fullName: user.fullName,
        email: user.email,
      },
    });
  } catch (error) {
    console.error('Update profile error:', error);
    next(error);
  }
};

// Get user analyses
const getUserAnalyses = async (req, res, next) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;

    const analyses = await Analysis.find({ userId: req.user.id })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Analysis.countDocuments({ userId: req.user.id });

    res.json({
      success: true,
      data: analyses,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Get analyses error:', error);
    next(error);
  }
};

// Get user optimizations (ResumeParse)
const getUserOptimizations = async (req, res, next) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;

    const optimizations = await ResumeParse.find({ userId: req.user.id })
      .select('-pdfBuffer') // Don't send large PDF buffers
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await ResumeParse.countDocuments({ userId: req.user.id });

    res.json({
      success: true,
      data: optimizations,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Get optimizations error:', error);
    next(error);
  }
};

// Get download history (optimizations with download timestamps)
const getDownloadHistory = async (req, res, next) => {
  try {
    const { page = 1, limit = 15 } = req.query;
    const skip = (page - 1) * limit;

    const downloads = await ResumeParse.find({ userId: req.user.id })
      .select('template jobTitle fitScore model downloadCount createdAt')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await ResumeParse.countDocuments({ userId: req.user.id });

    res.json({
      success: true,
      data: downloads.map((item) => ({
        id: item._id,
        template: item.template,
        jobTitle: item.jobTitle,
        fitScore: item.fitScore,
        model: item.model,
        downloadCount: item.downloadCount,
        generatedAt: item.createdAt,
      })),
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Get download history error:', error);
    next(error);
  }
};

// Delete analysis
const deleteAnalysis = async (req, res, next) => {
  try {
    const { analysisId } = req.params;

    const analysis = await Analysis.findById(analysisId);
    if (!analysis) return res.status(404).json({ error: 'Analysis not found' });

    if (analysis.userId && analysis.userId.toString() !== req.user.id) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    await Analysis.deleteOne({ _id: analysisId });

    res.json({ success: true, message: 'Analysis deleted' });
  } catch (error) {
    console.error('Delete analysis error:', error);
    next(error);
  }
};

// Delete optimization
const deleteOptimization = async (req, res, next) => {
  try {
    const { optimizationId } = req.params;

    const optimization = await ResumeParse.findById(optimizationId);
    if (!optimization) return res.status(404).json({ error: 'Optimization not found' });

    if (optimization.userId.toString() !== req.user.id) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    await ResumeParse.deleteOne({ _id: optimizationId });

    res.json({ success: true, message: 'Optimization deleted' });
  } catch (error) {
    console.error('Delete optimization error:', error);
    next(error);
  }
};

// Download resume PDF
const downloadResume = async (req, res, next) => {
  try {
    const { resumeId } = req.params;

    const resume = await ResumeParse.findById(resumeId);
    if (!resume) return res.status(404).json({ error: 'Resume not found' });

    if (resume.userId.toString() !== req.user.id) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    // Increment download count
    resume.downloadCount = (resume.downloadCount || 0) + 1;
    await resume.save();

    // Set headers for PDF download
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="resume_${resume.template}_${Date.now()}.pdf"`
    );
    res.setHeader('Content-Length', resume.pdfBuffer.length);

    res.send(resume.pdfBuffer);
  } catch (error) {
    console.error('Download resume error:', error);
    next(error);
  }
};

// Get profile stats
const getProfileStats = async (req, res, next) => {
  try {
    const analysisCount = await Analysis.countDocuments({ userId: req.user.id });
    const optimizationCount = await ResumeParse.countDocuments({ userId: req.user.id });
    const totalDownloads = await ResumeParse.aggregate([
      { $match: { userId: req.user._id } },
      { $group: { _id: null, total: { $sum: '$downloadCount' } } },
    ]);

    const user = await User.findById(req.user.id);
    ensureResumeQuota(user);

    res.json({
      success: true,
      stats: {
        totalAnalyses: analysisCount,
        totalOptimizations: optimizationCount,
        totalDownloads: totalDownloads[0]?.total || 0,
        resumeQuota: {
          used: user.resumeQuota.count,
          remaining: user.isPremium ? 'Unlimited' : 3 - user.resumeQuota.count,
          resetDate: new Date(user.resumeQuota.windowStart).toISOString().split('T')[0],
        },
        accountType: user.isPremium ? 'Premium' : 'Free',
        memberSince: user.createdAt.toLocaleDateString(),
      },
    });
  } catch (error) {
    console.error('Get stats error:', error);
    next(error);
  }
};

module.exports = {
  getProfile,
  updateProfile,
  getUserAnalyses,
  getUserOptimizations,
  getDownloadHistory,
  deleteAnalysis,
  deleteOptimization,
  downloadResume,
  getProfileStats,
};
