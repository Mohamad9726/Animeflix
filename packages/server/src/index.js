import express from 'express';
import { createServer } from 'http';
import { Server as SocketIOServer } from 'socket.io';
import cors from 'cors';
import dotenv from 'dotenv';
import { v4 as uuidv4 } from 'uuid';

dotenv.config();

const app = express();
const httpServer = createServer(app);
const io = new SocketIOServer(httpServer, {
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    methods: ['GET', 'POST'],
    credentials: true
  }
});

const PORT = process.env.PORT || 3000;

// In-memory storage for demo purposes
const comments = new Map(); // animeId:episodeId -> Array of comments
const trends = new Map(); // animeId -> trend data
const activeUsers = new Map(); // animeId:episodeId -> Set of user IDs
const notifications = new Map(); // userId -> Array of notifications

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.get('/api/trends', (req, res) => {
  const trendsArray = Array.from(trends.values()).sort((a, b) => b.count - a.count).slice(0, 10);
  res.json(trendsArray);
});

app.get('/api/notifications/:userId', (req, res) => {
  const userNotifications = notifications.get(req.params.userId) || [];
  res.json(userNotifications);
});

app.post('/api/notifications/:userId/read/:notificationId', (req, res) => {
  const userNotifications = notifications.get(req.params.userId) || [];
  const idx = userNotifications.findIndex(n => n.id === req.params.notificationId);
  if (idx !== -1) {
    userNotifications[idx].read = true;
  }
  res.json({ success: true });
});

app.get('/api/comments/:animeId/:episodeId', (req, res) => {
  const key = `${req.params.animeId}:${req.params.episodeId}`;
  const roomComments = comments.get(key) || [];
  res.json(roomComments);
});

// Socket.io event handlers
io.on('connection', (socket) => {
  console.log(`User connected: ${socket.id}`);

  socket.on('join-room', ({ animeId, episodeId, userId, userName }) => {
    const room = `anime:${animeId}:episode:${episodeId}`;
    socket.join(room);
    
    const key = `${animeId}:${episodeId}`;
    if (!activeUsers.has(key)) {
      activeUsers.set(key, new Set());
    }
    activeUsers.get(key).add(userId);

    // Broadcast user joined
    io.to(room).emit('user-joined', {
      userId,
      userName,
      activeUsers: activeUsers.get(key).size
    });

    console.log(`User ${userId} joined room ${room}`);
  });

  socket.on('send-comment', ({ animeId, episodeId, userId, userName, text, timestamp }) => {
    const room = `anime:${animeId}:episode:${episodeId}`;
    const key = `${animeId}:${episodeId}`;
    
    const comment = {
      id: uuidv4(),
      userId,
      userName,
      text,
      timestamp: timestamp || new Date().toISOString(),
      likes: 0
    };

    if (!comments.has(key)) {
      comments.set(key, []);
    }
    comments.get(key).push(comment);

    // Broadcast comment to room
    io.to(room).emit('new-comment', comment);

    // Update trend
    if (!trends.has(animeId)) {
      trends.set(animeId, {
        id: animeId,
        name: `Anime ${animeId}`,
        count: 0,
        mentions: 0
      });
    }
    const trend = trends.get(animeId);
    trend.count++;
    trend.mentions++;

    // Broadcast trend update
    io.emit('trend-update', trend);
  });

  socket.on('like-comment', ({ animeId, episodeId, commentId }) => {
    const room = `anime:${animeId}:episode:${episodeId}`;
    const key = `${animeId}:${episodeId}`;
    const roomComments = comments.get(key) || [];
    const comment = roomComments.find(c => c.id === commentId);
    
    if (comment) {
      comment.likes++;
      io.to(room).emit('comment-liked', { commentId, likes: comment.likes });
    }
  });

  socket.on('send-notification', ({ userId, title, message, animeId, episodeId }) => {
    if (!notifications.has(userId)) {
      notifications.set(userId, []);
    }
    
    const notification = {
      id: uuidv4(),
      title,
      message,
      animeId,
      episodeId,
      timestamp: new Date().toISOString(),
      read: false,
      type: 'episode-release'
    };

    notifications.get(userId).push(notification);
    io.emit('notification', { userId, notification });
  });

  socket.on('typing', ({ animeId, episodeId, userName }) => {
    const room = `anime:${animeId}:episode:${episodeId}`;
    socket.to(room).emit('user-typing', { userName });
  });

  socket.on('stop-typing', ({ animeId, episodeId }) => {
    const room = `anime:${animeId}:episode:${episodeId}`;
    socket.to(room).emit('user-stop-typing');
  });

  socket.on('leave-room', ({ animeId, episodeId, userId, userName }) => {
    const room = `anime:${animeId}:episode:${episodeId}`;
    const key = `${animeId}:${episodeId}`;
    
    socket.leave(room);
    
    if (activeUsers.has(key)) {
      activeUsers.get(key).delete(userId);
    }

    io.to(room).emit('user-left', {
      userId,
      userName,
      activeUsers: activeUsers.get(key)?.size || 0
    });

    console.log(`User ${userId} left room ${room}`);
  });

  socket.on('disconnect', () => {
    console.log(`User disconnected: ${socket.id}`);
  });
});

httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Socket.io server ready for connections`);
});
