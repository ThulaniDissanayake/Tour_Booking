import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/api';
import { useAuth } from '../context/AuthContext';

const BookingEdit = () => {
  const { token } = useAuth();
  const { id } = useParams();
  const navigate = useNavigate();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    name: '',
    email: '',
    numberOfPeople: 1,
    date: '',
  });

  useEffect(() => {
    if (!token) {
      alert('You must be logged in');
      navigate('/login');
      return;
    }

    const fetchBooking = async () => {
      try {
        const res = await api.get(`/bookings/${id.trim()}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setBooking(res.data);
        setForm({
          name: res.data.name,
          email: res.data.email,
          numberOfPeople: res.data.numberOfPeople,
          date: new Date(res.data.date).toISOString().split('T')[0],
        });
      } catch {
        alert('Failed to load booking');
        navigate('/my-bookings');
      } finally {
        setLoading(false);
      }
    };
    fetchBooking();
  }, [id, navigate, token]);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleUpdate = async (e) => {
    e.preventDefault();

    if (!form.name || !form.email || form.numberOfPeople <= 0 || !form.date) {
      alert('Please fill all fields correctly.');
      return;
    }

    try {
      await api.put(`/bookings/${id.trim()}`, form, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert('Booking updated successfully');
      navigate('/my-bookings');
    } catch {
      alert('Failed to update booking');
    }
  };

  const handleCancel = async () => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) return;
    try {
      await api.delete(`/bookings/${id.trim()}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert('Booking cancelled');
      navigate('/my-bookings');
    } catch {
      alert('Failed to cancel booking');
    }
  };

  if (loading) return <p>Loading booking details...</p>;

  return (
    <div className="container mt-5" style={{ maxWidth: '500px' }}>
      <h2>Edit Booking</h2>
      <form onSubmit={handleUpdate}>
        <div className="mb-3">
          <label>Name:</label>
          <input
            className="form-control"
            name="name"
            value={form.name}
            onChange={handleChange}
            required
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
          />
        </div>

        <button type="submit" className="btn btn-primary me-2">
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
