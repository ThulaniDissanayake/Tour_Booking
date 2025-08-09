import mongoose from 'mongoose';

const tourSchema = new mongoose.Schema({
  title: String,
  description: String,
  price: Number,
  image: String,
});

export default mongoose.model('Tour', tourSchema);
