import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';

const VisitorDashboard = () => {
  const navigate = useNavigate();
  const [passes, setPasses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchVisitorPasses();
  }, []);

  const fetchVisitorPasses = async () => {
    try {
      // Fetch visitor passes
      const response = await api.get('/passes');
      setPasses(response.data.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching visitor passes:', error);
      setLoading(false);
    }
  };

  const handleViewPass = (passId) => {
    navigate(`/passes/${passId}`);
  };

  const handleDownloadBadge = async (passId) => {
    try {
      const response = await api.get(`/passes/${passId}/badge`, {
        responseType: 'blob'
      });
      
      // Create download link
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `pass-${passId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('Error downloading badge:', error);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Visitor Dashboard</h2>
      
      <div style={styles.section}>
        <div style={styles.sectionHeader}>
          <h3 style={styles.sectionTitle}>My Passes</h3>
        </div>
        
        {passes.length === 0 ? (
          <p style={styles.emptyState}>No active passes</p>
        ) : (
          <div style={styles.passList}>
            {passes.map(pass => (
              <PassCard 
                key={pass._id} 
                pass={pass} 
                onView={() => handleViewPass(pass._id)}
                onDownload={() => handleDownloadBadge(pass._id)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const PassCard = ({ pass, onView, onDownload }) => {
  const isValid = new Date(pass.validUntil) > new Date();
  
  return (
    <div style={{ ...styles.passCard, borderLeft: `4px solid ${isValid ? '#43e97b' : '#dc3545'}` }}>
      <div style={styles.passHeader}>
        <h4 style={styles.passNumber}>Pass #{pass.passNumber}</h4>
        <span style={{ ...styles.status, backgroundColor: isValid ? '#43e97b' : '#dc3545' }}>
          {isValid ? 'Active' : 'Expired'}
        </span>
      </div>
      
      <div style={styles.passDetails}>
        <p style={styles.detail}><strong>Visitor:</strong> {pass.visitor.firstName} {pass.visitor.lastName}</p>
        <p style={styles.detail}><strong>Valid From:</strong> {new Date(pass.validFrom).toLocaleDateString()}</p>
        <p style={styles.detail}><strong>Valid Until:</strong> {new Date(pass.validUntil).toLocaleDateString()}</p>
      </div>
      
      <div style={styles.passActions}>
        <button style={styles.actionButton} onClick={onView}>View Details</button>
        <button style={{ ...styles.actionButton, marginLeft: '10px' }} onClick={onDownload}>Download Badge</button>
      </div>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
  },
  title: {
    fontSize: '28px',
    fontWeight: 'bold',
    marginBottom: '30px',
    color: '#333',
  },
  section: {
    background: 'white',
    padding: '25px',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    marginBottom: '20px',
  },
  sectionHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px',
  },
  sectionTitle: {
    fontSize: '18px',
    fontWeight: 'bold',
    color: '#333',
    margin: 0,
  },
  emptyState: {
    textAlign: 'center',
    color: '#999',
    padding: '40px',
  },
  passList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '15px',
  },
  passCard: {
    background: '#f8f9fa',
    padding: '20px',
    borderRadius: '8px',
    border: '1px solid #dee2e6',
  },
  passHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '15px',
  },
  passNumber: {
    fontSize: '16px',
    fontWeight: 'bold',
    margin: 0,
  },
  status: {
    padding: '5px 10px',
    borderRadius: '20px',
    color: 'white',
    fontSize: '12px',
    fontWeight: 'bold',
  },
  passDetails: {
    marginBottom: '15px',
  },
  detail: {
    margin: '5px 0',
    fontSize: '14px',
    color: '#666',
  },
  passActions: {
    display: 'flex',
  },
  actionButton: {
    padding: '8px 16px',
    background: '#667eea',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '14px',
  },
};

export default VisitorDashboard;