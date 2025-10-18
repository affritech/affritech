import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import NoteView from './pages/NoteView';
import AdminDashboard from './pages/AdminDashboard';
import Login from './pages/Login';
import './App.css';
import './App-Enhanced.css'

function App() {
  const [isAdmin, setIsAdmin] = useState(false);

  // Check if user is authenticated as admin
  useEffect(() => {
    const adminAuth = localStorage.getItem('adminAuth');
    if (adminAuth === 'true') {
      setIsAdmin(true);
    }
  }, []);

  const handleLogin = (password) => {
    // Simple password check (in production, use proper authentication!)
    const ADMIN_PASSWORD = 'Africa'; // Change this!
    
    if (password === ADMIN_PASSWORD) {
      setIsAdmin(true);
      localStorage.setItem('adminAuth', 'true');
      return true;
    }
    return false;
  };

  const handleLogout = () => {
    setIsAdmin(false);
    localStorage.removeItem('adminAuth');
  };

  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home isAdmin={isAdmin} onLogout={handleLogout} />} />
          <Route path="/notebook/:id" element={<NoteView isAdmin={isAdmin} />} />
          
          {/* Admin Routes */}
          <Route
            path="/admin/login"
            element={
              isAdmin ? (
                <Navigate to="/admin" replace />
              ) : (
                <Login onLogin={handleLogin} />
              )
            }
          />
          <Route
            path="/admin"
            element={
              isAdmin ? (
                <AdminDashboard onLogout={handleLogout} />
              ) : (
                <Navigate to="/admin/login" replace />
              )
            }
          />
          
          {/* 404 */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;