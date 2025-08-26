import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema({
  name: String,
  email: String,
  numberOfPeople: Number,  
  date: {
    type: Date,       
    required: true,
  },         
  tour: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Tour',
  },
  user: {                           
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
});

export default mongoose.model('Booking', bookingSchema);
