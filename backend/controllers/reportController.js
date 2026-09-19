const Application = require('../models/Application');
const Scheme = require('../models/Scheme');
const User = require('../models/User');

// @desc    Get aggregated report metrics using MongoDB aggregation
// @route   GET /reports/summary
// @access  Private (Admin only)
const getReportSummary = async (req, res) => {
  try {
    // 1. Total Counts
    const [totalUsers, totalCitizens, totalSchemes, totalApplications] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ role: 'citizen' }),
      Scheme.countDocuments(),
      Application.countDocuments()
    ]);

    // 2. Application Status Breakdown via MongoDB Aggregation
    const statusBreakdownRaw = await Application.aggregate([
      {
        $group: {
          _id: '$applicationStatus',
          count: { $sum: 1 }
        }
      }
    ]);

    const statusCounts = {
      Pending: 0,
      Approved: 0,
      Rejected: 0
    };

    statusBreakdownRaw.forEach((item) => {
      if (statusCounts[item._id] !== undefined) {
        statusCounts[item._id] = item.count;
      }
    });

    // 3. Applications By Scheme via Aggregation
    const applicationsBySchemeRaw = await Application.aggregate([
      {
        $group: {
          _id: '$schemeId',
          totalApplications: { $sum: 1 },
          approved: {
            $sum: { $cond: [{ $eq: ['$applicationStatus', 'Approved'] }, 1, 0] }
          },
          pending: {
            $sum: { $cond: [{ $eq: ['$applicationStatus', 'Pending'] }, 1, 0] }
          },
          rejected: {
            $sum: { $cond: [{ $eq: ['$applicationStatus', 'Rejected'] }, 1, 0] }
          }
        }
      },
      { $sort: { totalApplications: -1 } },
      { $limit: 10 }
    ]);

    // Enrich with scheme names
    const schemeIds = applicationsBySchemeRaw.map((item) => item._id);
    const schemes = await Scheme.find({ schemeId: { $in: schemeIds } }).lean();
    const schemeMap = new Map(schemes.map((s) => [s.schemeId, s]));

    const applicationsByScheme = applicationsBySchemeRaw.map((item) => {
      const s = schemeMap.get(item._id);
      return {
        schemeId: item._id,
        schemeName: s ? s.schemeName : item._id,
        category: s ? s.schemeCategory : 'General',
        totalApplications: item.totalApplications,
        approved: item.approved,
        pending: item.pending,
        rejected: item.rejected
      };
    });

    // 4. Applications By Category
    const categoryCountsMap = {};
    for (const item of applicationsByScheme) {
      categoryCountsMap[item.category] = (categoryCountsMap[item.category] || 0) + item.totalApplications;
    }

    const applicationsByCategory = Object.entries(categoryCountsMap).map(([category, count]) => ({
      category,
      count
    }));

    return res.status(200).json({
      success: true,
      summary: {
        totalUsers,
        totalCitizens,
        totalSchemes,
        totalApplications,
        statusCounts,
        applicationsByScheme,
        applicationsByCategory
      }
    });
  } catch (error) {
    console.error('Report Summary Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to generate report summary.'
    });
  }
};

// @desc    Get public metrics for landing page
// @route   GET /stats/public
// @access  Public
const getPublicStats = async (req, res) => {
  try {
    const [availableSchemes, applicationsSubmitted, applicationsApproved, citizensServed] = await Promise.all([
      Scheme.countDocuments({ schemeStatus: 'Active' }),
      Application.countDocuments(),
      Application.countDocuments({ applicationStatus: 'Approved' }),
      User.countDocuments({ role: 'citizen' })
    ]);

    return res.status(200).json({
      success: true,
      stats: {
        availableSchemes,
        applicationsSubmitted,
        applicationsApproved,
        citizensServed
      }
    });
  } catch (error) {
    console.error('Public Stats Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve public statistics.'
    });
  }
};

module.exports = {
  getReportSummary,
  getPublicStats
};
