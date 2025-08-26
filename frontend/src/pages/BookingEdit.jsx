import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/api';
import { useAuth } from '../context/AuthContext';
import { FaUser, FaEnvelope, FaUsers, FaCalendarAlt, FaArrowLeft, FaCheck, FaTimes, FaQuestionCircle } from 'react-icons/fa';

const BookingEdit = () => {
  const { token } = useAuth();
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', numberOfPeople: 1, date: '' });
  const [loading, setLoading] = useState(true);
  const [editable, setEditable] = useState(true); 
  const [message, setMessage] = useState('');
  const [successAlert, setSuccessAlert] = useState('');

  useEffect(() => {
    if (!token) {
      alert('You must be logged in');
      navigate('/login');
      return;
    }

    const fetchBooking = async () => {
      try {
        const res = await api.get(`/bookings/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const b = res.data;

        if (!b.user) {
          setEditable(false);
          setMessage('This booking has no user info. Editing is disabled.');
        }

        setForm({
          name: b.name || '',
          email: b.email || '',
          numberOfPeople: b.numberOfPeople || 1,
          date: b.date ? new Date(b.date).toISOString().split('T')[0] : '',
        });
      } catch (err) {
        console.error('Fetch booking error:', err);
        alert(err.response?.data?.message || 'Failed to load booking');
        navigate('/my-bookings');
      } finally {
        setLoading(false);
      }
    };

    fetchBooking();
  }, [id, navigate, token]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!editable) return;

    if (!form.name || !form.email || form.numberOfPeople <= 0 || !form.date) {
      alert('Please fill all fields correctly.');
      return;
    }
    try {
      await api.put(`/bookings/${id}`, form, { headers: { Authorization: `Bearer ${token}` } });
      setSuccessAlert('Booking updated successfully!');
      setTimeout(() => {
        navigate('/my-bookings');
      }, 1500);
    } catch (err) {
      console.error('Update booking error:', err);
      alert(err.response?.data?.message || 'Failed to update booking');
    }
  };

  const handleCancel = async () => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) return;
    try {
      await api.delete(`/bookings/${id}`, { headers: { Authorization: `Bearer ${token}` } });
      setSuccessAlert('Booking cancelled successfully!');
      setTimeout(() => {
        navigate('/my-bookings');
      }, 1500);
    } catch (err) {
      console.error('Cancel booking error:', err);
      alert(err.response?.data?.message || 'Failed to cancel booking');
    }
  };

  if (loading) return (
    <div className="d-flex justify-content-center align-items-center min-vh-100" style={{ backgroundColor: '#f8f9fa' }}>
      <div className="text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-3">Loading booking details...</p>
      </div>
    </div>
  );

  return (
    <div className="min-vh-100" style={{ backgroundColor: '#f8f9fa' }}>
      
      {successAlert && (
        <div className="alert alert-success alert-dismissible fade show m-3 position-fixed top-0 end-0" style={{zIndex: 9999}} role="alert">
          <FaCheck className="me-2" />
          {successAlert}
          <button type="button" className="btn-close" onClick={() => setSuccessAlert('')}></button>
        </div>
      )}
      
      
      <div className="py-4" style={{ backgroundColor: 'rgba(255, 255, 255, 0.9)', backdropFilter: 'blur(10px)' }}>
        <div className="container">
          <button className="btn btn-outline-primary mb-3" onClick={() => navigate('/my-bookings')}>
            <FaArrowLeft className="me-2" />
            Back to My Bookings
          </button>
          <h2 className="mb-0 text-dark">Edit Your Booking</h2>
        </div>
      </div>

      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-lg-8">
            <div className="card shadow border-0 overflow-hidden">
              
              <div className="card-header py-4" style={{ backgroundColor: 'rgba(13, 110, 253, 0.05)' }}>
                <h4 className="card-title mb-0 text-center text-dark">Booking Details</h4>
              </div>
              <div className="card-body p-4 p-md-5">
                {message && (
                  <div className="alert alert-warning" role="alert">
                    {message}
                  </div>
                )}
                
                <form onSubmit={handleUpdate}>
                  <div className="mb-4">
                    <label className="form-label fw-semibold text-dark">Name</label>
                    <div className="input-group">
                      <span className="input-group-text bg-light">
                        <FaUser className="text-primary" />
                      </span>
                      <input
                        type="text"
                        name="name"
                        className="form-control form-control-lg border-start-0"
                        value={form.name}
                        onChange={handleChange}
                        required
                        disabled={!editable}
                        placeholder="Enter your full name"
                      />
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <label className="form-label fw-semibold text-dark">Email</label>
                    <div className="input-group">
                      <span className="input-group-text bg-light">
                        <FaEnvelope className="text-primary" />
                      </span>
                      <input
                        type="email"
                        name="email"
                        className="form-control form-control-lg border-start-0"
                        value={form.email}
                        onChange={handleChange}
                        required
                        disabled={!editable}
                        placeholder="Enter your email address"
                      />
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <label className="form-label fw-semibold text-dark">Number of People</label>
                    <div className="input-group">
                      <span className="input-group-text bg-light">
                        <FaUsers className="text-primary" />
                      </span>
                      <input
                        type="number"
                        name="numberOfPeople"
                        min="1"
                        className="form-control form-control-lg border-start-0"
                        value={form.numberOfPeople}
                        onChange={handleChange}
                        required
                        disabled={!editable}
                      />
                    </div>
                  </div>
                  
                  <div className="mb-5">
                    <label className="form-label fw-semibold text-dark">Date</label>
                    <div className="input-group">
                      <span className="input-group-text bg-light">
                        <FaCalendarAlt className="text-primary" />
                      </span>
                      <input
                        type="date"
                        name="date"
                        className="form-control form-control-lg border-start-0"
                        value={form.date}
                        onChange={handleChange}
                        required
                        disabled={!editable}
                      />
                    </div>
                  </div>
                  
                  <div className="d-flex flex-column flex-md-row justify-content-between gap-3">
                    <button 
                      type="submit" 
                      className="btn btn-primary btn-lg flex-fill py-3"
                      disabled={!editable}
                    >
                      <FaCheck className="me-2" />
                      Update Booking
                    </button>
                    <button 
                      type="button" 
                      className="btn btn-outline-danger btn-lg flex-fill py-3"
                      onClick={handleCancel}
                    >
                      <FaTimes className="me-2" />
                      Cancel Booking
                    </button>
                  </div>
                </form>
              </div>
            </div>
            
            
            <div className="card mt-4 border-0 shadow-sm">
              <div className="card-body d-flex align-items-center">
                <FaQuestionCircle className="text-primary me-3 fs-4" />
                <div>
                  <h6 className="card-title mb-1">Need help?</h6>
                  <p className="card-text small mb-0">
                    Contact our support team at support@travelia.com or call us at (800) 555-0123
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingEdit;