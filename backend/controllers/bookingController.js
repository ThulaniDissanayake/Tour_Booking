import Booking from '../models/Booking.js';

// Create Booking (user)
export const createBooking = async (req, res) => {
  try {
    const { name, email, numberOfPeople, tourId, date } = req.body;
    const userId = req.user._id;  // Attach logged-in user

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


// Admin: Get all bookings
export const getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate('tour', 'title price image')
      .populate('user', 'name email role');
    res.json(bookings);
  } catch (error) {
    console.error('Error fetching bookings:', error);
    res.status(500).json({ message: 'Server error fetching bookings' });
  }
};

// User: Get logged-in user’s bookings
export const getUserBookings = async (req, res) => {
  try {
    const userId = req.user._id;  // ✅ Always comes from token
    const myBookings = await Booking.find({ user: userId })
      .populate('tour', 'title price image');

    res.json(myBookings);
  } catch (error) {
    console.error('Error fetching user bookings:', error);
    res.status(500).json({ message: 'Server error fetching your bookings' });
  }
};

// Get booking by ID (owner or admin)
export const getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('tour')
      .populate('user', 'name email role');

    if (!booking) return res.status(404).json({ message: 'Booking not found' });

    if (
      req.user.role !== 'admin' &&
      booking.user &&
      booking.user._id.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({ message: 'Not authorized to view this booking' });
    }

    res.json(booking);
  } catch (error) {
    console.error('Get booking by ID error:', error);
    res.status(500).json({ message: 'Server error fetching booking' });
  }
};

// Update booking (owner only)
export const updateBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, numberOfPeople, date } = req.body;

    const booking = await Booking.findById(id);
    if (!booking) return res.status(404).json({ message: 'Booking not found' });

    if (booking.user.toString() !== req.user._id.toString()) {
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

// Delete booking (owner or admin)
export const deleteBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const booking = await Booking.findById(id);

    if (!booking) return res.status(404).json({ message: 'Booking not found' });

    if (
      req.user.role !== 'admin' &&
      booking.user.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({ message: 'Not authorized to delete this booking' });
    }

    await booking.deleteOne();
    res.json({ message: 'Booking deleted successfully' });
  } catch (error) {
    console.error('Delete booking error:', error);
    res.status(500).json({ message: 'Server error deleting booking' });
  }
};
