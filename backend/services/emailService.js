/**
 * Email Service
 * Handles sending email notifications
 */

const nodemailer = require('nodemailer');

// Create transporter
const createTransporter = () => {
  return nodemailer.createTransporter({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });
};

/**
 * Send email
 * @param {Object} options - Email options
 */
const sendEmail = async (options) => {
  try {
    const transporter = createTransporter();
    
    const mailOptions = {
      from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
      to: options.to,
      subject: options.subject,
      html: options.html,
    };
    
    await transporter.sendMail(mailOptions);
    console.log(`Email sent to ${options.to}`);
  } catch (error) {
    console.error('Email sending error:', error);
    throw new Error('Failed to send email');
  }
};

/**
 * Send appointment created notification
 */
const sendAppointmentCreated = async (appointment, visitor) => {
  const html = `
    <h2>Appointment Confirmation</h2>
    <p>Dear ${visitor.firstName} ${visitor.lastName},</p>
    <p>Your appointment has been created successfully.</p>
    <h3>Appointment Details:</h3>
    <ul>
      <li><strong>Date:</strong> ${new Date(appointment.scheduledDate).toLocaleDateString()}</li>
      <li><strong>Time:</strong> ${appointment.scheduledTime}</li>
      <li><strong>Purpose:</strong> ${appointment.purpose}</li>
      <li><strong>Location:</strong> ${appointment.location || 'Main Office'}</li>
    </ul>
    <p>Your appointment is currently <strong>${appointment.status}</strong>.</p>
    <p>You will receive another email once your appointment is approved.</p>
    <br>
    <p>Best regards,<br>Visitor Management Team</p>
  `;
  
  await sendEmail({
    to: visitor.email,
    subject: 'Appointment Confirmation',
    html,
  });
};

/**
 * Send appointment approved notification
 */
const sendAppointmentApproved = async (appointment, visitor, passId) => {
  const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
  const passUrl = `${frontendUrl}/passes/${passId}`;
  
  const html = `
    <h2>Appointment Approved!</h2>
    <p>Dear ${visitor.firstName} ${visitor.lastName},</p>
    <p>Great news! Your appointment has been approved.</p>
    <h3>Appointment Details:</h3>
    <ul>
      <li><strong>Date:</strong> ${new Date(appointment.scheduledDate).toLocaleDateString()}</li>
      <li><strong>Time:</strong> ${appointment.scheduledTime}</li>
      <li><strong>Purpose:</strong> ${appointment.purpose}</li>
      <li><strong>Location:</strong> ${appointment.location || 'Main Office'}</li>
    </ul>
    <p>Your digital visitor pass has been generated.</p>
    <p><a href="${passUrl}" style="background-color: #4CAF50; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">View Your Pass</a></p>
    <p>Please present this pass at the reception when you arrive.</p>
    <br>
    <p>Best regards,<br>Visitor Management Team</p>
  `;
  
  await sendEmail({
    to: visitor.email,
    subject: 'Appointment Approved - Visitor Pass Ready',
    html,
  });
};

/**
 * Send appointment cancelled notification
 */
const sendAppointmentCancelled = async (appointment, visitor) => {
  const html = `
    <h2>Appointment Cancelled</h2>
    <p>Dear ${visitor.firstName} ${visitor.lastName},</p>
    <p>We regret to inform you that your appointment has been cancelled.</p>
    <h3>Cancelled Appointment Details:</h3>
    <ul>
      <li><strong>Date:</strong> ${new Date(appointment.scheduledDate).toLocaleDateString()}</li>
      <li><strong>Time:</strong> ${appointment.scheduledTime}</li>
      <li><strong>Purpose:</strong> ${appointment.purpose}</li>
    </ul>
    <p>If you have any questions, please contact us.</p>
    <br>
    <p>Best regards,<br>Visitor Management Team</p>
  `;
  
  await sendEmail({
    to: visitor.email,
    subject: 'Appointment Cancelled',
    html,
  });
};

/**
 * Send visitor arrival notification to host
 */
const sendVisitorArrival = async (host, visitor, checkInTime) => {
  const html = `
    <h2>Visitor Arrival Notification</h2>
    <p>Dear ${host.firstName} ${host.lastName},</p>
    <p>Your visitor has arrived.</p>
    <h3>Visitor Details:</h3>
    <ul>
      <li><strong>Name:</strong> ${visitor.firstName} ${visitor.lastName}</li>
      <li><strong>Company:</strong> ${visitor.company || 'N/A'}</li>
      <li><strong>Check-in Time:</strong> ${new Date(checkInTime).toLocaleString()}</li>
    </ul>
    <p>Please proceed to the reception to meet your visitor.</p>
    <br>
    <p>Best regards,<br>Visitor Management Team</p>
  `;
  
  await sendEmail({
    to: host.email,
    subject: 'Visitor Arrival - Action Required',
    html,
  });
};

module.exports = {
  sendEmail,
  sendAppointmentCreated,
  sendAppointmentApproved,
  sendAppointmentCancelled,
  sendVisitorArrival,
};
