import Booking from '../models/Booking.js';

// Create Booking (user)
export const createBooking = async (req, res) => {
  try {
    const { name, email, numberOfPeople, tourId, date } = req.body;

    if (!name || !email || !numberOfPeople || !tourId || !date) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }
    if (numberOfPeople <= 0) {
      return res.status(400).json({ message: 'Number of people must be greater than 0' });
    }

    const userId = req.user._id;

    const booking = new Booking({
      user: userId,
      tour: tourId,
      name,
      email,
      numberOfPeople,
      date,
    });

    await booking.save();
    res.status(201).json({ message: 'Booking created successfully', booking });
  } catch (error) {
    console.error('Booking creation error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get all bookings (admin only)
export const getAllBookings = async (req, res) => {
  try {
    // Populate tour and user fields with required details
    const bookings = await Booking.find()
      .populate('tour', 'title price image')   // populate only necessary fields
      .populate('user', 'name email');

    res.json(bookings);
  } catch (error) {
    console.error('Error fetching bookings:', error);
    res.status(500).json({ message: 'Server error fetching bookings' });
  }
};

// Get bookings of logged-in user
export const getUserBookings = async (req, res) => {
  try {
    const userId = req.user._id;
    const myBookings = await Booking.find({ user: userId })
      .populate('tour', 'title price image');
    res.json(myBookings);
  } catch (error) {
    console.error('Error fetching user bookings:', error);
    res.status(500).json({ message: 'Server error fetching your bookings' });
  }
};

export const deleteBooking = async (req, res) => {
  try {
    const userId = req.user?._id;
    const bookingId = req.params.id.trim();

    if (!bookingId.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ message: 'Invalid booking ID format' });
    }

    const booking = await Booking.findById(bookingId).populate('user');

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    if (!booking.user) {
      return res.status(400).json({ message: 'Booking user info missing' });
    }

    // Only allow the owner to delete their own booking (no admin override)
    if (booking.user._id.toString() !== userId.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this booking' });
    }

    await Booking.findByIdAndDelete(bookingId);

    res.json({ message: 'Booking deleted successfully' });
  } catch (error) {
    console.error('Delete booking error:', error);
    res.status(500).json({ message: 'Server error deleting booking' });
  }
};


// Get booking by id (owner or admin)
export const getBookingById = async (req, res) => {
  try {
    const bookingId = req.params.id.trim();
    const userId = req.user._id;
    const isAdmin = req.user.isAdmin || false;

    if (!bookingId.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ message: 'Invalid booking ID format' });
    }

    const booking = await Booking.findById(bookingId).populate('tour').populate('user', 'name email');
    if (!booking) return res.status(404).json({ message: 'Booking not found' });

    // Check if booking.user exists before accessing _id
    if (!booking.user) {
      return res.status(400).json({ message: 'Booking user info missing' });
    }

    // Allow only admin or owner
    if (!isAdmin && booking.user._id.toString() !== userId.toString()) {
      return res.status(403).json({ message: 'Not authorized to view this booking' });
    }

    res.json(booking);
  } catch (error) {
    console.error('Get booking by ID error:', error);
    res.status(500).json({ message: 'Server error fetching booking' });
  }
};

// Update booking by id (only owner)
export const updateBooking = async (req, res) => {
  try {
    const bookingId = req.params.id.trim();
    const userId = req.user._id;
    const { name, email, numberOfPeople, date } = req.body;

    if (!name || !email || !numberOfPeople || !date) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    if (!bookingId.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ message: 'Invalid booking ID format' });
    }

    const booking = await Booking.findById(bookingId).populate('user');
if (!booking) return res.status(404).json({ message: 'Booking not found' });

if (!booking.user) {
  return res.status(400).json({ message: 'Booking user info missing' });
}

const bookingUserId = booking.user._id ? booking.user._id.toString() : booking.user.toString();

if (bookingUserId !== userId.toString()) {
  return res.status(403).json({ message: 'Not authorized to update this booking' });
}


    booking.name = name;
    booking.email = email;
    booking.numberOfPeople = numberOfPeople;
    booking.date = date;

    await booking.save();

    res.json({ message: 'Booking updated successfully', booking });
  } catch (error) {
    console.error('Update booking error:', error);
    res.status(500).json({ message: 'Server error updating booking' });
  }
};
