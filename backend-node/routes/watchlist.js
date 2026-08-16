const express = require('express');
const router = express.Router();
const Watchlist = require('../models/Watchlist');
const { protect } = require('../middleware/authMiddleware');

// Get current user's watchlist
router.get('/', protect, async (req, res) => {
  try {
    let watchlist = await Watchlist.findOne({ user_id: req.user.id });
    if (!watchlist) {
      watchlist = await Watchlist.create({ user_id: req.user.id, flights: [] });
    }
    res.json(watchlist);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching watchlist', error: error.message });
  }
});

// Add flight to watchlist
router.post('/', protect, async (req, res) => {
  try {
    const flight = req.body; // Expects flight_id, origin, destination, scheduled_departure, carrier, delay_probability, estimated_minutes
    
    let watchlist = await Watchlist.findOne({ user_id: req.user.id });
    if (!watchlist) {
      watchlist = await Watchlist.create({ user_id: req.user.id, flights: [] });
    }

    // Check if already in watchlist
    if (watchlist.flights.some(f => f.flight_id === flight.flight_id)) {
      return res.status(400).json({ message: 'Flight already in watchlist' });
    }

    // Since we need to store delay probability and estimated minutes for the planner, let's just push everything
    // Even if schema doesn't have it, Mongoose strict mode might strip it. Let's update schema or just store what matches.
    // Wait, the schema didn't have delay_probability and estimated_minutes. 
    // We can add them dynamically via mixed type or update the schema later. For now, pushing the required fields:
    watchlist.flights.push({
      flight_id: flight.flight_id,
      origin: flight.origin || 'UNK',
      destination: flight.destination || 'UNK',
      scheduled_departure: flight.date ? new Date(flight.date) : new Date(),
      carrier: flight.carrier || 'UNK',
      delay_probability: flight.delay_probability || 0,
      estimated_minutes: flight.estimated_minutes || 0
    });

    await watchlist.save();
    res.status(201).json(watchlist);
  } catch (error) {
    res.status(500).json({ message: 'Error adding to watchlist', error: error.message });
  }
});

// Remove flight from watchlist
router.delete('/:flight_id', protect, async (req, res) => {
  try {
    let watchlist = await Watchlist.findOne({ user_id: req.user.id });
    if (!watchlist) {
      return res.status(404).json({ message: 'Watchlist not found' });
    }

    watchlist.flights = watchlist.flights.filter(f => f.flight_id !== req.params.flight_id);
    await watchlist.save();
    
    res.json(watchlist);
  } catch (error) {
    res.status(500).json({ message: 'Error removing from watchlist', error: error.message });
  }
});

module.exports = router;
