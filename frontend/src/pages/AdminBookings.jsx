import React, { useEffect, useState } from 'react';
import api from '../api/api'; 
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const backgroundImageUrl = 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e';

const AdminBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const fetchBookings = async () => {
    try {
      const res = await api.get('/bookings'); 
      setBookings(res.data);
    } catch (error) {
      alert('Failed to fetch bookings');
      console.error('Fetch bookings error:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  // Filter bookings by user name 
  const filteredBookings = bookings.filter((b) =>
    b.name?.toLowerCase().includes(search.toLowerCase())
  );

  // CSV Download
  const downloadCSV = () => {
    const header = ['Tour', 'User', 'Email', 'Date', 'People'];
    const rows = filteredBookings.map((b) => [
      `"${b.tour?.title || 'N/A'}"`,
      `"${b.name || 'N/A'}"`,
      `"${b.email || 'N/A'}"`,
      `"${b.date ? new Date(b.date).toLocaleDateString() : 'Invalid Date'}"`,
      `"${b.numberOfPeople || 1}"`,
    ]);
    const csvContent = [header.join(','), ...rows.map((r) => r.join(','))].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'bookings.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // PDF Download
  const downloadPDF = () => {
    const doc = new jsPDF();
    doc.text('All Bookings Report', 14, 10);

    autoTable(doc, {
      head: [['Tour', 'User', 'Email', 'Date', 'People']],
      body: filteredBookings.map((b) => [
        b.tour?.title || 'N/A',
        b.name || 'N/A',
        b.email || 'N/A',
        b.date ? new Date(b.date).toLocaleDateString() : 'Invalid Date',
        b.numberOfPeople || 1,
      ]),
    });

    doc.save('bookings.pdf');
  };

  // Delete booking (admin only)
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this booking?')) return;

    try {
      await api.delete(`/bookings/${id}`);
      setBookings((prev) => prev.filter((b) => b._id !== id));
      alert('Booking deleted successfully');
    } catch (error) {
      alert('Failed to delete booking');
      console.error('Delete booking error:', error);
    }
  };

  if (loading) return <p className="text-center mt-5">Loading bookings...</p>;

  return (
    <div
      className="container mt-5 pb-5"
      style={{
        minHeight: '100vh',
        backgroundImage: `url(${backgroundImageUrl})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        color: 'white',
      }}
    >
      <div
        style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '50px', marginBottom: '20px' }}
      >
        <button className="btn btn-success me-2" onClick={downloadCSV}>
          Download CSV
        </button>
        <button className="btn btn-primary" onClick={downloadPDF}>
          Download PDF
        </button>
      </div>

      <input
        type="text"
        placeholder="Search by user name..."
        className="form-control mb-4"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{ maxWidth: '400px' }}
      />

      {filteredBookings.length === 0 ? (
        <p>No bookings found.</p>
      ) : (
        <div className="row g-4">
          {filteredBookings.map((b) => (
            <div className="col-md-4" key={b._id}>
              <div
                className="card shadow-sm h-100 border-0 position-relative"
                style={{
                  backgroundColor: 'rgba(0, 0, 0, 0.55)', // semi-transparent black
                  color: 'white',
                }}
              >
                <button
                  onClick={() => handleDelete(b._id)}
                  title="Delete booking"
                  style={{
                    position: 'absolute',
                    top: '20px',
                    right: '8px',
                    background: 'transparent',
                    border: 'none',
                    color: 'white',
                    fontSize: '20px',
                    fontWeight: 'bold',
                    lineHeight: 1,
                    cursor: 'pointer',
                    padding: 0,
                    width: '24px',
                    height: '24px',
                    textAlign: 'center',
                    userSelect: 'none',
                  }}
                >
                  ×
                </button>
                <div className="card-body d-flex flex-column">
                  <h5 className="card-title" style={{ color: '#00bfff' }}>
                    {b.tour?.title || 'N/A'}
                  </h5>
                  <p className="mb-1">
                    <strong>User:</strong> {b.name || 'N/A'} ({b.email || 'N/A'})
                  </p>
                  <p className="mb-1">
                    <strong>Date:</strong> {b.date ? new Date(b.date).toLocaleDateString() : 'Invalid Date'}
                  </p>
                  <p className="mb-3">
                    <strong>People:</strong> {b.numberOfPeople || 1}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminBookings;
