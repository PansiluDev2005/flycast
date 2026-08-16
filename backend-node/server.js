require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Database connection
mongoose.connect(process.env.MONGO_URI).then(() => {
  console.log("MongoDB connected successfully");
}).catch(err => {
  console.error("MongoDB connection error:", err);
});

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/ml', require('./routes/proxy'));
app.use('/api/watchlist', require('./routes/watchlist'));
app.use('/api/admin', require('./routes/admin'));
app.use('/api/notifications', require('./routes/notifications'));

// Simple Healthcheck
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

app.listen(PORT, () => {
  console.log(`Node API Gateway running on port ${PORT}`);
});
