require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');
const User = require('./models/User');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Ensure uploads folder exists
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Seed default users if they do not exist
async function seedDefaultUsers() {
  try {
    const defaultUsers = [
      { username: 'admin', password: '1234', role: 'admin' },
      { username: 'dispatcher', password: '1234', role: 'dispatcher' },
      { username: 'staff', password: '1234', role: 'dispatcher' },
      { username: 'jdoe123', password: '1234', role: 'passenger' },
      { username: 'passenger', password: '1234', role: 'passenger' }
    ];

    for (const u of defaultUsers) {
      const existing = await User.findOne({ username: u.username });
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(u.password, salt);
      
      if (!existing) {
        await User.create({ username: u.username, password: hashedPassword, role: u.role });
        console.log(`[Seed] Seeded default user: ${u.username} (${u.role})`);
      } else {
        existing.password = hashedPassword;
        existing.role = u.role;
        await existing.save();
        console.log(`[Seed] Updated existing default user: ${u.username} (${u.role})`);
      }
    }
  } catch (err) {
    console.warn('[Seed] Warning during user seeding:', err.message);
  }
}

// Connect to MongoDB with fallback
async function connectDB() {
  const uri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/flycast';
  try {
    await mongoose.connect(uri, { serverSelectionTimeoutMS: 2000 });
    console.log("MongoDB connected successfully to:", uri);
    await seedDefaultUsers();
  } catch (err) {
    console.log("Local/Remote MongoDB not available, initializing MongoMemoryServer...");
    try {
      const { MongoMemoryServer } = require('mongodb-memory-server');
      const mongod = await MongoMemoryServer.create();
      const memUri = mongod.getUri();
      await mongoose.connect(memUri);
      console.log("MongoMemoryServer connected successfully to:", memUri);
      await seedDefaultUsers();
    } catch (memErr) {
      console.error("MongoDB connection failed:", memErr.message);
    }
  }
}

connectDB();

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

