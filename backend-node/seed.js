require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');

const seedUsers = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected...');

    const usersToSeed = [
      { username: 'admin', password: '1234', role: 'admin' },
      { username: 'staff', password: '1234', role: 'dispatcher' },
      { username: 'passenger', password: '1234', role: 'passenger' }
    ];

    for (const u of usersToSeed) {
      let user = await User.findOne({ username: u.username });
      if (!user) {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(u.password, salt);
        user = new User({
          username: u.username,
          password: hashedPassword,
          role: u.role
        });
        await user.save();
        console.log(`Created user: ${u.username}`);
      } else {
        console.log(`User already exists: ${u.username}`);
      }
    }
    
    console.log('Seeding complete.');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};

seedUsers();
