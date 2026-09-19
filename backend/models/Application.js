const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema(
  {
    applicationId: {
      type: String,
      required: [true, 'Application ID is required'],
      unique: true,
      trim: true,
      index: true
    },
    citizenId: {
      type: String,
      required: [true, 'Citizen ID is required'],
      trim: true,
      index: true
    },
    schemeId: {
      type: String,
      required: [true, 'Scheme ID is required'],
      trim: true,
      index: true
    },
    applicationDate: {
      type: Date,
      default: Date.now,
      index: true
    },
    applicationStatus: {
      type: String,
      enum: ['Pending', 'Approved', 'Rejected'],
      default: 'Pending',
      index: true
    }
  },
  {
    timestamps: true
  }
);

// Helpful index to ensure efficient query of citizen applications and status counts
applicationSchema.index({ citizenId: 1, schemeId: 1 });
applicationSchema.index({ applicationStatus: 1, applicationDate: -1 });

const Application = mongoose.model('Application', applicationSchema, 'Applications');

module.exports = Application;
