import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';

const RegisterWithOTP = () => {
  const navigate = useNavigate();
  
  // Registration states
  const [step, setStep] = useState(1); // 1: Registration form, 2: OTP verification
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    company: '',
    purpose: '',
    photo: null
  });
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFormData(prev => ({
      ...prev,
      photo: file
    }));
  };

  const handleSendOTP = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      // Validate required fields
      if (!formData.firstName || !formData.lastName || !formData.email || !formData.phone) {
        throw new Error('Please fill in all required fields');
      }
      
      // Send OTP request to backend
      await api.post('/visitors/send-otp', {
        email: formData.email,
        phone: formData.phone
      });
      
      setStep(2); // Move to OTP verification step
      setSuccess('OTP sent to your email. Please check your inbox.');
    } catch (err) {
      setError(err.response?.data?.error?.message || err.message || 'Error sending OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    
    try {
      // Verify OTP
      const response = await api.post('/visitors/verify-otp', {
        email: formData.email,
        otp: otp
      });
      
      if (response.data.success) {
        // OTP verified, now register the visitor
        await registerVisitor();
      }
    } catch (err) {
      setError(err.response?.data?.error?.message || err.message || 'Error verifying OTP');
    } finally {
      setLoading(false);
    }
  };

  const registerVisitor = async () => {
    try {
      // Create form data for file upload
      const data = new FormData();
      Object.keys(formData).forEach(key => {
        if (formData[key]) {
          data.append(key, formData[key]);
        }
      });
      
      // Register visitor
      await api.post('/visitors/register-with-otp', data, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      setSuccess('Visitor registered successfully!');
      
      // Reset form after successful registration
      setTimeout(() => {
        setFormData({
          firstName: '',
          lastName: '',
          email: '',
          phone: '',
          company: '',
          purpose: '',
          photo: null
        });
        setOtp('');
        setStep(1);
        navigate('/dashboard');
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.error?.message || err.message || 'Error registering visitor');
    }
  };

  const handleResendOTP = async () => {
    setLoading(true);
    setError('');
    
    try {
      await api.post('/visitors/send-otp', {
        email: formData.email,
        phone: formData.phone
      });
      
      setSuccess('OTP resent successfully!');
    } catch (err) {
      setError(err.response?.data?.error?.message || err.message || 'Error resending OTP');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>Visitor Registration with OTP</h2>
        
        {error && <div style={styles.error}>{error}</div>}
        {success && <div style={styles.success}>{success}</div>}
        
        {step === 1 ? (
          // Registration Form
          <form onSubmit={handleSendOTP} style={styles.form}>
            <div style={styles.formSection}>
              <h3 style={styles.sectionTitle}>Personal Information</h3>
              
              <div style={styles.formRow}>
                <div style={styles.formGroup}>
                  <label style={styles.label}>First Name *</label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    required
                    style={styles.input}
                    placeholder="Enter first name"
                  />
                </div>
                
                <div style={styles.formGroup}>
                  <label style={styles.label}>Last Name *</label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    required
                    style={styles.input}
                    placeholder="Enter last name"
                  />
                </div>
              </div>
              
              <div style={styles.formRow}>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Email *</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    style={styles.input}
                    placeholder="Enter email address"
                  />
                </div>
                
                <div style={styles.formGroup}>
                  <label style={styles.label}>Phone *</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                    style={styles.input}
                    placeholder="Enter phone number"
                  />
                </div>
              </div>
            </div>
            
            <div style={styles.formSection}>
              <h3 style={styles.sectionTitle}>Visit Details</h3>
              
              <div style={styles.formGroup}>
                <label style={styles.label}>Company</label>
                <input
                  type="text"
                  name="company"
                  value={formData.company}
                  onChange={handleInputChange}
                  style={styles.input}
                  placeholder="Enter company name"
                />
              </div>
              
              <div style={styles.formGroup}>
                <label style={styles.label}>Purpose of Visit</label>
                <textarea
                  name="purpose"
                  value={formData.purpose}
                  onChange={handleInputChange}
                  style={styles.textarea}
                  rows="3"
                  placeholder="Enter purpose of visit"
                />
              </div>
              
              <div style={styles.formGroup}>
                <label style={styles.label}>Photo</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  style={styles.fileInput}
                />
                <p style={styles.fileHelp}>Upload a recent photo (optional)</p>
              </div>
            </div>
            
            <div style={styles.buttonGroup}>
              <button
                type="button"
                onClick={() => navigate('/dashboard')}
                style={{ ...styles.button, background: '#6c757d' }}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                style={styles.button}
              >
                {loading ? 'Sending OTP...' : 'Send OTP'}
              </button>
            </div>
          </form>
        ) : (
          // OTP Verification Form
          <form onSubmit={handleVerifyOTP} style={styles.form}>
            <div style={styles.otpSection}>
              <h3 style={styles.sectionTitle}>Verify OTP</h3>
              <p style={styles.otpHelp}>
                We've sent a 6-digit code to <strong>{formData.email}</strong>. 
                Please enter it below to verify your identity.
              </p>
              
              <div style={styles.formGroup}>
                <label style={styles.label}>OTP Code *</label>
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  required
                  style={styles.input}
                  placeholder="Enter 6-digit code"
                  maxLength="6"
                />
              </div>
              
              <div style={styles.buttonGroup}>
                <button
                  type="button"
                  onClick={handleResendOTP}
                  disabled={loading}
                  style={{ ...styles.button, background: '#6c757d' }}
                >
                  Resend OTP
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  style={styles.button}
                >
                  {loading ? 'Verifying...' : 'Verify OTP'}
                </button>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

const styles = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: '#f5f5f5',
    padding: '20px',
  },
  card: {
    background: 'white',
    padding: '40px',
    borderRadius: '10px',
    boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
    width: '100%',
    maxWidth: '800px',
  },
  title: {
    fontSize: '28px',
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: '30px',
    color: '#333',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '30px',
  },
  formSection: {
    background: '#f8f9fa',
    padding: '25px',
    borderRadius: '8px',
    border: '1px solid #dee2e6',
  },
  sectionTitle: {
    fontSize: '20px',
    fontWeight: 'bold',
    marginBottom: '20px',
    color: '#333',
  },
  formRow: {
    display: 'flex',
    gap: '20px',
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    flex: 1,
  },
  label: {
    fontSize: '14px',
    fontWeight: '500',
    color: '#333',
  },
  input: {
    padding: '12px',
    border: '1px solid #ddd',
    borderRadius: '5px',
    fontSize: '14px',
    outline: 'none',
    transition: 'border-color 0.3s',
  },
  textarea: {
    padding: '12px',
    border: '1px solid #ddd',
    borderRadius: '5px',
    fontSize: '14px',
    outline: 'none',
    transition: 'border-color 0.3s',
    resize: 'vertical',
    minHeight: '80px',
  },
  fileInput: {
    padding: '10px 0',
  },
  fileHelp: {
    fontSize: '12px',
    color: '#666',
    margin: '5px 0 0 0',
  },
  buttonGroup: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '15px',
    marginTop: '20px',
  },
  button: {
    padding: '12px 25px',
    background: '#667eea',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    fontSize: '16px',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'background 0.3s',
  },
  otpSection: {
    textAlign: 'center',
  },
  otpHelp: {
    fontSize: '14px',
    color: '#666',
    marginBottom: '30px',
    lineHeight: '1.5',
  },
  error: {
    background: '#fee',
    color: '#c33',
    padding: '15px',
    borderRadius: '5px',
    marginBottom: '20px',
    textAlign: 'center',
  },
  success: {
    background: '#efe',
    color: '#363',
    padding: '15px',
    borderRadius: '5px',
    marginBottom: '20px',
    textAlign: 'center',
  },
};

export default RegisterWithOTP;