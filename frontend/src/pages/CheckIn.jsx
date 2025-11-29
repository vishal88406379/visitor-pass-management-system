import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const CheckIn = () => {
  const navigate = useNavigate();
  const [passId, setPassId] = useState('');
  const [location, setLocation] = useState('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

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

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>Visitor Check-In</h2>
        
        {error && <div style={styles.error}>{error}</div>}
        {success && <div style={styles.success}>{success}</div>}
        
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
        
        <div style={styles.divider}>
          <span style={styles.dividerText}>OR</span>
        </div>
        
        <div style={styles.qrSection}>
          <h3 style={styles.qrTitle}>Scan QR Code</h3>
          <button style={styles.qrButton}>
            Open Camera to Scan QR Code
          </button>
          <p style={styles.qrHelp}>
            Point your camera at the visitor's QR code to automatically check them in.
          </p>
        </div>
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
  divider: {
    display: 'flex',
    alignItems: 'center',
    margin: '30px 0',
  },
  dividerText: {
    padding: '0 15px',
    color: '#999',
    fontSize: '14px',
    background: 'white',
    position: 'relative',
    zIndex: 1,
  },
  qrSection: {
    textAlign: 'center',
  },
  qrTitle: {
    fontSize: '18px',
    fontWeight: 'bold',
    marginBottom: '20px',
    color: '#333',
  },
  qrButton: {
    padding: '15px 25px',
    background: '#28a745',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    fontSize: '16px',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'background 0.3s',
    marginBottom: '15px',
  },
  qrHelp: {
    fontSize: '14px',
    color: '#666',
    lineHeight: '1.5',
  },
};

export default CheckIn;