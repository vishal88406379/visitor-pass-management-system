/**
 * Appointment Model
 * Defines the schema for visitor appointments
 */

const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema(
  {
    visitor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Visitor',
      required: [true, 'Visitor is required'],
    },
    host: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Host is required'],
    },
    scheduledDate: {
      type: Date,
      required: [true, 'Scheduled date is required'],
    },
    scheduledTime: {
      type: String,
      required: [true, 'Scheduled time is required'],
    },
    purpose: {
      type: String,
      required: [true, 'Purpose of visit is required'],
      trim: true,
    },
    status: {
      type: String,
      enum: {
        values: ['pending', 'approved', 'rejected', 'cancelled', 'completed'],
        message: '{VALUE} is not a valid status',
      },
      default: 'pending',
    },
    location: {
      type: String,
      trim: true,
    },
    notes: {
      type: String,
      trim: true,
    },
    approvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    approvedAt: {
      type: Date,
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
appointmentSchema.index({ visitor: 1 });
appointmentSchema.index({ host: 1 });
appointmentSchema.index({ status: 1 });
appointmentSchema.index({ scheduledDate: 1 });
appointmentSchema.index({ createdAt: -1 });

// Compound index for host and status queries
appointmentSchema.index({ host: 1, status: 1 });

const Appointment = mongoose.model('Appointment', appointmentSchema);

module.exports = Appointment;
