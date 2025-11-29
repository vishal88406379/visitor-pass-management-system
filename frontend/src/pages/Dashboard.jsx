import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import AdminDashboard from '../components/dashboard/AdminDashboard';
import SecurityDashboard from '../components/dashboard/SecurityDashboard';
import EmployeeDashboard from '../components/dashboard/EmployeeDashboard';
import VisitorDashboard from '../components/dashboard/VisitorDashboard';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getRoleDashboard = () => {
    switch (user?.role) {
      case 'admin':
        return <AdminDashboardWrapper />;
      case 'security':
        return <SecurityDashboardWrapper />;
      case 'employee':
        return <EmployeeDashboardWrapper />;
      default:
        return <VisitorDashboardWrapper />;
    }
  };

  return (
    <div style={styles.container}>
      <nav style={styles.navbar}>
        <h1 style={styles.navTitle}>Visitor Pass Management</h1>
        <div style={styles.navRight}>
          <span style={styles.userName}>
            {user?.firstName} {user?.lastName} ({user?.role})
          </span>
          <button onClick={handleLogout} style={styles.logoutBtn}>
            Logout
          </button>
        </div>
      </nav>
      
      <div style={styles.content}>
        {getRoleDashboard()}
      </div>
    </div>
  );
};

const AdminDashboardWrapper = () => <AdminDashboard />;

const SecurityDashboardWrapper = () => <SecurityDashboard />;

const EmployeeDashboardWrapper = () => <EmployeeDashboard />;

const VisitorDashboardWrapper = () => <VisitorDashboard />;

const StatCard = ({ title, value, color }) => (
  <div style={{ ...styles.statCard, borderLeft: `4px solid ${color}` }}>
    <h3 style={styles.statTitle}>{title}</h3>
    <p style={{ ...styles.statValue, color }}>{value}</p>
  </div>
);

const ActionButton = ({ title, icon }) => (
  <button style={styles.actionButton}>
    <span style={styles.actionIcon}>{icon}</span>
    <span style={styles.actionTitle}>{title}</span>
  </button>
);

const styles = {
  container: {
    minHeight: '100vh',
    background: '#f5f5f5',
  },
  navbar: {
    background: 'white',
    padding: '15px 30px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  },
  navTitle: {
    fontSize: '20px',
    fontWeight: 'bold',
    color: '#333',
    margin: 0,
  },
  navRight: {
    display: 'flex',
    alignItems: 'center',
    gap: '20px',
  },
  userName: {
    fontSize: '14px',
    color: '#666',
  },
  logoutBtn: {
    padding: '8px 16px',
    background: '#dc3545',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '14px',
  },
  content: {
    padding: '30px',
  },
  dashboard: {
    maxWidth: '1200px',
    margin: '0 auto',
  },
  dashTitle: {
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
  emptyState: {
    textAlign: 'center',
    color: '#999',
    padding: '40px',
  },
};

export default Dashboard;
