const Application = require('../models/Application');
const Scheme = require('../models/Scheme');
const User = require('../models/User');

// Helper to enrich applications with Scheme and Citizen information
const enrichApplications = async (applications) => {
  const schemeIds = [...new Set(applications.map((app) => app.schemeId))];
  const citizenIds = [...new Set(applications.map((app) => app.citizenId))];

  const [schemes, citizens] = await Promise.all([
    Scheme.find({ schemeId: { $in: schemeIds } }).lean(),
    User.find({ userId: { $in: citizenIds } }).select('-password').lean()
  ]);

  const schemeMap = new Map(schemes.map((s) => [s.schemeId, s]));
  const citizenMap = new Map(citizens.map((c) => [c.userId, c]));

  return applications.map((app) => {
    const raw = app.toObject ? app.toObject() : app;
    return {
      ...raw,
      scheme: schemeMap.get(raw.schemeId) || null,
      citizen: citizenMap.get(raw.citizenId) || null
    };
  });
};

// @desc    Apply for a Government Scheme
// @route   POST /applyScheme
// @access  Private (Citizen)
const applyScheme = async (req, res) => {
  try {
    const { schemeId } = req.body;
    const citizenId = req.user.userId;

    if (!schemeId) {
      return res.status(400).json({
        success: false,
        message: 'Scheme ID is required to apply.'
      });
    }

    // Verify scheme exists and is active
    let scheme = await Scheme.findOne({ schemeId });
    if (!scheme && schemeId.match(/^[0-9a-fA-F]{24}$/)) {
      scheme = await Scheme.findById(schemeId);
    }

    if (!scheme) {
      return res.status(404).json({
        success: false,
        message: 'The selected Government Scheme does not exist.'
      });
    }

    if (scheme.schemeStatus !== 'Active') {
      return res.status(400).json({
        success: false,
        message: 'Applications are currently closed for this scheme.'
      });
    }

    // Check if citizen has already applied for this scheme
    const existingApp = await Application.findOne({
      citizenId,
      schemeId: scheme.schemeId
    });

    if (existingApp) {
      return res.status(400).json({
        success: false,
        message: `You have already submitted an application (${existingApp.applicationId}) for this scheme. Current Status: ${existingApp.applicationStatus}.`
      });
    }

    // Generate unique Application ID (e.g. APP-847291)
    const randomSuffix = Math.floor(100000 + Math.random() * 900000);
    const applicationId = `APP-${randomSuffix}`;

    const newApplication = await Application.create({
      applicationId,
      citizenId,
      schemeId: scheme.schemeId,
      applicationDate: new Date(),
      applicationStatus: 'Pending'
    });

    return res.status(201).json({
      success: true,
      message: 'Application submitted successfully.',
      application: {
        applicationId: newApplication.applicationId,
        citizenId: newApplication.citizenId,
        schemeId: newApplication.schemeId,
        schemeName: scheme.schemeName,
        applicationDate: newApplication.applicationDate,
        applicationStatus: newApplication.applicationStatus
      }
    });
  } catch (error) {
    console.error('Apply Scheme Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to submit application. ' + error.message
    });
  }
};

// @desc    Get applications (Citizens see only their own; Admins see all)
// @route   GET /applications
// @access  Private (Citizen / Admin)
const getApplications = async (req, res) => {
  try {
    const { status, search } = req.query;
    const query = {};

    // Citizens only see their own applications
    if (req.user.role === 'citizen') {
      query.citizenId = req.user.userId;
    }

    if (status && status !== 'All') {
      query.applicationStatus = status;
    }

    let applications = await Application.find(query).sort({ applicationDate: -1 });
    let enriched = await enrichApplications(applications);

    // Optional text search across scheme name or citizen name
    if (search && search.trim()) {
      const searchRegex = new RegExp(search.trim(), 'i');
      enriched = enriched.filter((app) => {
        const matchesId = app.applicationId && searchRegex.test(app.applicationId);
        const matchesScheme = app.scheme && searchRegex.test(app.scheme.schemeName);
        const matchesCitizen = app.citizen && (searchRegex.test(app.citizen.name) || searchRegex.test(app.citizen.email));
        return matchesId || matchesScheme || matchesCitizen;
      });
    }

    return res.status(200).json({
      success: true,
      count: enriched.length,
      applications: enriched
    });
  } catch (error) {
    console.error('Get Applications Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve applications.'
    });
  }
};

// @desc    Update application status (Approve / Reject)
// @route   PUT /applications/:id
// @access  Private (Admin only)
const updateApplicationStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { applicationStatus } = req.body;

    if (!applicationStatus || !['Pending', 'Approved', 'Rejected'].includes(applicationStatus)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status. Allowed values are 'Pending', 'Approved', or 'Rejected'."
      });
    }

    let application = await Application.findOne({ applicationId: id });
    if (!application && id.match(/^[0-9a-fA-F]{24}$/)) {
      application = await Application.findById(id);
    }

    if (!application) {
      return res.status(404).json({
        success: false,
        message: `Application with ID '${id}' not found.`
      });
    }

    application.applicationStatus = applicationStatus;
    await application.save();

    const [enriched] = await enrichApplications([application]);

    return res.status(200).json({
      success: true,
      message: `Application ${application.applicationId} has been marked as ${applicationStatus}.`,
      application: enriched
    });
  } catch (error) {
    console.error('Update Application Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to update application status.'
    });
  }
};

// @desc    Cancel a pending application
// @route   DELETE /cancelApplication/:id
// @access  Private (Citizen)
const cancelApplication = async (req, res) => {
  try {
    const { id } = req.params;
    const citizenId = req.user.userId;

    let application = await Application.findOne({ applicationId: id });
    if (!application && id.match(/^[0-9a-fA-F]{24}$/)) {
      application = await Application.findById(id);
    }

    if (!application) {
      return res.status(404).json({
        success: false,
        message: `Application with ID '${id}' not found.`
      });
    }

    // Verify ownership
    if (application.citizenId !== citizenId && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to cancel this application.'
      });
    }

    // Can only cancel if Pending
    if (application.applicationStatus !== 'Pending') {
      return res.status(400).json({
        success: false,
        message: `Cannot cancel application. Current status is already '${application.applicationStatus}'.`
      });
    }

    await Application.deleteOne({ _id: application._id });

    return res.status(200).json({
      success: true,
      message: `Application ${application.applicationId} has been successfully cancelled.`
    });
  } catch (error) {
    console.error('Cancel Application Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to cancel application.'
    });
  }
};

// @desc    Get all approved beneficiaries
// @route   GET /beneficiaries
// @access  Private (Admin only)
const getBeneficiaries = async (req, res) => {
  try {
    const approvedApps = await Application.find({ applicationStatus: 'Approved' }).sort({ updatedAt: -1 });
    const enriched = await enrichApplications(approvedApps);

    return res.status(200).json({
      success: true,
      count: enriched.length,
      beneficiaries: enriched
    });
  } catch (error) {
    console.error('Get Beneficiaries Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch beneficiary records.'
    });
  }
};

module.exports = {
  applyScheme,
  getApplications,
  updateApplicationStatus,
  cancelApplication,
  getBeneficiaries
};
