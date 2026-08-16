const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  flightId: { type: String, required: true },
  action: { type: String, required: true, enum: ['Notify Crew', 'Reallocate Gate'] },
  message: { type: String, required: true },
  read: { type: Boolean, default: false },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

module.exports = mongoose.model('Notification', notificationSchema);
