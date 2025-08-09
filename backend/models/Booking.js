import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema({
  name: String,
  email: String,
  numberOfPeople: Number,  
  date: {
    type: Date,       // Important: this tells Mongoose this field stores dates
    required: true,
  },         // use this name to match controller
  tour: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Tour',
  },
  user: {                           // add user reference for authenticated user
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
});

export default mongoose.model('Booking', bookingSchema);
