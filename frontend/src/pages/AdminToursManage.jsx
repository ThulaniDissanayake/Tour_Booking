import React, { useEffect, useState } from 'react';
import api from '../api/api';
import { useAuth } from '../context/AuthContext';
import { FaCheck } from 'react-icons/fa';

const AdminToursManage = () => {
  const { token } = useAuth();
  const [tours, setTours] = useState([]);
  const [form, setForm] = useState({
    title: '',
    description: '',
    price: '',
    image: '',
  });
  const [editingTourId, setEditingTourId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [successAlert, setSuccessAlert] = useState('');

  
  useEffect(() => {
    if (token) fetchTours();
  }, [token]);

  // Fetch all tours
  const fetchTours = async () => {
    try {
      setLoading(true);
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const response = await api.get('/tours', config);
      setTours(response.data);
    } catch (error) {
      console.error('Error fetching tours:', error);
      alert('Failed to fetch tours. Make sure you are logged in as admin.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Handle create or update
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!token) return alert('You must be logged in as admin.');
    try {
      const config = { headers: { Authorization: `Bearer ${token}` } };

      if (editingTourId) {
        await api.put(`/tours/${editingTourId}`, form, config);
        setEditingTourId(null);
        setSuccessAlert('Tour updated successfully!');
      } else {
        await api.post('/tours', form, config);
        setSuccessAlert('Tour created successfully!');
      }

      setForm({ title: '', description: '', price: '', image: '' });
      fetchTours();
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccessAlert('');
      }, 3000);
    } catch (error) {
      console.error('Error saving tour:', error);
      alert('Failed to save tour. Make sure you are logged in as admin.');
    }
  };

  
  const handleEdit = (tour) => {
    setForm({
      title: tour.title,
      description: tour.description,
      price: tour.price,
      image: tour.image || '',
    });
    setEditingTourId(tour._id);
  };

  // Delete tour
  const handleDelete = async (id) => {
    if (!token) return alert('You must be logged in as admin.');
    if (!window.confirm('Are you sure you want to delete this tour?')) return;

    try {
      const config = { headers: { Authorization: `Bearer ${token}` } };
      await api.delete(`/tours/${id}`, config);
      setSuccessAlert('Tour deleted successfully!');
      fetchTours();
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccessAlert('');
      }, 3000);
    } catch (error) {
      console.error('Error deleting tour:', error);
      alert('Failed to delete tour.');
    }
  };

  // Styles
  const styles = {
    wrapper: { position: 'relative', minHeight: '100vh', overflow: 'hidden', fontFamily: 'Segoe UI, sans-serif' },
    background: { position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', backgroundImage: 'url("https://images.unsplash.com/photo-1507525428034-b723cf961d3e")', backgroundSize: 'cover', backgroundPosition: 'center', zIndex: -1 },
    container: { position: 'relative', padding: '40px', color: '#333' },
    heading: { fontSize: '30px', marginBottom: '25px', color: '#fff', textShadow: '0 1px 3px rgba(0,0,0,0.6)' },
    formGlass: { background: 'rgba(255, 255, 255, 0.4)', backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)', borderRadius: '16px', padding: '25px', boxShadow: '0 8px 24px rgba(0,0,0,0.2)', maxWidth: '600px', marginBottom: '50px', border: '1px solid rgba(255,255,255,0.3)' },
    inputGroup: { marginBottom: '15px' },
    label: { display: 'block', fontWeight: 'bold', marginBottom: '5px', color: '#000' },
    input: { width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ccc' },
    button: { backgroundColor: '#007bff', color: '#fff', padding: '10px 20px', border: 'none', borderRadius: '8px', cursor: 'pointer' },
    cardGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' },
    card: { backgroundColor: '#fff', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', overflow: 'hidden', display: 'flex', flexDirection: 'column' },
    cardImage: { width: '100%', height: '180px', objectFit: 'cover' },
    cardBody: { padding: '15px' },
    cardTitle: { fontSize: '20px', marginBottom: '8px' },
    cardText: { fontSize: '14px', color: '#555' },
    cardPrice: { fontWeight: 'bold', marginTop: '10px', color: '#007bff' },
    cardActions: { marginTop: '15px', display: 'flex', gap: '10px' },
    btnSecondary: { padding: '6px 12px', border: '1px solid #007bff', borderRadius: '5px', background: '#fff', color: '#007bff', cursor: 'pointer' },
    btnDanger: { padding: '6px 12px', border: '1px solid #dc3545', borderRadius: '5px', background: '#fff', color: '#dc3545', cursor: 'pointer' },
  };

  return (
    <div style={styles.wrapper}>
      <div style={styles.background} />
      
      {/* Success Alert */}
      {successAlert && (
        <div className="alert alert-success alert-dismissible fade show m-3 position-fixed top-0 end-0" style={{zIndex: 9999}} role="alert">
          <FaCheck className="me-2" />
          {successAlert}
          <button type="button" className="btn-close" onClick={() => setSuccessAlert('')}></button>
        </div>
      )}
      
      <div style={styles.container}>
        <h2 style={styles.heading}>Manage Tours</h2>

        {!token && (
          <div style={{ color: 'red', marginBottom: '20px' }}>
            You must be logged in as admin to manage tours.
          </div>
        )}

        <form onSubmit={handleSubmit} style={styles.formGlass}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Title*</label>
            <input name="title" value={form.title} onChange={handleChange} style={styles.input} placeholder="Enter tour title" required />
          </div>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Description*</label>
            <textarea name="description" value={form.description} onChange={handleChange} style={{ ...styles.input, height: '80px' }} placeholder="Enter tour description" required />
          </div>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Price*</label>
            <input type="number" name="price" value={form.price} onChange={handleChange} style={styles.input} placeholder="Enter tour price" required />
          </div>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Image URL</label>
            <input name="image" value={form.image} onChange={handleChange} style={styles.input} placeholder="Optional image URL" />
          </div>
          <button type="submit" style={styles.button} disabled={!token}>
            {editingTourId ? 'Update Tour' : 'Create Tour'}
          </button>
        </form>

        <h4 style={{ color: '#fff', textShadow: '0 1px 2px rgba(0,0,0,0.5)', marginBottom: '20px' }}>All Tours</h4>
        {loading && <p>Loading…</p>}
        {!loading && tours.length === 0 && <p>No tours found.</p>}

        <div style={styles.cardGrid}>
          {tours.map((tour) => (
            <div key={tour._id} style={styles.card}>
              {tour.image && <img src={tour.image} alt={tour.title} style={styles.cardImage} />}
              <div style={styles.cardBody}>
                <h5 style={styles.cardTitle}>{tour.title}</h5>
                <p style={styles.cardText}>{tour.description}</p>
                <p style={styles.cardPrice}>${tour.price}</p>
                <div style={styles.cardActions}>
                  <button onClick={() => handleEdit(tour)} style={styles.btnSecondary} disabled={!token}>Edit</button>
                  <button onClick={() => handleDelete(tour._id)} style={styles.btnDanger} disabled={!token}>Delete</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminToursManage;