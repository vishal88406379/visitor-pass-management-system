/**
 * PDF Service
 * Handles PDF badge generation
 */

const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

/**
 * Generate PDF badge for visitor pass
 * @param {Object} passData - Pass data including visitor, QR code, etc.
 * @returns {Promise<Buffer>} PDF buffer
 */
const generateBadgePDF = async (passData) => {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({
        size: [252, 378], // 3.5" x 5.25" at 72 DPI (standard badge size)
        margins: { top: 20, bottom: 20, left: 20, right: 20 },
      });
      
      const buffers = [];
      doc.on('data', buffers.push.bind(buffers));
      doc.on('end', () => {
        const pdfBuffer = Buffer.concat(buffers);
        resolve(pdfBuffer);
      });
      doc.on('error', reject);
      
      // Header - Organization Name
      doc.fontSize(18)
         .font('Helvetica-Bold')
         .text('VISITOR PASS', { align: 'center' });
      
      doc.moveDown(0.5);
      
      // Visitor Photo (if available)
      if (passData.visitor.photo && fs.existsSync(passData.visitor.photo)) {
        try {
          doc.image(passData.visitor.photo, {
            fit: [100, 100],
            align: 'center',
          });
        } catch (err) {
          console.log('Could not load photo:', err.message);
        }
      }
      
      doc.moveDown(0.5);
      
      // Visitor Name
      doc.fontSize(16)
         .font('Helvetica-Bold')
         .text(`${passData.visitor.firstName} ${passData.visitor.lastName}`, {
           align: 'center',
         });
      
      doc.moveDown(0.3);
      
      // Company
      if (passData.visitor.company) {
        doc.fontSize(12)
           .font('Helvetica')
           .text(passData.visitor.company, { align: 'center' });
        doc.moveDown(0.3);
      }
      
      // Pass Number
      doc.fontSize(10)
         .font('Helvetica')
         .text(`Pass #: ${passData.passNumber}`, { align: 'center' });
      
      doc.moveDown(0.5);
      
      // QR Code
      if (passData.qrCodeImage) {
        // Remove data:image/png;base64, prefix if present
        const base64Data = passData.qrCodeImage.replace(/^data:image\/\w+;base64,/, '');
        const qrBuffer = Buffer.from(base64Data, 'base64');
        
        doc.image(qrBuffer, {
          fit: [150, 150],
          align: 'center',
        });
      }
      
      doc.moveDown(0.5);
      
      // Validity
      doc.fontSize(9)
         .font('Helvetica')
         .text(`Valid From: ${new Date(passData.validFrom).toLocaleDateString()}`, {
           align: 'center',
         })
         .text(`Valid Until: ${new Date(passData.validUntil).toLocaleDateString()}`, {
           align: 'center',
         });
      
      doc.moveDown(0.5);
      
      // Footer
      doc.fontSize(8)
         .font('Helvetica-Oblique')
         .text('Please wear this badge at all times', { align: 'center' });
      
      doc.end();
    } catch (error) {
      reject(error);
    }
  });
};

module.exports = {
  generateBadgePDF,
};
