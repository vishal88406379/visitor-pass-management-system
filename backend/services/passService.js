/**
 * Pass Service
 * Handles visitor pass generation and management
 */

const Pass = require('../models/Pass');
const { generateQRCode } = require('./qrService');

/**
 * Generate unique pass number
 * @returns {string} Unique pass number
 */
const generatePassNumber = () => {
  const prefix = 'VP';
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `${prefix}-${timestamp}-${random}`;
};

/**
 * Create a new visitor pass
 * @param {Object} passData - Pass data
 * @returns {Promise<Object>} Created pass
 */
const createPass = async (passData) => {
  try {
    const { visitor, appointment, issuedBy, validFrom, validUntil } = passData;
    
    // Generate unique pass number
    const passNumber = generatePassNumber();
    
    // Generate QR code with pass number
    const qrCodeImage = await generateQRCode(passNumber);
    
    // Create pass
    const pass = await Pass.create({
      passNumber,
      visitor,
      appointment,
      qrCode: passNumber,
      qrCodeImage,
      validFrom: validFrom || new Date(),
      validUntil: validUntil || new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours default
      issuedBy,
      isActive: true,
    });
    
    return pass;
  } catch (error) {
    console.error('Pass creation error:', error);
    throw error;
  }
};

/**
 * Verify pass by pass number
 * @param {string} passNumber - Pass number to verify
 * @returns {Promise<Object>} Pass details if valid
 */
const verifyPass = async (passNumber) => {
  try {
    const pass = await Pass.findOne({ passNumber })
      .populate('visitor')
      .populate('appointment')
      .populate('issuedBy', 'firstName lastName email');
    
    if (!pass) {
      throw new Error('Pass not found');
    }
    
    if (!pass.isValid()) {
      throw new Error('Pass is expired or inactive');
    }
    
    return pass;
  } catch (error) {
    throw error;
  }
};

module.exports = {
  generatePassNumber,
  createPass,
  verifyPass,
};
