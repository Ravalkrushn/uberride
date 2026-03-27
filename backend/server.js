const http = require('http');
const app = require('./app');
const connectDB = require('./db/db');
const PORT = process.env.PORT || 3000;

// Connect to MongoDB
connectDB();

const server = http.createServer(app);
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});