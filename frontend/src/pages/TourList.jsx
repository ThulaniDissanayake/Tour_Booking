import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/api';

const TourList = () => {
  const [tours, setTours] = useState([]);

  useEffect(() => {
    api.get('/tours')
      .then(res => setTours(res.data))
      .catch(() => alert('Error fetching tours'));
  }, []);

  return (
    <>
      {/* Hero Image Section */}
      <div
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1507525428034-b723cf961d3e')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          color: 'white',
          padding: '90px 20px 60px',
          textAlign: 'center',
          width: '100%',
        }}
      >
        <h1
          style={{
            fontWeight: 'bold',
            fontSize: '3rem',
            textShadow: '2px 2px 6px #000',
            marginBottom: '5px',
            marginTop: 0,
          }}
        >
          Discover Unforgettable Adventures
        </h1>
        <p
          style={{
            fontSize: '1.3rem',
            marginTop: '10px',
            maxWidth: '800px',
            marginLeft: 'auto',
            marginRight: 'auto',
            textShadow: '1px 1px 4px #000',
          }}
        >
          Embark on breathtaking journeys handpicked for explorers, thrill-seekers, and nature lovers. Browse our exclusive selection of tours and let your next adventure begin!
        </p>
      </div>

      {/* Tour Cards */}
      <div className="container mt-5">
        <div className="row">
          {tours.map(tour => (
            <div className="col-md-4 mb-4" key={tour._id}>
              <div className="card shadow-sm h-100">
                {/* Show image if available */}
                {tour.image && (
                  <img
                    src={tour.image}
                    alt={tour.title || 'Tour Image'}
                    className="card-img-top"
                    style={{ height: '180px', objectFit: 'cover' }}
                  />
                )}
                <div className="card-body d-flex flex-column">
                  <h5 className="card-title">{tour.title || tour.name}</h5>
                  <p className="card-text" style={{ flexGrow: 1 }}>
                    {tour.description.length > 100
                      ? tour.description.substring(0, 100) + '...'
                      : tour.description}
                  </p>
                  <Link
                    to={`/tours/${tour._id}`}
                    className="btn btn-primary mt-auto"
                    style={{ backgroundColor: '#c45008ff', border: 'none' }}
                  >
                    View Details
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {tours.length === 0 && (
          <p className="text-center text-muted">No tours available at the moment.</p>
        )}
      </div>
    </>
  );
};

export default TourList;
