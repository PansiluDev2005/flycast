const express = require('express');
const router = express.Router();
const Notification = require('../models/Notification');
const { protect, authorize } = require('../middleware/authMiddleware');

// Resilient in-memory store so real-time notifications NEVER fail
let inMemoryNotifications = [];

// Get all notifications (Dispatchers and Admins)
router.get('/', protect, authorize('dispatcher', 'admin'), async (req, res) => {
  try {
    const notifications = await Notification.find().sort({ createdAt: -1 }).limit(30);
    const map = new Map();
    inMemoryNotifications.forEach(n => map.set(n._id ? n._id.toString() : `${n.flightId}-${n.createdAt}`, n));
    notifications.forEach(n => map.set(n._id ? n._id.toString() : `${n.flightId}-${n.createdAt}`, n));
    const combined = Array.from(map.values()).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    res.json(combined);
  } catch (error) {
    res.json(inMemoryNotifications.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
  }
});

// Create a notification
router.post('/', protect, authorize('dispatcher', 'admin'), async (req, res) => {
  const { flightId, action, message: customMessage, priority, senderRole } = req.body;
  
  let message = customMessage;
  if (!message) {
    if (action === 'Notify Crew') message = `Crew for flight ${flightId} has been notified of the estimated delay.`;
    else if (action === 'Reallocate Gate') message = `Gate reallocation has been requested for flight ${flightId}.`;
    else message = `Operational notice received for flight ${flightId}.`;
  }

  const notifObj = {
    _id: `notif-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
    flightId,
    action: action || 'Admin Directive',
    message,
    priority: priority || 'alert',
    senderRole: senderRole || req.user?.role || 'admin',
    read: false,
    createdAt: new Date().toISOString()
  };

  inMemoryNotifications.unshift(notifObj);
  if (inMemoryNotifications.length > 50) inMemoryNotifications = inMemoryNotifications.slice(0, 50);

  try {
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
    res.status(201).json(notifObj);
  }
});

// Mark as read
router.put('/:id/read', protect, authorize('dispatcher', 'admin'), async (req, res) => {
  const id = req.params.id;
  inMemoryNotifications = inMemoryNotifications.map(n => n._id && n._id.toString() === id.toString() ? { ...n, read: true } : n);
  try {
    const notif = await Notification.findByIdAndUpdate(id, { read: true }, { new: true });
    res.json(notif || { success: true, id });
  } catch (error) {
    res.json({ success: true, id });
  }
});

module.exports = router;
