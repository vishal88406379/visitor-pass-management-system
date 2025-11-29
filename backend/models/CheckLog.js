/**
 * CheckLog Model
 * Defines the schema for visitor check-in and check-out logs
 */

const mongoose = require('mongoose');

const checkLogSchema = new mongoose.Schema(
  {
    visitor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Visitor',
      required: [true, 'Visitor is required'],
    },
    pass: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Pass',
      required: [true, 'Pass is required'],
    },
    checkInTime: {
      type: Date,
      required: [true, 'Check-in time is required'],
      default: Date.now,
    },
    checkOutTime: {
      type: Date,
    },
    checkInBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Check-in by user is required'],
    },
    checkOutBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    location: {
      type: String,
      trim: true,
    },
    notes: {
      type: String,
      trim: true,
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
checkLogSchema.index({ visitor: 1 });
checkLogSchema.index({ pass: 1 });
checkLogSchema.index({ checkInTime: -1 });
checkLogSchema.index({ checkOutTime: 1 });
checkLogSchema.index({ createdAt: -1 });

// Compound index for finding active visitors (checked in but not checked out)
checkLogSchema.index({ checkInTime: 1, checkOutTime: 1 });

// Method to check if visitor is currently checked in
checkLogSchema.methods.isCheckedIn = function () {
  return this.checkInTime && !this.checkOutTime;
};

// Method to calculate visit duration
checkLogSchema.methods.getVisitDuration = function () {
  if (!this.checkInTime) return null;
  
  const endTime = this.checkOutTime || new Date();
  const duration = endTime - this.checkInTime;
  
  // Return duration in minutes
  return Math.floor(duration / (1000 * 60));
};

const CheckLog = mongoose.model('CheckLog', checkLogSchema);

module.exports = CheckLog;
