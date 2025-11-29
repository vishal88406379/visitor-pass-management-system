import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';

const VisitorRegisterEnhanced = () => {
  const navigate = useNavigate();
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);
  
  const [step, setStep] = useState(1); // 1: Form, 2: Photo, 3: OTP
  const [visitorId, setVisitorId] = useState(null);
  const [otp, setOtp] = useState('');
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    company: '',
    idType: '',
    idNumber: '',
    purpose: ''
  });
  
  const [photo, setPhoto] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      setError('Could not access camera. Please allow camera permissions.');
      console.error('Camera error:', err);
    }
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const canvas = canvasRef.current;
      const video = videoRef.current;
      const context = canvas.getContext('2d');
      
      // Set canvas dimensions to match video
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      // Draw video frame to canvas
      context.drawImage(video, 0, 0, canvas.width, canvas.height);
      
      // Convert to base64 data URL
      const dataUrl = canvas.toDataURL('image/jpeg');
      setPhoto(dataUrl);
      
      // Stop camera
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
        streamRef.current = null;
      }
    }
  };

  const retakePhoto = () => {
    setPhoto(null);
    startCamera();
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const dataToSend = {
        ...formData,
        photo // Include photo if captured
      };
      
      const response = await api.post('/visitors', dataToSend);
      setVisitorId(response.data.data._id);
      setStep(2); // Move to photo capture step
      startCamera(); // Start camera for selfie
    } catch (err) {
      setError(err.response?.data?.error?.message || 'Error registering visitor');
    } finally {
      setLoading(false);
    }
  };

  const handlePhotoSubmit = () => {
    if (photo) {
      capturePhoto(); // This will stop the camera
      setStep(3); // Move to OTP verification step
    }
  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      await api.post(`/visitors/${visitorId}/verify-otp`, { otp });
      setSuccess('Visitor registered and verified successfully!');
      setTimeout(() => {
        navigate('/dashboard');
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.error?.message || 'Error verifying OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    // In a real app, you would implement OTP resend functionality
    setSuccess('OTP has been resent to visitor\'s phone');
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        {/* Progress Indicator */}
        <div style={styles.progress}>
          <div 
            style={{
              ...styles.progressStep,
              backgroundColor: step >= 1 ? '#667eea' : '#e0e0e0',
              color: step >= 1 ? 'white' : '#666'
            }}
          >
            1
          </div>
          <div style={styles.progressLine}></div>
          <div 
            style={{
              ...styles.progressStep,
              backgroundColor: step >= 2 ? '#667eea' : '#e0e0e0',
              color: step >= 2 ? 'white' : '#666'
            }}
          >
            2
          </div>
          <div style={styles.progressLine}></div>
          <div 
            style={{
              ...styles.progressStep,
              backgroundColor: step >= 3 ? '#667eea' : '#e0e0e0',
              color: step >= 3 ? 'white' : '#666'
            }}
          >
            3
          </div>
        </div>
        
        <h2 style={styles.title}>
          {step === 1 && 'Visitor Registration'}
          {step === 2 && 'Capture Selfie'}
          {step === 3 && 'OTP Verification'}
        </h2>
        
        {error && <div style={styles.error}>{error}</div>}
        {success && <div style={styles.success}>{success}</div>}
        
        {/* Step 1: Registration Form */}
        {step === 1 && (
          <form onSubmit={handleFormSubmit} style={styles.form}>
            <div style={styles.row}>
              <div style={styles.formGroup}>
                <label style={styles.label}>First Name *</label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                  style={styles.input}
                />
              </div>
              
              <div style={styles.formGroup}>
                <label style={styles.label}>Last Name *</label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                  style={styles.input}
                />
              </div>
            </div>
            
            <div style={styles.formGroup}>
              <label style={styles.label}>Email *</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                style={styles.input}
              />
            </div>
            
            <div style={styles.formGroup}>
              <label style={styles.label}>Phone *</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
                style={styles.input}
              />
            </div>
            
            <div style={styles.formGroup}>
              <label style={styles.label}>Company</label>
              <input
                type="text"
                name="company"
                value={formData.company}
                onChange={handleChange}
                style={styles.input}
              />
            </div>
            
            <div style={styles.row}>
              <div style={styles.formGroup}>
                <label style={styles.label}>ID Type</label>
                <select
                  name="idType"
                  value={formData.idType}
                  onChange={handleChange}
                  style={styles.input}
                >
                  <option value="">Select ID Type</option>
                  <option value="passport">Passport</option>
                  <option value="driverLicense">Driver's License</option>
                  <option value="nationalId">National ID</option>
                </select>
              </div>
              
              <div style={styles.formGroup}>
                <label style={styles.label}>ID Number</label>
                <input
                  type="text"
                  name="idNumber"
                  value={formData.idNumber}
                  onChange={handleChange}
                  style={styles.input}
                />
              </div>
            </div>
            
            <div style={styles.formGroup}>
              <label style={styles.label}>Purpose of Visit</label>
              <textarea
                name="purpose"
                value={formData.purpose}
                onChange={handleChange}
                style={styles.textarea}
                rows="3"
              />
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
                {loading ? 'Registering...' : 'Register & Continue'}
              </button>
            </div>
          </form>
        )}
        
        {/* Step 2: Photo Capture */}
        {step === 2 && (
          <div style={styles.photoSection}>
            {!photo ? (
              <>
                <video 
                  ref={videoRef} 
                  autoPlay 
                  playsInline 
                  style={styles.video}
                />
                <canvas ref={canvasRef} style={styles.canvas} />
                <div style={styles.photoButtons}>
                  <button
                    onClick={capturePhoto}
                    style={{ ...styles.button, padding: '15px 30px' }}
                  >
                    Capture Photo
                  </button>
                </div>
              </>
            ) : (
              <>
                <div style={styles.photoPreview}>
                  <img src={photo} alt="Selfie preview" style={styles.previewImage} />
                </div>
                <div style={styles.photoButtons}>
                  <button
                    onClick={retakePhoto}
                    style={{ ...styles.button, background: '#6c757d' }}
                  >
                    Retake
                  </button>
                  <button
                    onClick={handlePhotoSubmit}
                    style={styles.button}
                  >
                    Continue to OTP
                  </button>
                </div>
              </>
            )}
          </div>
        )}
        
        {/* Step 3: OTP Verification */}
        {step === 3 && (
          <form onSubmit={handleOtpSubmit} style={styles.form}>
            <div style={styles.otpInfo}>
              <p>An OTP has been sent to the visitor's phone number.</p>
              <p>Please enter the 6-digit code below:</p>
            </div>
            
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
                onClick={handleResendOtp}
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
    maxWidth: '600px',
  },
  progress: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '30px',
  },
  progressStep: {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 'bold',
    fontSize: '18px',
  },
  progressLine: {
    width: '60px',
    height: '2px',
    backgroundColor: '#e0e0e0',
    margin: '0 10px',
  },
  title: {
    fontSize: '24px',
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: '30px',
    color: '#333',
  },
  error: {
    background: '#fee',
    color: '#c33',
    padding: '10px',
    borderRadius: '5px',
    marginBottom: '20px',
    textAlign: 'center',
  },
  success: {
    background: '#efe',
    color: '#3a3',
    padding: '10px',
    borderRadius: '5px',
    marginBottom: '20px',
    textAlign: 'center',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  row: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '20px',
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
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
  },
  buttonGroup: {
    display: 'flex',
    gap: '15px',
    marginTop: '20px',
  },
  button: {
    flex: 1,
    padding: '12px',
    background: '#667eea',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    fontSize: '16px',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'background 0.3s',
  },
  photoSection: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '20px',
  },
  video: {
    width: '100%',
    maxHeight: '400px',
    borderRadius: '10px',
    background: '#000',
  },
  canvas: {
    display: 'none',
  },
  photoButtons: {
    display: 'flex',
    gap: '15px',
    width: '100%',
  },
  photoPreview: {
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
  },
  previewImage: {
    maxWidth: '100%',
    maxHeight: '400px',
    borderRadius: '10px',
  },
  otpInfo: {
    textAlign: 'center',
    marginBottom: '20px',
  },
};

export default VisitorRegisterEnhanced;