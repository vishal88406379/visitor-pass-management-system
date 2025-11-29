import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { mockAuthService } from '../services/mockAuthService';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [useMock, setUseMock] = useState(true); // Use mock by default
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (useMock) {
        // Use mock service for demo
        const response = await mockAuthService.login(email, password);
        const user = response.data.user;
        localStorage.setItem('user', JSON.stringify(user));
        localStorage.setItem('token', response.data.token);
        window.location.href = '/dashboard';
      } else {
        // Use real API
        await login(email, password);
        navigate('/dashboard');
      }
    } catch (err) {
      setError(err.response?.data?.error?.message || err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>Visitor Pass Management</h1>
        <h2 style={styles.subtitle}>Login</h2>
        
        {error && <div style={styles.error}>{error}</div>}
        
        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.formGroup}>
            <label style={styles.label}>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={styles.input}
              placeholder="Enter your email"
            />
          </div>
          
          <div style={styles.formGroup}>
            <label style={styles.label}>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={styles.input}
              placeholder="Enter your password"
            />
          </div>
          
          <button type="submit" disabled={loading} style={styles.button}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        
        <div style={styles.modeToggle}>
          <label style={styles.checkboxLabel}>
            <input
              type="checkbox"
              checked={useMock}
              onChange={(e) => setUseMock(e.target.checked)}
              style={styles.checkbox}
            />
            <span>Demo Mode (No Backend Required)</span>
          </label>
        </div>
        
        <div style={styles.demoCredentials}>
          <p style={styles.demoTitle}>Demo Credentials:</p>
          <p style={styles.demoText}>Admin: admin@example.com / password123</p>
          <p style={styles.demoText}>Security: security@example.com / password123</p>
          <p style={styles.demoText}>Employee: employee@example.com / password123</p>
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
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    padding: '20px',
  },
  card: {
    background: 'white',
    padding: '40px',
    borderRadius: '10px',
    boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
    width: '100%',
    maxWidth: '400px',
  },
  title: {
    fontSize: '24px',
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: '10px',
    color: '#333',
  },
  subtitle: {
    fontSize: '20px',
    textAlign: 'center',
    marginBottom: '30px',
    color: '#666',
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
  button: {
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
  demoCredentials: {
    marginTop: '30px',
    padding: '15px',
    background: '#f8f9fa',
    borderRadius: '5px',
  },
  demoTitle: {
    fontSize: '14px',
    fontWeight: 'bold',
    marginBottom: '10px',
    color: '#333',
  },
  demoText: {
    fontSize: '12px',
    color: '#666',
    margin: '5px 0',
  },
  modeToggle: {
    marginTop: '20px',
    padding: '15px',
    background: '#e3f2fd',
    borderRadius: '5px',
    border: '1px solid #90caf9',
  },
  checkboxLabel: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    fontSize: '14px',
    color: '#1976d2',
    cursor: 'pointer',
  },
  checkbox: {
    width: '18px',
    height: '18px',
    cursor: 'pointer',
  },
};

export default Login;
