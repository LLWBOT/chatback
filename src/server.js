const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const mongoose = require('mongoose');
const cors = require('cors');
const jwt = require('jsonwebtoken');

const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
const chatRoutes = require('./routes/chat');
const authMiddleware = require('./middleware/authMiddleware');

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

// Replace with your MongoDB Atlas URI
const MONGODB_URI = '<YOUR_MONGODB_URI>';
const JWT_SECRET = '<YOUR_JWT_SECRET>'; // Use a long, random string

mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error(err));

app.use(express.json());
app.use(cors());

// API routes
app.use('/api', authRoutes);
app.use('/api', authMiddleware, userRoutes);
app.use('/api', authMiddleware, chatRoutes);

// Socket.IO for real-time chat
io.use((socket, next) => {
  const token = socket.handshake.auth.token;
  if (!token) {
    return next(new Error('Authentication error'));
  }
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    socket.userId = decoded.userId;
    next();
  } catch (err) {
    next(new Error('Authentication error'));
  }
});

io.on('connection', (socket) => {
  console.log(`User connected: ${socket.userId}`);
  // Join a personal room
  socket.join(socket.userId);

  socket.on('sendMessage', async (data) => {
    // Implement message saving logic here
    // const newMessage = new Message({
    //   senderId: socket.userId,
    //   receiverId: data.receiverId,
    //   text: data.text
    // });
    // await newMessage.save();

    // Emit the message to the receiver's personal room
    io.to(data.receiverId).emit('receiveMessage', {
      senderId: socket.userId,
      text: data.text
    });
    // Also emit to the sender's room so they see their own message
    io.to(socket.userId).emit('receiveMessage', {
      senderId: socket.userId,
      text: data.text
    });
  });

  socket.on('disconnect', () => {
    console.log(`User disconnected: ${socket.userId}`);
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
