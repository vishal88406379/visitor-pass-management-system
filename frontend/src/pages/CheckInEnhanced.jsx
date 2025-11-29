import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import jsQR from 'jsqr';

const CheckInEnhanced = () => {
  const navigate = useNavigate();
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const qrScannerRef = useRef(null);
  
  const [activeTab, setActiveTab] = useState('manual'); // 'manual' or 'qr'
  const [passId, setPassId] = useState('');
  const [location, setLocation] = useState('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [scanning, setScanning] = useState(false);

  // Initialize QR scanner when component mounts
  useEffect(() => {
    return () => {
      // Cleanup camera stream on component unmount
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const startQrScanner = async () => {
    try {
      setScanning(true);
      setError('');
      
      // Request camera access
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } 
      });
      
      streamRef.current = stream;
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
      
      // Start scanning for QR codes
      scanForQrCode();
    } catch (err) {
      setError('Could not access camera. Please allow camera permissions.');
      setScanning(false);
      console.error('Camera error:', err);
    }
  };

  const scanForQrCode = () => {
    if (!videoRef.current || !streamRef.current) return;
    
    const detectQrCode = () => {
      if (!scanning) return;
      
      const video = videoRef.current;
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
      
      if (video.readyState === video.HAVE_ENOUGH_DATA) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        
        const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
        const code = jsQR(imageData.data, imageData.width, imageData.height, {
          inversionAttempts: 'dontInvert',
        });
        
        if (code) {
          handleQrDetected(code.data);
          return;
        }
      }
      
      setTimeout(detectQrCode, 100);
    };
    
    detectQrCode();
  };

  const handleQrDetected = (data) => {
    // Stop scanning
    setScanning(false);
    
    // Stop camera stream
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    
    // Process the QR code data
    try {
      // If it's a pass ID, set it in the form
      setPassId(data);
      setActiveTab('manual');
      setSuccess('QR Code scanned successfully! Please complete the check-in.');
    } catch (err) {
      setError('Invalid QR code data');
    }
  };

  const stopQrScanner = () => {
    setScanning(false);
    
    // Stop camera stream
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      await api.post('/checklogs/checkin', {
        passId,
        location,
        notes
      });
      
      setSuccess('Visitor checked in successfully!');
      setPassId('');
      setLocation('');
      setNotes('');
    } catch (err) {
      setError(err.response?.data?.error?.message || 'Error checking in visitor');
    } finally {
      setLoading(false);
    }
  };

  const handleManualCheckIn = () => {
    setActiveTab('manual');
    stopQrScanner();
  };

  const handleQrCheckIn = () => {
    setActiveTab('qr');
    startQrScanner();
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>Visitor Check-In</h2>
        
        {error && <div style={styles.error}>{error}</div>}
        {success && <div style={styles.success}>{success}</div>}
        
        {/* Tab Navigation */}
        <div style={styles.tabs}>
          <button
            onClick={handleManualCheckIn}
            style={{
              ...styles.tab,
              ...(activeTab === 'manual' ? styles.activeTab : {})
            }}
          >
            Manual Check-In
          </button>
          <button
            onClick={handleQrCheckIn}
            style={{
              ...styles.tab,
              ...(activeTab === 'qr' ? styles.activeTab : {})
            }}
          >
            Scan QR Code
          </button>
        </div>
        
        {/* Manual Check-In Form */}
        {activeTab === 'manual' && (
          <form onSubmit={handleSubmit} style={styles.form}>
            <div style={styles.formGroup}>
              <label style={styles.label}>Pass ID *</label>
              <input
                type="text"
                value={passId}
                onChange={(e) => setPassId(e.target.value)}
                required
                style={styles.input}
                placeholder="Enter pass ID"
              />
            </div>
            
            <div style={styles.formGroup}>
              <label style={styles.label}>Location</label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                style={styles.input}
                placeholder="Enter location (optional)"
              />
            </div>
            
            <div style={styles.formGroup}>
              <label style={styles.label}>Notes</label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                style={styles.textarea}
                rows="3"
                placeholder="Any additional notes (optional)"
              />
            </div>
            
            <div style={styles.buttonGroup}>
              <button
                type="button"
                onClick={() => navigate('/dashboard')}
                style={{ ...styles.button, background: '#6c757d' }}
              >
                Back to Dashboard
              </button>
              <button
                type="submit"
                disabled={loading}
                style={styles.button}
              >
                {loading ? 'Checking In...' : 'Check In Visitor'}
              </button>
            </div>
          </form>
        )}
        
        {/* QR Code Scanner */}
        {activeTab === 'qr' && (
          <div style={styles.qrSection}>
            <div style={styles.cameraContainer}>
              <video
                ref={videoRef}
                style={styles.video}
                playsInline
              />
              {scanning && (
                <div style={styles.scannerOverlay}>
                  <div style={styles.scannerBox}></div>
                  <p style={styles.scannerText}>Point camera at QR code</p>
                </div>
              )}
            </div>
            
            <div style={styles.qrButtonGroup}>
              {!scanning ? (
                <button
                  onClick={startQrScanner}
                  style={{ ...styles.button, background: '#28a745' }}
                >
                  Start Camera
                </button>
              ) : (
                <button
                  onClick={stopQrScanner}
                  style={{ ...styles.button, background: '#dc3545' }}
                >
                  Stop Camera
                </button>
              )}
              
              <button
                onClick={() => navigate('/dashboard')}
                style={{ ...styles.button, background: '#6c757d' }}
              >
                Back to Dashboard
              </button>
            </div>
            
            {passId && (
              <div style={styles.qrResult}>
                <p>Scanned Pass ID: <strong>{passId}</strong></p>
                <button
                  onClick={() => setActiveTab('manual')}
                  style={{ ...styles.button, marginTop: '10px' }}
                >
                  Proceed to Check-In
                </button>
              </div>
            )}
          </div>
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
  title: {
    fontSize: '24px',
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: '30px',
    color: '#333',
  },
  tabs: {
    display: 'flex',
    marginBottom: '30px',
    border: '1px solid #ddd',
    borderRadius: '5px',
    overflow: 'hidden',
  },
  tab: {
    flex: 1,
    padding: '12px',
    background: '#f8f9fa',
    border: 'none',
    cursor: 'pointer',
    fontWeight: '500',
  },
  activeTab: {
    background: '#667eea',
    color: 'white',
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
  qrSection: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  cameraContainer: {
    position: 'relative',
    width: '100%',
    borderRadius: '10px',
    overflow: 'hidden',
    background: '#000',
  },
  video: {
    width: '100%',
    height: '300px',
    objectFit: 'cover',
  },
  scannerOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scannerBox: {
    width: '200px',
    height: '200px',
    border: '3px solid #28a745',
    borderRadius: '10px',
    boxShadow: '0 0 0 1000px rgba(0, 0, 0, 0.5)',
  },
  scannerText: {
    color: 'white',
    marginTop: '20px',
    fontSize: '16px',
    fontWeight: '500',
  },
  qrButtonGroup: {
    display: 'flex',
    gap: '15px',
  },
  qrResult: {
    padding: '20px',
    background: '#f8f9fa',
    borderRadius: '5px',
    textAlign: 'center',
  },
};

export default CheckInEnhanced;