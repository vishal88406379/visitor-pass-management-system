import React, { useState, useEffect } from 'react';
import api from '../../services/api';

const AnalyticsDashboard = () => {
  const [analytics, setAnalytics] = useState({
    totalVisitors: 0,
    activePasses: 0,
    appointmentsToday: 0,
    checkInsToday: 0,
    visitorTrends: [],
    popularTimes: [],
    hostActivity: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      
      // Fetch dashboard statistics
      const dashboardResponse = await api.get('/analytics/dashboard');
      
      // Fetch visitor trends
      const trendsResponse = await api.get('/analytics/trends');
      
      // Fetch popular times
      const timesResponse = await api.get('/analytics/times');
      
      // Fetch host activity
      const hostsResponse = await api.get('/analytics/hosts');
      
      setAnalytics({
        ...dashboardResponse.data.data,
        visitorTrends: trendsResponse.data.data,
        popularTimes: timesResponse.data.data,
        hostActivity: hostsResponse.data.data
      });
      
      setLoading(false);
    } catch (err) {
      setError('Error fetching analytics data');
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={styles.container}>
        <div style={styles.loading}>Loading analytics...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={styles.container}>
        <div style={styles.error}>{error}</div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Analytics Dashboard</h2>
      
      {/* Statistics Cards */}
      <div style={styles.statsGrid}>
        <div style={styles.statCard}>
          <h3 style={styles.statTitle}>Total Visitors</h3>
          <p style={styles.statValue}>{analytics.totalVisitors}</p>
        </div>
        
        <div style={styles.statCard}>
          <h3 style={styles.statTitle}>Active Passes</h3>
          <p style={styles.statValue}>{analytics.activePasses}</p>
        </div>
        
        <div style={styles.statCard}>
          <h3 style={styles.statTitle}>Appointments Today</h3>
          <p style={styles.statValue}>{analytics.appointmentsToday}</p>
        </div>
        
        <div style={styles.statCard}>
          <h3 style={styles.statTitle}>Check-Ins Today</h3>
          <p style={styles.statValue}>{analytics.checkInsToday}</p>
        </div>
      </div>
      
      {/* Charts Section */}
      <div style={styles.chartsSection}>
        <div style={styles.chartContainer}>
          <h3 style={styles.chartTitle}>Visitor Trends (Last 7 Days)</h3>
          <div style={styles.trendChart}>
            {analytics.visitorTrends.map((day, index) => (
              <div key={index} style={styles.trendBar}>
                <div 
                  style={{
                    ...styles.bar,
                    height: `${(day.count / Math.max(...analytics.visitorTrends.map(d => d.count))) * 100}%`
                  }}
                ></div>
                <span style={styles.barLabel}>{day.date}</span>
                <span style={styles.barValue}>{day.count}</span>
              </div>
            ))}
          </div>
        </div>
        
        <div style={styles.chartContainer}>
          <h3 style={styles.chartTitle}>Popular Visit Times</h3>
          <div style={styles.timeChart}>
            {analytics.popularTimes.map((time, index) => (
              <div key={index} style={styles.timeRow}>
                <span style={styles.timeLabel}>{time.hour}:00</span>
                <div style={styles.progressBarContainer}>
                  <div 
                    style={{
                      ...styles.progressBar,
                      width: `${(time.count / Math.max(...analytics.popularTimes.map(t => t.count))) * 100}%`
                    }}
                  ></div>
                </div>
                <span style={styles.timeCount}>{time.count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Host Activity */}
      <div style={styles.hostSection}>
        <h3 style={styles.sectionTitle}>Host Activity</h3>
        <div style={styles.hostGrid}>
          {analytics.hostActivity.map((host, index) => (
            <div key={index} style={styles.hostCard}>
              <h4 style={styles.hostName}>{host.name}</h4>
              <p style={styles.hostStats}>
                <span>Appointments: {host.appointments}</span>
                <span>Visitors: {host.visitors}</span>
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    padding: '20px',
    maxWidth: '1200px',
    margin: '0 auto',
  },
  title: {
    fontSize: '28px',
    fontWeight: 'bold',
    marginBottom: '30px',
    color: '#333',
  },
  loading: {
    textAlign: 'center',
    padding: '50px',
    fontSize: '18px',
    color: '#666',
  },
  error: {
    background: '#fee',
    color: '#c33',
    padding: '15px',
    borderRadius: '5px',
    textAlign: 'center',
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '20px',
    marginBottom: '30px',
  },
  statCard: {
    background: 'white',
    padding: '25px',
    borderRadius: '10px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
    textAlign: 'center',
  },
  statTitle: {
    fontSize: '16px',
    color: '#666',
    margin: '0 0 10px 0',
  },
  statValue: {
    fontSize: '32px',
    fontWeight: 'bold',
    color: '#333',
    margin: '0',
  },
  chartsSection: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '30px',
    marginBottom: '30px',
  },
  chartContainer: {
    background: 'white',
    padding: '25px',
    borderRadius: '10px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
  },
  chartTitle: {
    fontSize: '20px',
    fontWeight: 'bold',
    marginBottom: '20px',
    color: '#333',
  },
  trendChart: {
    display: 'flex',
    justifyContent: 'space-around',
    alignItems: 'flex-end',
    height: '200px',
    padding: '20px 0',
  },
  trendBar: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    flex: 1,
  },
  bar: {
    width: '30px',
    backgroundColor: '#667eea',
    borderRadius: '5px 5px 0 0',
    marginBottom: '10px',
  },
  barLabel: {
    fontSize: '12px',
    color: '#666',
  },
  barValue: {
    fontSize: '14px',
    fontWeight: 'bold',
    color: '#333',
  },
  timeChart: {
    display: 'flex',
    flexDirection: 'column',
    gap: '15px',
  },
  timeRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '15px',
  },
  timeLabel: {
    width: '50px',
    fontSize: '14px',
    color: '#666',
  },
  progressBarContainer: {
    flex: 1,
    height: '20px',
    backgroundColor: '#f0f0f0',
    borderRadius: '10px',
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#667eea',
    borderRadius: '10px',
  },
  timeCount: {
    width: '30px',
    fontSize: '14px',
    fontWeight: 'bold',
    color: '#333',
  },
  hostSection: {
    background: 'white',
    padding: '25px',
    borderRadius: '10px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
  },
  sectionTitle: {
    fontSize: '20px',
    fontWeight: 'bold',
    marginBottom: '20px',
    color: '#333',
  },
  hostGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '20px',
  },
  hostCard: {
    background: '#f8f9fa',
    padding: '20px',
    borderRadius: '8px',
    border: '1px solid #dee2e6',
  },
  hostName: {
    fontSize: '18px',
    fontWeight: 'bold',
    color: '#333',
    margin: '0 0 10px 0',
  },
  hostStats: {
    display: 'flex',
    flexDirection: 'column',
    gap: '5px',
    fontSize: '14px',
    color: '#666',
  },
};

export default AnalyticsDashboard;