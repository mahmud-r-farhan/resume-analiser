const express = require("express");
const router = express.Router();

const uploadLogController = require("../controllers/uploadLogController");
const userController = require("../controllers/userController");
const analysisPublicController = require("../controllers/analysisPublicController");

//  public routes
router.get("/uploadlogs", uploadLogController.getUploadLogs);
router.get("/usercount", userController.getUserCount);

//  Public route to get all analyses
router.get("/analyses", analysisPublicController.getAllAnalyses);

// Public route to get only the count
router.get("/analyses/count", analysisPublicController.getAnalysisCount);

module.exports = router;