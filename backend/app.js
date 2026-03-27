const dotenv = require('dotenv');
dotenv.config();

const express = require('express');
const cors = require('cors');
const app = express();
const connectDB = require('./db/db');
const { initializeFirebase } = require('./config/firebase.config');
const { errorHandler, notFoundHandler } = require('./middlewares/errorHandler.middleware');

// Initialize database and Firebase
connectDB();
initializeFirebase();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ limit: '10mb', extended: true }));
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));

// Health check
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Uberride API is running',
    version: '1.0.0'
  });
});

// API Routes
app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/user', require('./routes/user.routes'));
app.use('/api/captain', require('./routes/captain.routes'));
app.use('/api/ride', require('./routes/ride.routes'));
app.use('/api/payment', require('./routes/payment.routes'));
app.use('/api/rating', require('./routes/rating.routes'));
app.use('/api/location', require('./routes/location.routes'));
app.use('/api/admin', require('./routes/admin.routes'));

// 404 Handler
app.use(notFoundHandler);

// Global Error Handler
app.use(errorHandler);

module.exports = app;
