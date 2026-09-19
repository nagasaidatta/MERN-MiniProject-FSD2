const Scheme = require('../models/Scheme');

// @desc    Get all schemes (with optional search & category filter)
// @route   GET /schemes
// @access  Public
const getSchemes = async (req, res) => {
  try {
    const { category, status, search } = req.query;
    const query = {};

    if (category && category !== 'All') {
      query.schemeCategory = category;
    }

    if (status && status !== 'All') {
      query.schemeStatus = status;
    }

    if (search && search.trim()) {
      const searchRegex = new RegExp(search.trim(), 'i');
      query.$or = [
        { schemeName: searchRegex },
        { schemeCategory: searchRegex },
        { eligibility: searchRegex },
        { schemeId: searchRegex }
      ];
    }

    const schemes = await Scheme.find(query).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: schemes.length,
      schemes
    });
  } catch (error) {
    console.error('Get Schemes Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve schemes.'
    });
  }
};

// @desc    Get single scheme by schemeId or MongoDB _id
// @route   GET /schemes/:id
// @access  Public
const getSchemeById = async (req, res) => {
  try {
    const { id } = req.params;

    // Search by schemeId first, or fallback to _id if valid ObjectId
    let scheme = await Scheme.findOne({ schemeId: id });
    if (!scheme && id.match(/^[0-9a-fA-F]{24}$/)) {
      scheme = await Scheme.findById(id);
    }

    if (!scheme) {
      return res.status(404).json({
        success: false,
        message: `Scheme with ID '${id}' not found.`
      });
    }

    return res.status(200).json({
      success: true,
      scheme
    });
  } catch (error) {
    console.error('Get Scheme By ID Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve scheme details.'
    });
  }
};

// @desc    Create a new Government Scheme
// @route   POST /schemes
// @access  Private (Admin only)
const createScheme = async (req, res) => {
  try {
    const {
      schemeId,
      schemeName,
      schemeCategory,
      eligibility,
      benefitAmount,
      lastDate,
      schemeStatus
    } = req.body;

    if (!schemeName || !schemeCategory || !eligibility || !benefitAmount || !lastDate) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required scheme details: name, category, eligibility, benefit amount, and last date.'
      });
    }

    // Auto-generate schemeId if not provided (e.g. SCH-512)
    const finalSchemeId = schemeId && schemeId.trim()
      ? schemeId.trim()
      : `SCH-${Math.floor(100 + Math.random() * 900)}`;

    const existingScheme = await Scheme.findOne({ schemeId: finalSchemeId });
    if (existingScheme) {
      return res.status(400).json({
        success: false,
        message: `Scheme ID '${finalSchemeId}' already exists. Please provide a unique ID.`
      });
    }

    const newScheme = await Scheme.create({
      schemeId: finalSchemeId,
      schemeName: schemeName.trim(),
      schemeCategory: schemeCategory.trim(),
      eligibility: eligibility.trim(),
      benefitAmount: benefitAmount.trim(),
      lastDate: lastDate.trim(),
      schemeStatus: schemeStatus || 'Active'
    });

    return res.status(201).json({
      success: true,
      message: 'Government Scheme created successfully.',
      scheme: newScheme
    });
  } catch (error) {
    console.error('Create Scheme Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to create scheme. ' + error.message
    });
  }
};

// @desc    Update an existing Government Scheme
// @route   PUT /schemes/:id
// @access  Private (Admin only)
const updateScheme = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      schemeName,
      schemeCategory,
      eligibility,
      benefitAmount,
      lastDate,
      schemeStatus
    } = req.body;

    let scheme = await Scheme.findOne({ schemeId: id });
    if (!scheme && id.match(/^[0-9a-fA-F]{24}$/)) {
      scheme = await Scheme.findById(id);
    }

    if (!scheme) {
      return res.status(404).json({
        success: false,
        message: `Scheme with ID '${id}' not found.`
      });
    }

    // Update fields if provided
    if (schemeName !== undefined) scheme.schemeName = schemeName.trim();
    if (schemeCategory !== undefined) scheme.schemeCategory = schemeCategory.trim();
    if (eligibility !== undefined) scheme.eligibility = eligibility.trim();
    if (benefitAmount !== undefined) scheme.benefitAmount = benefitAmount.trim();
    if (lastDate !== undefined) scheme.lastDate = lastDate.trim();
    if (schemeStatus !== undefined) scheme.schemeStatus = schemeStatus;

    await scheme.save();

    return res.status(200).json({
      success: true,
      message: 'Government Scheme updated successfully.',
      scheme
    });
  } catch (error) {
    console.error('Update Scheme Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to update scheme.'
    });
  }
};

// @desc    Delete a Government Scheme
// @route   DELETE /schemes/:id
// @access  Private (Admin only)
const deleteScheme = async (req, res) => {
  try {
    const { id } = req.params;

    let result = await Scheme.deleteOne({ schemeId: id });
    if (result.deletedCount === 0 && id.match(/^[0-9a-fA-F]{24}$/)) {
      result = await Scheme.deleteOne({ _id: id });
    }

    if (result.deletedCount === 0) {
      return res.status(404).json({
        success: false,
        message: `Scheme with ID '${id}' not found.`
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Government Scheme deleted successfully.'
    });
  } catch (error) {
    console.error('Delete Scheme Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to delete scheme.'
    });
  }
};

module.exports = {
  getSchemes,
  getSchemeById,
  createScheme,
  updateScheme,
  deleteScheme
};
