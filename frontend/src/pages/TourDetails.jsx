import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api/api';

const TourDetails = () => {
  const { id } = useParams();
  const [tour, setTour] = useState(null);

  useEffect(() => {
    api.get(`/tours/${id}`)
      .then(res => setTour(res.data))
      .catch(() => alert('Error loading tour'));
  }, [id]);

  if (!tour) return <p className="text-center mt-5">Loading...</p>;

  return (
    <div
      style={{
        backgroundImage: `url('https://images.unsplash.com/photo-1507525428034-b723cf961d3e')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '40px',
      }}
    >
      <div
        className="card shadow-lg"
        style={{
          borderRadius: '0', // no rounded corners
          maxWidth: '600px',
          width: '100%',
          transition: 'transform 0.3s ease',
        }}
        onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.05)')}
        onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
      >
        <img
          src={tour.image || 'https://via.placeholder.com/700x300.png?text=Tour+Image'}
          className="card-img-top"
          alt={tour.name}
          style={{ objectFit: 'cover', height: '250px' }}
        />
        <div className="card-body">
          <h2 className="card-title text-center mb-3">{tour.name}</h2>
          <p className="card-text">{tour.description}</p>
          <p className="card-text">
            <strong>Price:</strong> ${tour.price}
          </p>
          <div className="d-grid mt-4">
            <Link
              to={`/book/${tour._id}`}
              className="btn btn-primary btn-lg"
            >
              Book This Tour
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TourDetails;
