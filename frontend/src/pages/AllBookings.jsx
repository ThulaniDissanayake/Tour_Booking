// import React, { useEffect, useState } from 'react';
// import axios from 'axios';

// const AllBookings = () => {
//   const [bookings, setBookings] = useState([]);

//   useEffect(() => {
//     const fetchBookings = async () => {
//       try {
//         const token = localStorage.getItem('token');
//         const res = await axios.get('http://localhost:5000/api/bookings/all', {
//           headers: { Authorization: `Bearer ${token}` },
//         });
//         setBookings(res.data);
//       } catch (error) {
//         console.error('Error fetching bookings:', error);
//       }
//     };

//     fetchBookings();
//   }, []);

//   return (
//     <div className="container">
//       <h2>All Bookings (Admin View)</h2>
//       {bookings.length === 0 ? (
//         <p>No bookings found.</p>
//       ) : (
//         <ul>
//           {bookings.map((booking) => (
//             <li key={booking._id}>
//               <strong>Tour:</strong> {booking.tour?.title || 'N/A'}<br />
//               <strong>User:</strong> {booking.user?.username || 'N/A'}<br />
//               <strong>Date:</strong> {new Date(booking.date).toLocaleDateString()}
//             </li>
//           ))}
//         </ul>
//       )}
//     </div>
//   );
// };

// export default AllBookings;
