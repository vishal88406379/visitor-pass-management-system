/**
 * QR Code Service
 * Handles QR code generation
 */

const QRCode = require('qrcode');

/**
 * Generate QR code from data
 * @param {string|Object} data - Data to encode in QR code
 * @returns {Promise<string>} Base64 encoded QR code image
 */
const generateQRCode = async (data) => {
  try {
    // Convert object to JSON string if needed
    const qrData = typeof data === 'object' ? JSON.stringify(data) : data;
    
    // Generate QR code as base64 image
    const qrCodeImage = await QRCode.toDataURL(qrData, {
      errorCorrectionLevel: 'H',
      type: 'image/png',
      quality: 0.95,
      margin: 1,
      width: 300,
    });
    
    return qrCodeImage;
  } catch (error) {
    console.error('QR code generation error:', error);
    throw new Error('Failed to generate QR code');
  }
};

/**
 * Generate QR code as buffer
 * @param {string|Object} data - Data to encode in QR code
 * @returns {Promise<Buffer>} QR code image buffer
 */
const generateQRCodeBuffer = async (data) => {
  try {
    const qrData = typeof data === 'object' ? JSON.stringify(data) : data;
    
    const buffer = await QRCode.toBuffer(qrData, {
      errorCorrectionLevel: 'H',
      type: 'png',
      quality: 0.95,
      margin: 1,
      width: 300,
    });
    
    return buffer;
  } catch (error) {
    console.error('QR code buffer generation error:', error);
    throw new Error('Failed to generate QR code buffer');
  }
};

module.exports = {
  generateQRCode,
  generateQRCodeBuffer,
};
