import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/api';
import { useAuth } from '../context/AuthContext';

const BookingEdit = () => {
  const { token } = useAuth();
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', numberOfPeople: 1, date: '' });
  const [loading, setLoading] = useState(true);
  const [editable, setEditable] = useState(true); 
  const [message, setMessage] = useState('');

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
      alert('Booking updated successfully');
      navigate('/my-bookings');
    } catch (err) {
      console.error('Update booking error:', err);
      alert(err.response?.data?.message || 'Failed to update booking');
    }
  };

  const handleCancel = async () => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) return;
    try {
      await api.delete(`/bookings/${id}`, { headers: { Authorization: `Bearer ${token}` } });
      alert('Booking cancelled');
      navigate('/my-bookings');
    } catch (err) {
      console.error('Cancel booking error:', err);
      alert(err.response?.data?.message || 'Failed to cancel booking');
    }
  };

  if (loading) return <p>Loading booking details...</p>;

  return (
    <div className="container mt-5" style={{ maxWidth: '500px' }}>
      <h2>Change Your Booking Details</h2>
      {message && <p className="text-warning">{message}</p>}
      <form onSubmit={handleUpdate}>
        <div className="mb-3">
          <label>Name:</label>
          <input
            className="form-control"
            name="name"
            value={form.name}
            onChange={handleChange}
            required
            disabled={!editable}
          />
        </div>
        <div className="mb-3">
          <label>Email:</label>
          <input
            className="form-control"
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            required
            disabled={!editable}
          />
        </div>
        <div className="mb-3">
          <label>Number of People:</label>
          <input
            className="form-control"
            name="numberOfPeople"
            type="number"
            min="1"
            value={form.numberOfPeople}
            onChange={handleChange}
            required
            disabled={!editable}
          />
        </div>
        <div className="mb-3">
          <label>Date:</label>
          <input
            className="form-control"
            name="date"
            type="date"
            value={form.date}
            onChange={handleChange}
            required
            disabled={!editable}
          />
        </div>
        <button type="submit" className="btn btn-primary me-2" disabled={!editable}>
          Update Booking
        </button>
        <button type="button" className="btn btn-danger" onClick={handleCancel}>
          Cancel Booking
        </button>
      </form>
    </div>
  );
};

export default BookingEdit;
