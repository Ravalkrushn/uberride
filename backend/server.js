const http = require('http');
const app = require('./app');
const connectDB = require('./db/db');
const { initializeSocket } = require('./socket/socket');

const PORT = process.env.PORT || 3000;

// Connect to MongoDB
connectDB();

const server = http.createServer(app);

// Initialize Socket.io
const io = initializeSocket(server);

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Socket.io is ready for connections`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});