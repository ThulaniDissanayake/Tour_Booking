import React, { useEffect, useState } from 'react';
import api from '../api/api';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const MyBookings = () => {
  const { token } = useAuth();
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);

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
    return isNaN(date) ? 'Invalid Date' : date.toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this booking?')) return;
    
    setDeletingId(id);
    try {
      await api.delete(`/bookings/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBookings((prev) => prev.filter((b) => b._id !== id));
      alert('Booking deleted successfully');
    } catch (err) {
      console.error('Delete booking error:', err);
      alert(err.response?.data?.message || 'Failed to delete booking');
    } finally {
      setDeletingId(null);
    }
  };

  const handleEdit = (id) => {
    navigate(`/bookings/${id}/edit`);
  };

  if (loading) {
    return (
      <div className="container mt-5" style={{ maxWidth: '800px' }}>
        <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '50vh' }}>
          <div className="text-center">
            <div className="spinner-border text-primary" style={{ width: '3rem', height: '3rem' }} role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-3 text-muted">Loading your bookings...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!bookings.length) {
    return (
      <div className="container mt-5" style={{ maxWidth: '800px' }}>
        <div className="text-center py-5">
          <div className="mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" fill="currentColor" className="bi bi-calendar-x text-muted" viewBox="0 0 16 16">
              <path d="M6.146 7.146a.5.5 0 0 1 .708 0L8 8.293l1.146-1.147a.5.5 0 1 1 .708.708L8.707 9l1.147 1.146a.5.5 0 0 1-.708.708L8 9.707l-1.146 1.147a.5.5 0 0 1-.708-.708L7.293 9 6.146 7.854a.5.5 0 0 1 0-.708z"/>
              <path d="M3.5 0a.5.5 0 0 1 .5.5V1h8V.5a.5.5 0 0 1 1 0V1h1a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h1V.5a.5.5 0 0 1 .5-.5zM1 4v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V4H1z"/>
            </svg>
          </div>
          <h3 className="mb-3">No bookings yet</h3>
          <p className="text-muted mb-4">It looks like you haven't made any bookings yet.</p>
          <button 
            className="btn btn-primary"
            onClick={() => navigate('/tours')}
          >
            Browse Tours
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-4 mb-5" style={{ maxWidth: '800px' }}>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="mb-0">Booking History</h2>
        <span className="badge bg-primary rounded-pill">{bookings.length} booking{bookings.length !== 1 ? 's' : ''}</span>
      </div>
      
      <div className="row">
        {bookings.map((b) => (
          <div key={b._id} className="col-12 mb-4">
            <div className="card shadow-sm border-0 overflow-hidden">
              <div className="row g-0">
                {b.tour?.image && (
                  <div className="col-md-4">
                    <img 
                      src={b.tour.image} 
                      alt={b.tour.title} 
                      className="img-fluid h-100" 
                      style={{ objectFit: 'cover', minHeight: '200px' }} 
                    />
                  </div>
                )}
                <div className={b.tour?.image ? "col-md-8" : "col-12"}>
                  <div className="card-body position-relative">
                    <div className="d-flex justify-content-between align-items-start mb-2">
                      <h5 className="card-title text-primary mb-0">{b.tour?.title}</h5>
                      <div className="d-flex">
                        <button
                          onClick={() => handleEdit(b._id)}
                          className="btn btn-sm btn-outline-primary me-2"
                          title="Edit booking"
                          disabled={deletingId === b._id}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-pencil" viewBox="0 0 16 16">
                            <path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168l10-10zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207 11.207 2.5zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293l6.5-6.5zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325z"/>
                          </svg>
                        </button>
                        <button
                          onClick={() => handleDelete(b._id)}
                          className="btn btn-sm btn-outline-danger"
                          title="Delete booking"
                          disabled={deletingId === b._id}
                        >
                          {deletingId === b._id ? (
                            <div className="spinner-border spinner-border-sm" role="status">
                              <span className="visually-hidden">Deleting...</span>
                            </div>
                          ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-trash" viewBox="0 0 16 16">
                              <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5Zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5Zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6Z"/>
                              <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1ZM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118ZM2.5 3h11V2h-11v1Z"/>
                            </svg>
                          )}
                        </button>
                      </div>
                    </div>
                    
                    <div className="d-flex align-items-center mb-2">
                      <span className="badge bg-light text-dark me-2">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-calendar me-1" viewBox="0 0 16 16">
                          <path d="M3.5 0a.5.5 0 0 1 .5.5V1h8V.5a.5.5 0 0 1 1 0V1h1a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h1V.5a.5.5 0 0 1 .5-.5zM1 4v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V4H1z"/>
                        </svg>
                        {formatDate(b.date)}
                      </span>
                      <span className="badge bg-info text-dark">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-people me-1" viewBox="0 0 16 16">
                          <path d="M15 14s1 0 1-1-1-4-5-4-5 3-5 4 1 1 1 1h8Zm-7.978-1A.261.261 0 0 1 7 12.996c.001-.264.167-1.03.76-1.72C8.312 10.629 9.282 10 11 10c1.717 0 2.687.63 3.24 1.276.593.69.758 1.457.76 1.72l-.008.002a.274.274 0 0 1-.014.002H7.022ZM11 7a2 2 0 1 0 0-4 2 2 0 0 0 0 4Zm3-2a3 3 0 1 1-6 0 3 3 0 0 1 6 0ZM6.936 9.28a5.88 5.88 0 0 0-1.23-.247A7.35 7.35 0 0 0 5 9c-4 0-5 3-5 4 0 .667.333 1 1 1h4.216A2.238 2.238 0 0 1 5 13c0-1.01.377-2.042 1.09-2.904.243-.294.526-.569.846-.816ZM4.92 10A5.493 5.493 0 0 0 4 13H1c0-.26.164-1.03.76-1.724.545-.636 1.492-1.256 3.16-1.275ZM1.5 5.5a3 3 0 1 1 6 0 3 3 0 0 1-6 0Zm3-2a2 2 0 1 0 0 4 2 2 0 0 0 0-4Z"/>
                        </svg>
                        {b.guests || 1} guest{b.guests > 1 ? 's' : ''}
                      </span>
                    </div>
                    
                    <p className="text-muted small mb-0">Booking ID: {b._id}</p>
                    
                    {b.status && (
                      <div className="position-absolute top-0 end-0 m-3">
                        <span className={`badge ${b.status === 'confirmed' ? 'bg-success' : 'bg-warning'} rounded-pill`}>
                          {b.status.charAt(0).toUpperCase() + b.status.slice(1)}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyBookings;