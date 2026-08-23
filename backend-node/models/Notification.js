const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  flightId: { type: String, required: true },
  action: { type: String, default: 'Admin Directive' },
  message: { type: String, required: true },
  priority: { type: String, enum: ['critical', 'warning', 'info', 'alert', 'system'], default: 'alert' },
  read: { type: Boolean, default: false },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

module.exports = mongoose.model('Notification', notificationSchema);
