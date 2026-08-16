const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { protect, authorize } = require('../middleware/authMiddleware');

// Get all users
router.get('/users', protect, authorize('admin'), async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching users', error: error.message });
  }
});

// Change user role
router.put('/users/:id/role', protect, authorize('admin'), async (req, res) => {
  try {
    const { role } = req.body;
    if (!['passenger', 'dispatcher', 'admin'].includes(role)) {
      return res.status(400).json({ message: 'Invalid role' });
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role },
      { new: true }
    ).select('-password');

    if (!user) return res.status(404).json({ message: 'User not found' });

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Error updating role', error: error.message });
  }
});

// Delete user
router.delete('/users/:id', protect, authorize('admin'), async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting user', error: error.message });
  }
});

// Get basic system metrics (mocked for demo purposes, representing API latency logs)
router.get('/metrics', protect, authorize('admin'), async (req, res) => {
  try {
    const metrics = {
      latency_ms: Math.floor(Math.random() * 40) + 10,
      total_predictions: Math.floor(Math.random() * 50000) + 10000,
      uptime_hours: Math.floor(Math.random() * 100) + 24
    };
    res.json(metrics);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching metrics', error: error.message });
  }
});

// Trigger ML Model Retraining
router.post('/retrain', protect, authorize('admin'), async (req, res) => {
  try {
    const axios = require('axios');
    const response = await axios.post(`${process.env.FLASK_API_URL}/retrain`);
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ message: 'Error triggering retrain', error: error.message });
  }
});

module.exports = router;
