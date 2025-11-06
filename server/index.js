const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const http = require('http');
const { Server } = require('socket.io');
const cron = require('node-cron');

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/devices', require('./routes/devices'));
app.use('/api/recommendations', require('./routes/recommendations'));
app.use('/api/quiz', require('./routes/quiz'));
app.use('/api/news', require('./routes/news'));
app.use('/api/chatbot', require('./routes/chatbot'));
app.use('/api/community', require('./routes/community'));
app.use('/api/user', require('./routes/user'));
app.use('/api/prices', require('./routes/prices'));

// Socket.io for real-time features
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);
  
  socket.on('join-room', (roomId) => {
    socket.join(roomId);
  });
  
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

// Root route
app.get('/', (req, res) => {
  res.json({
    message: 'PickMyTech API Server',
    version: '1.0.0',
    endpoints: {
      health: '/api/health',
      auth: '/api/auth',
      devices: '/api/devices',
      recommendations: '/api/recommendations',
      quiz: '/api/quiz',
      news: '/api/news',
      chatbot: '/api/chatbot',
      community: '/api/community',
      user: '/api/user',
      prices: '/api/prices'
    },
    frontend: 'http://localhost:3000',
    documentation: 'See README.md for API documentation'
  });
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'PickMyTech API is running' });
});

const PORT = process.env.PORT || 5001;

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/pickmytech')
.then(() => {
  console.log('MongoDB connected');
  
  // Schedule news fetch job - runs daily at 2 AM
  cron.schedule('0 2 * * *', async () => {
    try {
      const axios = require('axios');
      await axios.post(`http://localhost:${PORT}/api/news/fetch`);
      console.log('✅ Daily news fetch completed');
    } catch (error) {
      console.error('Error in scheduled news fetch:', error.message);
    }
  });
  
  // Initial news fetch on server start (optional - can be removed if not needed)
  setTimeout(async () => {
    try {
      const axios = require('axios');
      await axios.post(`http://localhost:${PORT}/api/news/fetch`);
      console.log('✅ Initial news fetch completed');
    } catch (error) {
      console.log('Initial news fetch skipped (normal if no news yet)');
    }
  }, 5000);
  
  server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  })
  .on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.error(`Port ${PORT} is already in use. Please free the port or use a different PORT in your .env file.`);
      process.exit(1);
    } else {
      console.error('Server error:', err);
      process.exit(1);
    }
  });
})
.catch((err) => {
  console.error('MongoDB connection error:', err);
  process.exit(1);
});

module.exports = { io };

