import React, { useEffect, useState } from 'react';
import api from '../api/api';
import { useAuth } from '../context/AuthContext';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';


const Profile = () => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    if (!user) return;

    api
      .get('/bookings/my')
      .then((res) => setBookings(res.data))
      .catch(() => alert('Failed to fetch bookings'));
  }, [user]);

  if (!user) {
    return (
      <div className="container text-center mt-5">
        <i className="bi bi-person-circle display-1 text-secondary"></i>
        <h4 className="mt-3">Please login to view your profile</h4>
      </div>
    );
  }

  return (
    <div
      className="container mt-5 p-4 rounded shadow-lg"
      style={{ maxWidth: '800px', backgroundColor: '#f8f9fa' }}
    >
      {/* Profile Header */}
      <div className="d-flex align-items-center mb-4 border-bottom pb-3">
        <i
          className="bi bi-person-circle text-primary"
          style={{ fontSize: '5rem', marginRight: '20px' }}
        ></i>
        <div>
          <h2 className="mb-1">{user.name}</h2>
          <p className="mb-0 text-muted">
            <i className="bi bi-envelope me-2"></i> {user.email}
          </p>
        </div>
      </div>

      {/* Bookings Section */}
      <h4 className="mt-4 mb-3">
        <i className="bi bi-journal-check me-2"></i> My Bookings
      </h4>

      {bookings.length === 0 ? (
        <div className="alert alert-info d-flex align-items-center" role="alert">
          <i className="bi bi-info-circle-fill me-2"></i>
          You have no bookings yet.
        </div>
      ) : (
        bookings.map((b) => (
          <div
            key={b._id}
            className="card mb-3 border-0 shadow-sm"
            style={{ backgroundColor: '#ffffff', borderRadius: '10px' }}
          >
            <div className="card-body">
              <h5 className="card-title text-primary">
                <i className="bi bi-geo-alt-fill me-2 text-danger"></i>
                {b.tour?.name}
              </h5>
              <p className="mb-1">
                <i className="bi bi-calendar-event me-2 text-success"></i>
                Date: {new Date(b.date).toDateString()}
              </p>
              <p className="mb-0">
                <i className="bi bi-people-fill me-2 text-warning"></i>
                People: {b.numberOfPeople}
              </p>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default Profile;
