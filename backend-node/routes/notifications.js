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
    const { flightId, action, message: customMessage, priority } = req.body;
    
    let message = customMessage;
    if (!message) {
      if (action === 'Notify Crew') message = `Crew for flight ${flightId} has been notified of the estimated delay.`;
      else if (action === 'Reallocate Gate') message = `Gate reallocation has been requested for flight ${flightId}.`;
      else message = `Operational notice received for flight ${flightId}.`;
    }

    const newNotif = new Notification({
      flightId,
      action: action || 'Admin Directive',
      message,
      priority: priority || 'alert',
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
