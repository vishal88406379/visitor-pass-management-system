import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';

const SecurityDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    checkedIn: 0,
    pendingCheckout: 0,
    todaysVisitors: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      // Fetch active visitors count
      const activeResponse = await api.get('/checklogs/active');
      const activeCount = activeResponse.data.count;
      
      setStats({
        checkedIn: activeCount,
        pendingCheckout: activeCount,
        todaysVisitors: activeCount
      });
      
      setLoading(false);
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      setLoading(false);
    }
  };

  const handleRegisterVisitor = () => {
    navigate('/visitors/register');
  };

  const handleScanQR = () => {
    navigate('/checkin');
  };

  const handleViewActiveVisitors = () => {
    navigate('/visitors/active');
  };

  const handleViewCheckLogs = () => {
    navigate('/checklogs');
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Security Dashboard</h2>
      
      <div style={styles.statsGrid}>
        <StatCard 
          title="Checked In" 
          value={stats.checkedIn} 
          color="#667eea" 
        />
        <StatCard 
          title="Pending Check-out" 
          value={stats.pendingCheckout} 
          color="#f093fb" 
        />
        <StatCard 
          title="Today's Visitors" 
          value={stats.todaysVisitors} 
          color="#4facfe" 
        />
      </div>
      
      <div style={styles.section}>
        <h3 style={styles.sectionTitle}>Quick Actions</h3>
        <div style={styles.actionGrid}>
          <ActionButton 
            title="Register Visitor" 
            icon="➕" 
            onClick={handleRegisterVisitor}
          />
          <ActionButton 
            title="Scan QR Code" 
            icon="📷" 
            onClick={handleScanQR}
          />
          <ActionButton 
            title="Active Visitors" 
            icon="👁️" 
            onClick={handleViewActiveVisitors}
          />
          <ActionButton 
            title="Check Logs" 
            icon="📋" 
            onClick={handleViewCheckLogs}
          />
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ title, value, color }) => (
  <div style={{ ...styles.statCard, borderLeft: `4px solid ${color}` }}>
    <h3 style={styles.statTitle}>{title}</h3>
    <p style={{ ...styles.statValue, color }}>{value}</p>
  </div>
);

const ActionButton = ({ title, icon, onClick }) => (
  <button style={styles.actionButton} onClick={onClick}>
    <span style={styles.actionIcon}>{icon}</span>
    <span style={styles.actionTitle}>{title}</span>
  </button>
);

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
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '20px',
    marginBottom: '40px',
  },
  statCard: {
    background: 'white',
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  },
  statTitle: {
    fontSize: '14px',
    color: '#666',
    marginBottom: '10px',
  },
  statValue: {
    fontSize: '32px',
    fontWeight: 'bold',
    margin: 0,
  },
  section: {
    background: 'white',
    padding: '25px',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    marginBottom: '20px',
  },
  sectionTitle: {
    fontSize: '18px',
    fontWeight: 'bold',
    marginBottom: '20px',
    color: '#333',
  },
  actionGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '15px',
  },
  actionButton: {
    padding: '20px',
    background: '#f8f9fa',
    border: '1px solid #dee2e6',
    borderRadius: '8px',
    cursor: 'pointer',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '10px',
    transition: 'all 0.3s',
  },
  actionIcon: {
    fontSize: '32px',
  },
  actionTitle: {
    fontSize: '14px',
    fontWeight: '500',
    color: '#333',
  },
};

export default SecurityDashboard;