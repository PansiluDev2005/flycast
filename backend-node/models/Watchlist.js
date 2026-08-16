const mongoose = require('mongoose');

const watchlistSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  flights: [{
    flight_id: { type: String, required: true },
    origin: { type: String, required: true },
    destination: { type: String, required: true },
    scheduled_departure: { type: Date, required: true },
    carrier: { type: String, required: true },
    delay_probability: { type: Number, default: 0 },
    estimated_minutes: { type: Number, default: 0 }
  }]
}, { timestamps: true });

module.exports = mongoose.model('Watchlist', watchlistSchema);
