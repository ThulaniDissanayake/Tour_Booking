import React, { useEffect, useState } from 'react';
import api from '../api/api';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const MyBookings = () => {
  const { token } = useAuth();
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!token) return;

    const fetchBookings = async () => {
      setLoading(true);
      try {
        const res = await api.get('/bookings/my', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setBookings(res.data);
      } catch (error) {
        alert('Failed to fetch bookings');
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

    if (!id || typeof id !== 'string' || id.trim().length !== 24) {
      alert('Invalid booking ID');
      return;
    }

    const cleanId = id.trim();

    try {
      await api.delete(`/bookings/${cleanId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setBookings((prev) => prev.filter((b) => b._id !== cleanId));

      alert('Booking deleted successfully');
    } catch (error) {
      // Show detailed error from server if available
      const serverMsg =
        error.response?.data?.message || error.message || 'Failed to delete booking';
      alert(serverMsg);
      console.error('Delete error:', error);
    }
  };

  const handleEdit = (id) => {
    navigate(`/bookings/${id}/edit`);
  };

  return (
    <div className="container mt-5" style={{ maxWidth: '700px' }}>
      <h2
        className="mb-4"
        style={{
          color: '#212529',
          fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
          fontWeight: '600',
          letterSpacing: '0.5px',
          borderBottom: '2px solid #e9ecef',
          paddingBottom: '10px',
        }}
      >
        Booking History
      </h2>

      {loading && <p>Loading bookings...</p>}

      {!loading && bookings.length === 0 && (
        <div className="alert alert-warning text-center" role="alert">
          No bookings found.
        </div>
      )}

      {!loading &&
        bookings.map((b) => (
          <div
            key={b._id}
            className="card mb-3 shadow-sm position-relative"
            style={{
              borderLeft: '5px solid #007bff',
              backgroundColor: '#f8f9fa',
            }}
          >
            {/* Delete button */}
            <button
              onClick={() => handleDelete(b._id)}
              style={{
                position: 'absolute',
                top: '8px',
                right: '12px',
                border: 'none',
                background: 'transparent',
                color: 'white',
                fontWeight: 'bold',
                fontSize: '20px',
                cursor: 'pointer',
                lineHeight: '1',
                padding: '0',
                userSelect: 'none',
              }}
              aria-label="Delete booking"
              title="Delete booking"
            >
              &times;
            </button>

            {/* Edit button */}
            <button
              onClick={() => handleEdit(b._id)}
              style={{
                position: 'absolute',
                top: '8px',
                right: '48px',
                border: 'none',
                background: 'transparent',
                color: 'white',
                fontWeight: 'bold',
                fontSize: '20px',
                cursor: 'pointer',
                lineHeight: '1',
                padding: '0',
                userSelect: 'none',
              }}
              aria-label="Edit booking"
              title="Edit booking"
            >
              ✎
            </button>

            {b.tour?.image && (
              <img
                src={b.tour.image}
                alt={b.tour.title}
                className="card-img-top"
                style={{ height: '180px', objectFit: 'cover' }}
              />
            )}
            <div className="card-body">
              <h5 className="card-title" style={{ color: '#007bff' }}>
                {b.tour?.title}
              </h5>
              <p className="card-text">
                <strong>Date:</strong> {formatDate(b.date)}
              </p>
              <p className="card-text text-muted" style={{ fontSize: '14px' }}>
                Booking ID: {b._id}
              </p>
            </div>
          </div>
        ))}
    </div>
  );
};

export default MyBookings;
