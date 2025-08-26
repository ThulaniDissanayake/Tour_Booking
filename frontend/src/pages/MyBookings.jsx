import React, { useEffect, useState } from 'react';
import api from '../api/api';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const MyBookings = () => {
  const { token } = useAuth();
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) return;

    const fetchBookings = async () => {
      try {
        const res = await api.get('/bookings/my', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setBookings(res.data);
      } catch (err) {
        console.error('Fetch bookings error:', err);
        alert(err.response?.data?.message || 'Failed to fetch bookings');
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [token]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return isNaN(date) ? 'Invalid Date' : date.toDateString();
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this booking?')) return;

    try {
      await api.delete(`/bookings/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBookings((prev) => prev.filter((b) => b._id !== id));
      alert('Booking deleted successfully');
    } catch (err) {
      console.error('Delete booking error:', err);
      alert(err.response?.data?.message || 'Failed to delete booking');
    }
  };

  const handleEdit = (id) => {
    navigate(`/bookings/${id}/edit`);
  };

  if (loading) return <p className="text-center mt-5">Loading bookings...</p>;

  if (!bookings.length)
    return <div className="alert alert-warning text-center">No bookings found.</div>;

  return (
    <div className="container mt-5" style={{ maxWidth: '700px' }}>
      <h2 className="mb-4">Booking History</h2>
      {bookings.map((b) => (
        <div key={b._id} className="card mb-3 shadow-sm position-relative" style={{ borderLeft: '5px solid #007bff', backgroundColor: '#f8f9fa' }}>
          {/* Delete button */}
          <button
            onClick={() => handleDelete(b._id)}
            style={{ position: 'absolute', top: '8px', right: '12px', border: 'none', background: 'transparent', color: '#dc3545', fontWeight: 'bold', fontSize: '20px', cursor: 'pointer' }}
            title="Delete booking"
          >
            &times;
          </button>

          {/* Edit button */}
          <button
            onClick={() => handleEdit(b._id)}
            style={{ position: 'absolute', top: '8px', right: '48px', border: 'none', background: 'transparent', color: '#007bff', fontWeight: 'bold', fontSize: '20px', cursor: 'pointer' }}
            title="Edit booking"
          >
            ✎
          </button>

          {b.tour?.image && <img src={b.tour.image} alt={b.tour.title} className="card-img-top" style={{ height: '180px', objectFit: 'cover' }} />}
          <div className="card-body">
            <h5 className="card-title" style={{ color: '#007bff' }}>{b.tour?.title}</h5>
            <p className="card-text"><strong>Date:</strong> {formatDate(b.date)}</p>
            <p className="card-text text-muted" style={{ fontSize: '14px' }}>Booking ID: {b._id}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default MyBookings;
