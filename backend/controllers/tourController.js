import Tour from '../models/Tour.js';

export const createTour = async (req, res) => {
  try {
    const { title, description, price, image } = req.body;

    const newTour = new Tour({ title, description, price, image });
    await newTour.save();

    res.status(201).json(newTour);
  } catch (error) {
    res.status(500).json({ message: 'Failed to create tour', error });
  }
};

export const getAllTours = async (req, res) => {
  const tours = await Tour.find();
  res.json(tours);
};

export const getTourById = async (req, res) => {
  const tour = await Tour.findById(req.params.id);
  res.json(tour);
};


// DELETE /api/tours/:id
export const deleteTour = async (req, res) => {
  try {
    const deletedTour = await Tour.findByIdAndDelete(req.params.id);
    if (!deletedTour) {
      return res.status(404).json({ message: 'Tour not found' });
    }
    res.status(200).json({ message: 'Tour deleted successfully' });
  } catch (error) {
    console.error('Error deleting tour:', error);
    res.status(500).json({ message: 'Server error' });
  }
};


// PUT /api/tours/:id
export const updateTour = async (req, res) => {
  try {
    const updatedTour = await Tour.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true } // returns updated document
    );

    if (!updatedTour) {
      return res.status(404).json({ message: 'Tour not found' });
    }

    res.status(200).json(updatedTour);
  } catch (error) {
    console.error('Error updating tour:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
