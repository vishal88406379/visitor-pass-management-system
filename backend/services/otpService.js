/**
 * OTP Service
 * Handles OTP generation and verification
 */

const crypto = require('crypto');

// In-memory store for OTPs (in production, use Redis or database)
const otpStore = new Map();

/**
 * Generate a 6-digit OTP
 * @returns {string} 6-digit OTP
 */
const generateOTP = () => {
  return crypto.randomInt(100000, 999999).toString();
};

/**
 * Store OTP for a user
 * @param {string} email - User's email
 * @param {string} otp - Generated OTP
 * @param {number} expiryMinutes - Expiry time in minutes (default: 10)
 */
const storeOTP = (email, otp, expiryMinutes = 10) => {
  const expiry = Date.now() + (expiryMinutes * 60 * 1000);
  otpStore.set(email, { otp, expiry });
};

/**
 * Verify OTP for a user
 * @param {string} email - User's email
 * @param {string} otp - OTP to verify
 * @returns {boolean} Whether OTP is valid
 */
const verifyOTP = (email, otp) => {
  const record = otpStore.get(email);
  
  if (!record) {
    return false;
  }
  
  // Check if OTP has expired
  if (Date.now() > record.expiry) {
    otpStore.delete(email);
    return false;
  }
  
  // Check if OTP matches
  if (record.otp !== otp) {
    return false;
  }
  
  // Remove used OTP
  otpStore.delete(email);
  return true;
};

/**
 * Send OTP via email (mock implementation)
 * @param {string} email - Recipient email
 * @param {string} otp - OTP to send
 */
const sendOTPEmail = async (email, otp) => {
  // In a real implementation, you would use nodemailer or similar
  console.log(`OTP for ${email}: ${otp}`);
  
  // Mock delay to simulate email sending
  await new Promise(resolve => setTimeout(resolve, 100));
  
  return true;
};

/**
 * Clear expired OTPs
 */
const clearExpiredOTPs = () => {
  const now = Date.now();
  for (const [email, record] of otpStore.entries()) {
    if (now > record.expiry) {
      otpStore.delete(email);
    }
  }
};

// Periodically clean up expired OTPs
setInterval(clearExpiredOTPs, 60 * 1000); // Every minute

module.exports = {
  generateOTP,
  storeOTP,
  verifyOTP,
  sendOTPEmail
};