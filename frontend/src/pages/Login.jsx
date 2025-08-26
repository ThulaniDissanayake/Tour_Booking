import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/api';

const Login = () => {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (submitting) return;
    setSubmitting(true);

    try {
      const res = await api.post('/auth/login', { email, password });

      
      const token = res?.data?.token ?? res?.data?.accessToken;
      const user = res?.data?.user;

      if (!token || !user) {
        throw new Error('Login response missing token or user');
      }

      
      login(user, token);

      
      api.defaults.headers.common.Authorization = `Bearer ${token}`;

      navigate('/');
    } catch (err) {
      console.error('Login error:', err);
      alert('Login failed. Please check your credentials.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container-fluid vh-100 p-0">
      <div className="row g-0 h-100">
       
        <div className="col-md-6 d-none d-md-block">
          <div 
            className="h-100 d-flex flex-column justify-content-center align-items-center p-5"
            style={{
              backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(https://images.unsplash.com/photo-1503220317375-aaad61436b1b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80)',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              color: 'white'
            }}
          >
            <h1 className="display-4 fw-bold mb-4">Travesia Tours</h1>
            <p className="lead text-center">
              "Travel is the only purchase that enriches you in ways beyond material wealth"
            </p>
          </div>
        </div>

        
        <div className="col-md-6 d-flex align-items-center justify-content-center">
          <div className="w-100 p-4" style={{ maxWidth: '400px' }}>
            <h2 className="text-center mb-4">Welcome</h2>
            <p className="text-center mb-4">Login with Email</p>
            
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label htmlFor="email" className="form-label">Email</label>
                <input
                  type="email"
                  className="form-control"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter email"
                  required
                  autoComplete="username"
                />
              </div>
              
              <div className="mb-3">
                <label htmlFor="password" className="form-label">Password</label>
                <input
                  type="password"
                  className="form-control"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password"
                  required
                  autoComplete="current-password"
                />
              </div>
              
              <div className="mb-3 text-end">
                <a href="/forgot-password" className="text-decoration-none">Forgot your password?</a>
              </div>
              
              <button 
                type="submit" 
                className="btn btn-primary w-100 py-2 mb-3" 
                disabled={submitting}
              >
                {submitting ? 'Logging in...' : 'LOGIN'}
              </button>
              
              <div className="text-center mb-3">
                <span className="text-muted">OR</span>
              </div>
              
              <div className="text-center">
                <span className="text-muted">Don't have account? </span>
                <a href="/register" className="text-decoration-none">Register Now</a>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;