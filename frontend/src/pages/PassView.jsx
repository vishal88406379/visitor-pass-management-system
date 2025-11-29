import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';

const PassView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [pass, setPass] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchPass();
  }, [id]);

  const fetchPass = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/passes/${id}`);
      setPass(response.data.data);
      setLoading(false);
    } catch (err) {
      setError(err.response?.data?.error?.message || 'Error fetching pass');
      setLoading(false);
    }
  };

  const handleDownloadBadge = async () => {
    try {
      const response = await api.get(`/passes/${id}/badge`, {
        responseType: 'blob'
      });
      
      // Create download link
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `pass-${pass.passNumber}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('Error downloading badge:', error);
    }
  };

  if (loading) {
    return (
      <div style={styles.container}>
        <div style={styles.card}>
          <h2>Loading...</h2>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={styles.container}>
        <div style={styles.card}>
          <div style={styles.error}>{error}</div>
          <button onClick={() => navigate('/dashboard')} style={styles.button}>
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  if (!pass) {
    return (
      <div style={styles.container}>
        <div style={styles.card}>
          <div style={styles.error}>Pass not found</div>
          <button onClick={() => navigate('/dashboard')} style={styles.button}>
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const isValid = new Date(pass.validUntil) > new Date();

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.header}>
          <h2 style={styles.title}>Visitor Pass</h2>
          <button onClick={() => navigate('/dashboard')} style={styles.backButton}>
            ← Back to Dashboard
          </button>
        </div>
        
        <div style={{ ...styles.passContainer, borderLeft: `4px solid ${isValid ? '#43e97b' : '#dc3545'}` }}>
          <div style={styles.passHeader}>
            <h3 style={styles.passNumber}>#{pass.passNumber}</h3>
            <span style={{ ...styles.status, backgroundColor: isValid ? '#43e97b' : '#dc3545' }}>
              {isValid ? 'Active' : 'Expired'}
            </span>
          </div>
          
          <div style={styles.qrContainer}>
            <img 
              src={pass.qrCodeImage} 
              alt="Pass QR Code" 
              style={styles.qrCode}
            />
            <p style={styles.qrHelp}>Scan this QR code at check-in</p>
          </div>
          
          <div style={styles.detailsSection}>
            <h4 style={styles.sectionTitle}>Visitor Information</h4>
            <div style={styles.detailRow}>
              <span style={styles.detailLabel}>Name:</span>
              <span style={styles.detailValue}>
                {pass.visitor.firstName} {pass.visitor.lastName}
              </span>
            </div>
            <div style={styles.detailRow}>
              <span style={styles.detailLabel}>Email:</span>
              <span style={styles.detailValue}>{pass.visitor.email}</span>
            </div>
            <div style={styles.detailRow}>
              <span style={styles.detailLabel}>Company:</span>
              <span style={styles.detailValue}>{pass.visitor.company}</span>
            </div>
          </div>
          
          <div style={styles.detailsSection}>
            <h4 style={styles.sectionTitle}>Visit Details</h4>
            <div style={styles.detailRow}>
              <span style={styles.detailLabel}>Purpose:</span>
              <span style={styles.detailValue}>{pass.appointment.purpose}</span>
            </div>
            <div style={styles.detailRow}>
              <span style={styles.detailLabel}>Valid From:</span>
              <span style={styles.detailValue}>
                {new Date(pass.validFrom).toLocaleDateString()} at{' '}
                {new Date(pass.validFrom).toLocaleTimeString()}
              </span>
            </div>
            <div style={styles.detailRow}>
              <span style={styles.detailLabel}>Valid Until:</span>
              <span style={styles.detailValue}>
                {new Date(pass.validUntil).toLocaleDateString()} at{' '}
                {new Date(pass.validUntil).toLocaleTimeString()}
              </span>
            </div>
          </div>
          
          <div style={styles.detailsSection}>
            <h4 style={styles.sectionTitle}>Issued By</h4>
            <div style={styles.detailRow}>
              <span style={styles.detailLabel}>Name:</span>
              <span style={styles.detailValue}>
                {pass.issuedBy.firstName} {pass.issuedBy.lastName}
              </span>
            </div>
            <div style={styles.detailRow}>
              <span style={styles.detailLabel}>Email:</span>
              <span style={styles.detailValue}>{pass.issuedBy.email}</span>
            </div>
          </div>
          
          <div style={styles.actions}>
            <button onClick={handleDownloadBadge} style={styles.downloadButton}>
              Download PDF Badge
            </button>
          </div>
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
    padding: '30px',
    borderRadius: '10px',
    boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
    width: '100%',
    maxWidth: '800px',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '30px',
  },
  title: {
    fontSize: '28px',
    fontWeight: 'bold',
    color: '#333',
    margin: 0,
  },
  backButton: {
    padding: '10px 15px',
    background: '#6c757d',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '14px',
  },
  passContainer: {
    background: '#f8f9fa',
    padding: '25px',
    borderRadius: '8px',
    border: '1px solid #dee2e6',
  },
  passHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '25px',
  },
  passNumber: {
    fontSize: '24px',
    fontWeight: 'bold',
    margin: 0,
  },
  status: {
    padding: '5px 15px',
    borderRadius: '20px',
    color: 'white',
    fontSize: '14px',
    fontWeight: 'bold',
  },
  qrContainer: {
    textAlign: 'center',
    marginBottom: '30px',
  },
  qrCode: {
    maxWidth: '200px',
    height: 'auto',
    border: '1px solid #ddd',
    borderRadius: '5px',
    padding: '10px',
    background: 'white',
  },
  qrHelp: {
    fontSize: '14px',
    color: '#666',
    marginTop: '10px',
  },
  detailsSection: {
    marginBottom: '25px',
    paddingBottom: '20px',
    borderBottom: '1px solid #eee',
  },
  sectionTitle: {
    fontSize: '18px',
    fontWeight: 'bold',
    color: '#333',
    marginBottom: '15px',
  },
  detailRow: {
    display: 'flex',
    marginBottom: '10px',
  },
  detailLabel: {
    fontWeight: '500',
    minWidth: '120px',
    color: '#666',
  },
  detailValue: {
    flex: 1,
    color: '#333',
  },
  actions: {
    textAlign: 'center',
    marginTop: '30px',
  },
  downloadButton: {
    padding: '12px 25px',
    background: '#667eea',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '16px',
    fontWeight: '500',
  },
  button: {
    padding: '10px 15px',
    background: '#667eea',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '14px',
  },
  error: {
    background: '#fee',
    color: '#c33',
    padding: '15px',
    borderRadius: '5px',
    marginBottom: '20px',
    textAlign: 'center',
  },
};

export default PassView;