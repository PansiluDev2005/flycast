const express = require('express');
const router = express.Router();
const Notification = require('../models/Notification');
const { protect, authorize } = require('../middleware/authMiddleware');

// Get all notifications (Dispatchers and Admins)
router.get('/', protect, authorize('dispatcher', 'admin'), async (req, res) => {
  try {
    const notifications = await Notification.find().sort({ createdAt: -1 }).limit(20);
    res.json(notifications);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching notifications' });
  }
});

// Create a notification
router.post('/', protect, authorize('dispatcher', 'admin'), async (req, res) => {
  try {
    const { flightId, action } = req.body;
    
    let message = '';
    if (action === 'Notify Crew') message = `Crew for flight ${flightId} has been notified of the estimated delay.`;
    if (action === 'Reallocate Gate') message = `Gate reallocation has been requested for flight ${flightId}.`;

    const newNotif = new Notification({
      flightId,
      action,
      message,
      createdBy: req.user.id || req.user._id
    });
    
    await newNotif.save();
    res.status(201).json(newNotif);
  } catch (error) {
    res.status(500).json({ message: 'Error creating notification', error: error.message });
  }
});

// Mark as read
router.put('/:id/read', protect, authorize('dispatcher', 'admin'), async (req, res) => {
  try {
    const notif = await Notification.findByIdAndUpdate(req.params.id, { read: true }, { new: true });
    res.json(notif);
  } catch (error) {
    res.status(500).json({ message: 'Error updating notification' });
  }
});

module.exports = router;
