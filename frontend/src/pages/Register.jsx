import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/api';

const Register = () => {
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'user' });
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (submitting) return;
    setSubmitting(true);

    try {
      await api.post('/auth/register', form);
      alert('Registered successfully');
      navigate('/login');
    } catch (err) {
      alert('Registration failed');
      console.error('Registration error:', err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container-fluid vh-100 p-0">
      <div className="row g-0 h-100">
        {/* Left side with travel image and quote */}
        <div className="col-md-6 d-none d-md-block">
          <div
            className="h-100 d-flex flex-column justify-content-center align-items-center p-5"
            style={{
              backgroundImage:
                'linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(https://images.unsplash.com/photo-1503220317375-aaad61436b1b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80)',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              color: 'white',
            }}
          >
            <h1 className="display-4 fw-bold mb-4">Travesia Tours</h1>
            <p className="lead text-center">
              "Travel is the only purchase that enriches you in ways beyond material wealth"
            </p>
          </div>
        </div>

        {/* Right side with registration form */}
        <div className="col-md-6 d-flex align-items-center justify-content-center">
          <div className="w-100 p-4" style={{ maxWidth: '400px' }}>
            <h2 className="text-center mb-4">Create an Account</h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label htmlFor="name" className="form-label">
                  Full Name
                </label>
                <input
                  id="name"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Enter your name"
                  required
                  className="form-control"
                  autoComplete="name"
                />
              </div>

              <div className="mb-3">
                <label htmlFor="email" className="form-label">
                  Email Address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  required
                  className="form-control"
                  autoComplete="username"
                />
              </div>

              <div className="mb-4">
                <label htmlFor="password" className="form-label">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  required
                  className="form-control"
                  autoComplete="new-password"
                />
              </div>

              {/* Role selection */}
              <div className="mb-4">
                <label htmlFor="role" className="form-label">
                  Register as
                </label>
                <select
                  id="role"
                  name="role"
                  className="form-select"
                  value={form.role}
                  onChange={handleChange}
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
              </div>

              <button
                type="submit"
                className="btn btn-primary w-100 py-2 mb-3"
                disabled={submitting}
              >
                {submitting ? 'Registering...' : 'REGISTER'}
              </button>

              <div className="text-center mb-3">
                <span className="text-muted">OR</span>
              </div>

              <div className="text-center">
                <span className="text-muted">Already have an account? </span>
                <a href="/login" className="text-decoration-none">
                  Login Here
                </a>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
