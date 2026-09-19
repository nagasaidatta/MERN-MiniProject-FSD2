const express = require('express');
const router = express.Router();
const {
  applyScheme,
  getApplications,
  updateApplicationStatus,
  cancelApplication,
  getBeneficiaries
} = require('../controllers/applicationController');
const { protect, authorize } = require('../middleware/authMiddleware');

// Citizen application submission
router.post('/applyScheme', protect, authorize('citizen'), applyScheme);

// Get applications (Citizen sees their own, Admin sees all)
router.get('/applications', protect, getApplications);

// Admin update application status (Approve / Reject)
router.put('/applications/:id', protect, authorize('admin'), updateApplicationStatus);

// Citizen cancel pending application
router.delete('/cancelApplication/:id', protect, cancelApplication);

// Admin view approved beneficiaries
router.get('/beneficiaries', protect, authorize('admin'), getBeneficiaries);

module.exports = router;
