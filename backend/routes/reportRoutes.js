const express = require('express');
const router = express.Router();
const {
  getReportSummary,
  getPublicStats
} = require('../controllers/reportController');
const { protect, authorize } = require('../middleware/authMiddleware');

// Public landing page stats
router.get('/stats/public', getPublicStats);

// Admin reports summary
router.get('/reports/summary', protect, authorize('admin'), getReportSummary);

module.exports = router;
