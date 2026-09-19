const mongoose = require('mongoose');

const schemeSchema = new mongoose.Schema(
  {
    schemeId: {
      type: String,
      required: [true, 'Scheme ID is required'],
      unique: true,
      trim: true,
      index: true
    },
    schemeName: {
      type: String,
      required: [true, 'Scheme name is required'],
      trim: true,
      index: true
    },
    schemeCategory: {
      type: String,
      required: [true, 'Scheme category is required'],
      trim: true,
      index: true
    },
    eligibility: {
      type: String,
      required: [true, 'Eligibility criteria is required'],
      trim: true
    },
    benefitAmount: {
      type: String,
      required: [true, 'Benefit amount is required'],
      trim: true
    },
    lastDate: {
      type: String,
      required: [true, 'Last date to apply is required'],
      trim: true
    },
    schemeStatus: {
      type: String,
      enum: ['Active', 'Inactive'],
      default: 'Active',
      index: true
    }
  },
  {
    timestamps: true
  }
);

// Compound index for category filtering and status checks
schemeSchema.index({ schemeCategory: 1, schemeStatus: 1 });

const Scheme = mongoose.model('Scheme', schemeSchema, 'GovernmentSchemes');

module.exports = Scheme;
