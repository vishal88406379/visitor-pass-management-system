import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';

const CreateAppointment = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    visitor: '',
    host: '',
    scheduledDate: '',
    scheduledTime: '',
    purpose: '',
    location: '',
    notes: ''
  });
  const [visitors, setVisitors] = useState([]);
  const [hosts, setHosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchVisitors();
    fetchHosts();
  }, []);

  const fetchVisitors = async () => {
    try {
      const response = await api.get('/visitors');
      setVisitors(response.data.data);
    } catch (err) {
      console.error('Error fetching visitors:', err);
    }
  };

  const fetchHosts = async () => {
    try {
      const response = await api.get('/users');
      const employeeHosts = response.data.data.filter(user => user.role === 'employee');
      setHosts(employeeHosts);
    } catch (err) {
      console.error('Error fetching hosts:', err);
    }
  };

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
      await api.post('/appointments', formData);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.error?.message || 'Error creating appointment');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>Create Appointment</h2>
        
        {error && <div style={styles.error}>{error}</div>}
        
        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.formGroup}>
            <label style={styles.label}>Visitor *</label>
            <select
              name="visitor"
              value={formData.visitor}
              onChange={handleChange}
              required
              style={styles.input}
            >
              <option value="">Select Visitor</option>
              {visitors.map(visitor => (
                <option key={visitor._id} value={visitor._id}>
                  {visitor.firstName} {visitor.lastName} ({visitor.email})
                </option>
              ))}
            </select>
          </div>
          
          <div style={styles.formGroup}>
            <label style={styles.label}>Host *</label>
            <select
              name="host"
              value={formData.host}
              onChange={handleChange}
              required
              style={styles.input}
            >
              <option value="">Select Host</option>
              {hosts.map(host => (
                <option key={host._id} value={host._id}>
                  {host.firstName} {host.lastName} ({host.email})
                </option>
              ))}
            </select>
          </div>
          
          <div style={styles.row}>
            <div style={styles.formGroup}>
              <label style={styles.label}>Scheduled Date *</label>
              <input
                type="date"
                name="scheduledDate"
                value={formData.scheduledDate}
                onChange={handleChange}
                required
                style={styles.input}
              />
            </div>
            
            <div style={styles.formGroup}>
              <label style={styles.label}>Scheduled Time *</label>
              <input
                type="time"
                name="scheduledTime"
                value={formData.scheduledTime}
                onChange={handleChange}
                required
                style={styles.input}
              />
            </div>
          </div>
          
          <div style={styles.formGroup}>
            <label style={styles.label}>Purpose of Visit *</label>
            <textarea
              name="purpose"
              value={formData.purpose}
              onChange={handleChange}
              required
              style={styles.textarea}
              rows="3"
            />
          </div>
          
          <div style={styles.formGroup}>
            <label style={styles.label}>Location</label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              style={styles.input}
              placeholder="Meeting location"
            />
          </div>
          
          <div style={styles.formGroup}>
            <label style={styles.label}>Notes</label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              style={styles.textarea}
              rows="3"
              placeholder="Additional notes"
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
              {loading ? 'Creating...' : 'Create Appointment'}
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

export default CreateAppointment;