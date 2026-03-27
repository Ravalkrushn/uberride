const mongoose = require('mongoose');

function connectDB() {
  if (!process.env.MONGO_URI) {
    console.error('MONGO_URI environment variable is not set');
    process.exit(1);
  }

  return mongoose.connect(process.env.MONGO_URI).then(() => {
    console.log('MongoDB connected');
  }).catch((err) => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });
}

module.exports = connectDB;