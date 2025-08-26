import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/api';
import { FaCheck } from 'react-icons/fa';

const BookTour = () => {
  const { id } = useParams();
  const [date, setDate] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [numberOfPeople, setNumberOfPeople] = useState(1);
  const [selectedTour, setSelectedTour] = useState(id);
  const [successAlert, setSuccessAlert] = useState('');

  const navigate = useNavigate();

  const handleBooking = async (e) => {
    e.preventDefault();

    if (!name || !email || !numberOfPeople || !selectedTour) {
      alert('Please fill in all fields.');
      return;
    }
    if (numberOfPeople <= 0) {
      alert('Number of people must be greater than 0.');
      return;
    }

    try {
      await api.post('/bookings', {
        tourId: selectedTour,
        date,
        name,
        email,
        numberOfPeople,
      });
      setSuccessAlert('Booking successful! Redirecting to your bookings...');
      setTimeout(() => {
        navigate('/my-bookings');
      }, 1500);
    } catch {
      alert('Booking failed');
    }
  };

  return (
    <div
      style={{
        backgroundImage: `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url('https://images.unsplash.com/photo-1507525428034-b723cf961d3e')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '20px',
      }}
    >
      {/* Success Alert */}
      {successAlert && (
        <div className="alert alert-success alert-dismissible fade show m-3 position-fixed top-0 end-0" style={{zIndex: 9999}} role="alert">
          <FaCheck className="me-2" />
          {successAlert}
          <button type="button" className="btn-close" onClick={() => setSuccessAlert('')}></button>
        </div>
      )}
      
      <form
        onSubmit={handleBooking}
        className="p-4 shadow bg-white rounded"
        style={{
          width: '100%',
          maxWidth: '500px',
          backgroundColor: 'rgba(255, 255, 255, 0.9)', 
        }}
      >
        <h2 className="text-center mb-4">Book Your Tour</h2>

        <div className="mb-3">
          <label className="form-label">Name:</label>
          <input
            type="text"
            className="form-control"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Email:</label>
          <input
            type="email"
            className="form-control"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Number of People:</label>
          <input
            type="number"
            className="form-control"
            min="1"
            value={numberOfPeople}
            onChange={(e) => setNumberOfPeople(Number(e.target.value))}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Select Date:</label>
          <input
            type="date"
            className="form-control"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
        </div>

        <button type="submit" className="btn btn-primary w-100">
          Confirm Booking
        </button>
      </form>
    </div>
  );
};

export default BookTour;