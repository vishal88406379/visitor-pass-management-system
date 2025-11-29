/**
 * Pass Model
 * Defines the schema for visitor passes with QR codes
 */

const mongoose = require('mongoose');

const passSchema = new mongoose.Schema(
  {
    passNumber: {
      type: String,
      required: [true, 'Pass number is required'],
      unique: true,
      trim: true,
    },
    visitor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Visitor',
      required: [true, 'Visitor is required'],
    },
    appointment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Appointment',
    },
    qrCode: {
      type: String, // QR code data (pass number or JSON string)
    },
    qrCodeImage: {
      type: String, // Base64 encoded image or file path
    },
    validFrom: {
      type: Date,
      required: [true, 'Valid from date is required'],
    },
    validUntil: {
      type: Date,
      required: [true, 'Valid until date is required'],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    issuedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Issued by user is required'],
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

// Indexes for faster queries
passSchema.index({ passNumber: 1 });
passSchema.index({ visitor: 1 });
passSchema.index({ appointment: 1 });
passSchema.index({ isActive: 1 });
passSchema.index({ validFrom: 1, validUntil: 1 });

// Method to check if pass is currently valid
passSchema.methods.isValid = function () {
  const now = new Date();
  return (
    this.isActive &&
    this.validFrom <= now &&
    this.validUntil >= now
  );
};

const Pass = mongoose.model('Pass', passSchema);

module.exports = Pass;
