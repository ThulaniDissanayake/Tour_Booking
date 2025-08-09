import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

const Home = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const images = [
    {
      url: 'https://images.unsplash.com/photo-1544225239-8f11ba79099a?q=80&w=1674&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      title: 'Sri Lanka, Sigiriya',
      description: 'Explore the beautiful ancient rocks and temples ,Beaches of Sri Lanka'
    },
    {
      url: 'https://images.unsplash.com/photo-1527631746610-bca00a040d60?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
      title: 'Buddha Temple, Thailand',
      description: 'Discover ancient temples and spiritual sites'
    },
    {
      url: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
      title: 'Kerala, India',
      description: 'Experience the backwaters and lush greenery'
    },
    {
      url: 'https://plus.unsplash.com/premium_photo-1694475638457-5a3e51df0489?q=80&w=2079&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      title: 'Broken Beach, Bali',
      description: 'Marvel at the natural wonders of Nusa Penida'
    },
    {
      url: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
      title: 'Raja Ampat, Indonesia',
      description: 'Dive into the world\'s most biodiverse marine habitat'
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [images.length]);

  return (
    <div className="container-fluid vh-100 p-0 position-relative">
      {/* Full-page background image with blur and transparency */}
      <div
        className="position-absolute w-100 h-100"
        style={{
          backgroundImage: 'url(https://images.unsplash.com/photo-1507525428034-b723cf961d3e)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          filter: 'blur(2px) brightness(0.7)',
          zIndex: -1
        }}
      ></div>

      <div className="row g-0 h-100 position-relative">
        {/* Left side with welcome content */}
        <div className="col-md-6 d-flex align-items-center justify-content-center p-5">
          <div>
            <h1
              className="welcome-heading mb-4"
              style={{
                color: '#fff',
                fontSize: '4rem', // Much bigger font size
                fontWeight: 'bold'
              }}
            >
              Welcome to Travesia
            </h1>
            <p
              style={{
                fontSize: '1.25rem',
                fontFamily: "'Montserrat', sans-serif",
                color: '#fff'
              }}
            >
              Explore and book your dream destinations with ease and confidence.
            </p>
            <div className="mt-4">
              <a href="/tours" className="btn btn-warning me-2">
                Explore →
              </a>
            </div>
          </div>
        </div>

        {/* Right side with rotating images (rectangular corners) */}
        <div className="col-md-6 h-100 position-relative">
          <div className="h-100 d-flex flex-column justify-content-center align-items-center p-4">
            {/* Carousel container */}
            <div className="position-relative" style={{ width: '100%', height: '60%' }}>
              {images.map((image, index) => (
                <div
                  key={index}
                  className={`position-absolute w-100 h-100 transition-all ${
                    index === activeIndex ? 'active' : ''
                  }`}
                  style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    transition: 'all 0.5s ease-in-out',
                    opacity: index === activeIndex ? 1 : 0,
                    zIndex: index === activeIndex ? 1 : 0
                  }}
                >
                  {/* Image without rounded corners */}
                  <div
                    style={{
                      width: '90%',
                      height: '140%',
                      backgroundImage: `url(${image.url})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                      borderRadius: '0', // No rounded corners
                      boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
                      transform: index === activeIndex ? 'scale(1)' : 'scale(0.9)',
                      position: 'relative'
                    }}
                  >
                    <div
                      className="position-absolute bottom-0 start-0 p-3 text-white"
                      style={{
                        background:
                          'linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0) 100%)',
                        width: '100%'
                      }}
                    >
                      <h4 style={{ marginBottom: '0.2rem' }}>{image.title}</h4>
                      <p style={{ fontSize: '0.9rem', marginBottom: '0' }}>{image.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Navigation dots */}
            <div className="d-flex mt-4">
              {images.map((_, index) => (
                <button
                  key={index}
                  className={`btn p-2 mx-1 rounded-circle ${
                    index === activeIndex ? 'bg-warning' : 'bg-dark bg-opacity-25'
                  }`}
                  onClick={() => setActiveIndex(index)}
                  style={{ width: '12px', height: '12px', marginTop: '90px' }}
                  aria-label={`Go to slide ${index + 1}`}
                ></button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
