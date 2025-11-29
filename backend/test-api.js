/**
 * Simple API test script
 * Tests if the backend server can start without MongoDB
 */

const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Basic route
app.get('/', (req, res) => {
  res.json({ 
    message: 'Visitor Pass Management System API - Test Mode',
    status: 'Server is running',
    timestamp: new Date().toISOString()
  });
});

// Mock auth route
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  
  // Mock response
  res.json({
    success: true,
    data: {
      user: {
        id: '1',
        email: email,
        firstName: 'Test',
        lastName: 'User',
        role: 'admin'
      },
      token: 'mock-jwt-token-' + Date.now()
    }
  });
});

// Mock passes route
app.get('/api/passes/:id', (req, res) => {
  res.json({
    success: true,
    data: {
      id: req.params.id,
      passNumber: 'PASS-TEST-001',
      visitor: {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        company: 'Test Corp'
      },
      appointment: {
        purpose: 'Test Visit',
        scheduledDate: new Date().toISOString(),
        scheduledTime: '10:00 AM'
      },
      validFrom: new Date().toISOString(),
      validUntil: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      issuedBy: {
        firstName: 'Admin',
        lastName: 'User',
        email: 'admin@example.com'
      },
      qrCodeImage: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAASwAAACCCAMAAADQNkiAAAAA1BMVEW10NBjBBbqAAAAH0lEQVRo3u3BAQ0AAADCoPdPbQ43oAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAIBLcQ8AAa0jZQAAAABJRU5ErkJggg=='
    }
  });
});

// Mock badge download
app.get('/api/passes/:id/badge', (req, res) => {
  // Send a simple PDF-like response
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `attachment; filename=pass-${req.params.id}.pdf`);
  res.send('Mock PDF content for pass ' + req.params.id);
});

// Start server
const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
  console.log(`🚀 Test server running on port ${PORT}`);
  console.log(`📋 Test endpoints:`);
  console.log(`   GET  http://localhost:${PORT}/`);
  console.log(`   POST http://localhost:${PORT}/api/auth/login`);
  console.log(`   GET  http://localhost:${PORT}/api/passes/123`);
  console.log(`   GET  http://localhost:${PORT}/api/passes/123/badge`);
  console.log(`\n📝 Note: This is a test server without database connectivity`);
});