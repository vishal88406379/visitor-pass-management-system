import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';

const VisitorRegister = () => {
  const navigate = useNavigate();
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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await api.post('/visitors', formData);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.error?.message || 'Error registering visitor');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>Register Visitor</h2>
        
        {error && <div style={styles.error}>{error}</div>}
        
        <form onSubmit={handleSubmit} style={styles.form}>
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
              {loading ? 'Registering...' : 'Register Visitor'}
            </button>
          </div>
        </form>
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
};

export default VisitorRegister;