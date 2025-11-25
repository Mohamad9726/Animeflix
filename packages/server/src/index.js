import express from 'express';
import { createServer } from 'http';
import { Server as SocketIOServer } from 'socket.io';
import cors from 'cors';
import dotenv from 'dotenv';
import { v4 as uuidv4 } from 'uuid';
import swaggerUi from 'swagger-ui-express';
import apiRoutes from './routes.js';
import { swaggerSpec } from './swagger.js';
import { errorHandler, authenticateToken } from './middleware.js';
import { JobScheduler } from './jobs.js';
import { storage, initializeSampleData } from './models.js';

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

// Middleware
app.use(cors());
app.use(express.json());

// Initialize sample data
initializeSampleData();

// Swagger documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// API v1 routes
app.use('/api/v1', apiRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Error handler
app.use(errorHandler);

// ============= Socket.io Event Handlers =============

io.on('connection', (socket) => {
  console.log(`User connected: ${socket.id}`);

  socket.on('join-room', ({ animeId, episodeId, userId, userName }) => {
    const room = `anime:${animeId}:episode:${episodeId}`;
    socket.join(room);

    const key = `${animeId}:${episodeId}`;
    if (!storage.activeUsers.has(key)) {
      storage.activeUsers.set(key, new Set());
    }
    storage.activeUsers.get(key).add(userId);

    // Broadcast user joined
    io.to(room).emit('user-joined', {
      userId,
      userName,
      activeUsers: storage.activeUsers.get(key).size
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

    if (!storage.comments.has(key)) {
      storage.comments.set(key, []);
    }
    storage.comments.get(key).push(comment);

    // Broadcast comment to room
    io.to(room).emit('new-comment', comment);

    // Update trend
    if (!storage.trends.has(animeId)) {
      storage.trends.set(animeId, {
        id: animeId,
        name: `Anime ${animeId}`,
        count: 0,
        mentions: 0
      });
    }
    const trend = storage.trends.get(animeId);
    trend.count++;
    trend.mentions++;

    // Broadcast trend update
    io.emit('trend-update', trend);
  });

  socket.on('like-comment', ({ animeId, episodeId, commentId }) => {
    const room = `anime:${animeId}:episode:${episodeId}`;
    const key = `${animeId}:${episodeId}`;
    const roomComments = storage.comments.get(key) || [];
    const comment = roomComments.find(c => c.id === commentId);

    if (comment) {
      comment.likes++;
      io.to(room).emit('comment-liked', { commentId, likes: comment.likes });
    }
  });

  socket.on('send-notification', ({ userId, title, message, animeId, episodeId }) => {
    if (!storage.notifications.has(userId)) {
      storage.notifications.set(userId, []);
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

    storage.notifications.get(userId).push(notification);
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

    if (storage.activeUsers.has(key)) {
      storage.activeUsers.get(key).delete(userId);
    }

    io.to(room).emit('user-left', {
      userId,
      userName,
      activeUsers: storage.activeUsers.get(key)?.size || 0
    });

    console.log(`User ${userId} left room ${room}`);
  });

  socket.on('disconnect', () => {
    console.log(`User disconnected: ${socket.id}`);
  });
});

// Start background job scheduler
const jobScheduler = new JobScheduler(io);
jobScheduler.start();

httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Socket.io server ready for connections`);
  console.log(`API documentation available at http://localhost:${PORT}/api-docs`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');
  jobScheduler.stop();
  httpServer.close(() => {
    console.log('HTTP server closed');
  });
});
