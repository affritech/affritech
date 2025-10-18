import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, ArrowLeft, BookOpen } from 'lucide-react';

const Login = ({ onLogin }) => {
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    const success = onLogin(password);

    if (success) {
      navigate('/admin');
    } else {
      setError('Invalid password. Please try again.');
      setPassword('');
    }

    setLoading(false);
  };

  const handleBack = () => {
    navigate('/');
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <button className="btn-back-simple" onClick={handleBack}>
          <ArrowLeft size={18} />
          Back to Home
        </button>

        <div className="login-card">
          <div className="login-header">
            <div className="login-icon">
              <Lock size={32} />
            </div>
            <h1>Admin Login</h1>
            <p>Enter your password to access the admin dashboard</p>
          </div>

          <form onSubmit={handleSubmit} className="login-form">
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter admin password"
                required
                autoFocus
                disabled={loading}
              />
            </div>

            {error && (
              <div className="error-message">
                {error}
              </div>
            )}

            <button
              type="submit"
              className="btn-primary btn-full"
              disabled={loading}
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>

          <div className="login-footer">
            <p className="text-muted">
              <BookOpen size={16} />
              Notebook Platform Admin
            </p>
          </div>
        </div>

        {/* Demo Info - Remove in production */}
        <div className="demo-info">
          <p>
            <strong>Contact Admin:</strong> +254725693306
          </p>
          <small></small>
        </div>
      </div>
    </div>
  );
};

export default Login;