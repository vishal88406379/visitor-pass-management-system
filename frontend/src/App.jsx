import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import VisitorRegister from './pages/visitors/Register';
import VisitorRegisterEnhanced from './pages/visitors/RegisterEnhanced';
import VisitorRegisterWithOTP from './pages/visitors/RegisterWithOTP';
import CheckIn from './pages/CheckIn';
import CheckInEnhanced from './pages/CheckInEnhanced';
import CreateAppointment from './pages/appointments/Create';
import PassView from './pages/PassView';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/visitors/register"
            element={
              <ProtectedRoute>
                <VisitorRegisterEnhanced />
              </ProtectedRoute>
            }
          />
          <Route
            path="/checkin"
            element={
              <ProtectedRoute>
                <CheckInEnhanced />
              </ProtectedRoute>
            }
          />
          <Route
            path="/appointments/create"
            element={
              <ProtectedRoute>
                <CreateAppointment />
              </ProtectedRoute>
            }
          />
          <Route
            path="/passes/:id"
            element={
              <ProtectedRoute>
                <PassView />
              </ProtectedRoute>
            }
          />
          <Route
            path="/visitors/register-otp"
            element={
              <ProtectedRoute>
                <VisitorRegisterWithOTP />
              </ProtectedRoute>
            }
          />
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
