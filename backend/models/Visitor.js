/**
 * Visitor Model
 * Defines the schema for visitors to the organization
 */

const mongoose = require('mongoose');

const visitorSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, 'First name is required'],
      trim: true,
    },
    lastName: {
      type: String,
      required: [true, 'Last name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      lowercase: true,
      trim: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        'Please provide a valid email address',
      ],
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
      trim: true,
    },
    company: {
      type: String,
      trim: true,
    },
    photo: {
      type: String, // File path or URL
    },
    idType: {
      type: String,
      enum: {
        values: ['passport', 'driverLicense', 'nationalId'],
        message: '{VALUE} is not a valid ID type',
      },
    },
    idNumber: {
      type: String,
      trim: true,
    },
    purpose: {
      type: String,
      trim: true,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    otp: {
      type: String,
      select: false, // Don't return OTP in queries
    },
    otpExpires: {
      type: Date,
      select: false, // Don't return OTP expiration in queries
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    organization: {
      type: String,
      trim: true,
    },
    organizationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Organization',
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for faster searches
visitorSchema.index({ email: 1 });
visitorSchema.index({ phone: 1 });
visitorSchema.index({ firstName: 1, lastName: 1 });
visitorSchema.index({ createdAt: -1 });

// Virtual for full name
visitorSchema.virtual('fullName').get(function () {
  return `${this.firstName} ${this.lastName}`;
});

// Ensure virtuals are included when converting to JSON
visitorSchema.set('toJSON', { virtuals: true });

const Visitor = mongoose.model('Visitor', visitorSchema);

module.exports = Visitor;
