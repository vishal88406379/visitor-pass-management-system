/**
 * Organization Model
 * Defines the schema for organizations in a multi-organization system
 */

const mongoose = require('mongoose');

const organizationSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Organization name is required'],
      unique: true,
      trim: true,
    },
    slug: {
      type: String,
      required: [true, 'Organization slug is required'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    address: {
      street: String,
      city: String,
      state: String,
      zipCode: String,
      country: String,
    },
    contact: {
      email: {
        type: String,
        lowercase: true,
        trim: true,
        match: [
          /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
          'Please provide a valid email address',
        ],
      },
      phone: {
        type: String,
        trim: true,
      },
    },
    adminUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Admin user is required'],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    settings: {
      maxVisitorsPerDay: {
        type: Number,
        default: 100,
      },
      defaultPassExpiryHours: {
        type: Number,
        default: 24,
      },
      enableEmailNotifications: {
        type: Boolean,
        default: true,
      },
      enableSmsNotifications: {
        type: Boolean,
        default: false,
      },
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt
  }
);

// Index for faster lookups
organizationSchema.index({ slug: 1 });
organizationSchema.index({ adminUser: 1 });

// Virtual for full address
organizationSchema.virtual('fullAddress').get(function () {
  const parts = [];
  if (this.address.street) parts.push(this.address.street);
  if (this.address.city) parts.push(this.address.city);
  if (this.address.state) parts.push(this.address.state);
  if (this.address.zipCode) parts.push(this.address.zipCode);
  if (this.address.country) parts.push(this.address.country);
  return parts.join(', ');
});

// Ensure virtuals are included when converting to JSON
organizationSchema.set('toJSON', {
  virtuals: true,
});

const Organization = mongoose.model('Organization', organizationSchema);

module.exports = Organization;