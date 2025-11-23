import io from 'socket.io-client';

const SOCKET_URL = process.env.VITE_SOCKET_URL || 'http://localhost:3000';

let socket = null;

export const connectSocket = () => {
  if (socket) {
    return socket;
  }

  socket = io(SOCKET_URL, {
    reconnection: true,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 5000,
    reconnectionAttempts: 5
  });

  socket.on('connect', () => {
    console.log('Socket connected');
  });

  socket.on('disconnect', () => {
    console.log('Socket disconnected');
  });

  socket.on('connect_error', (error) => {
    console.error('Socket connection error:', error);
  });

  return socket;
};

export const getSocket = () => {
  return socket || connectSocket();
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};

// Room management
export const joinRoom = ({ animeId, episodeId, userId, userName }) => {
  const socket = getSocket();
  socket.emit('join-room', { animeId, episodeId, userId, userName });
};

export const leaveRoom = ({ animeId, episodeId, userId, userName }) => {
  const socket = getSocket();
  socket.emit('leave-room', { animeId, episodeId, userId, userName });
};

// Comments
export const sendComment = ({ animeId, episodeId, userId, userName, text }) => {
  const socket = getSocket();
  socket.emit('send-comment', {
    animeId,
    episodeId,
    userId,
    userName,
    text,
    timestamp: new Date().toISOString()
  });
};

export const likeComment = ({ animeId, episodeId, commentId }) => {
  const socket = getSocket();
  socket.emit('like-comment', { animeId, episodeId, commentId });
};

// Typing indicators
export const emitTyping = ({ animeId, episodeId, userName }) => {
  const socket = getSocket();
  socket.emit('typing', { animeId, episodeId, userName });
};

export const emitStopTyping = ({ animeId, episodeId }) => {
  const socket = getSocket();
  socket.emit('stop-typing', { animeId, episodeId });
};

// Notifications
export const sendNotification = ({ userId, title, message, animeId, episodeId }) => {
  const socket = getSocket();
  socket.emit('send-notification', { userId, title, message, animeId, episodeId });
};

// Listeners
export const onNewComment = (callback) => {
  const socket = getSocket();
  socket.on('new-comment', callback);
};

export const onCommentLiked = (callback) => {
  const socket = getSocket();
  socket.on('comment-liked', callback);
};

export const onUserJoined = (callback) => {
  const socket = getSocket();
  socket.on('user-joined', callback);
};

export const onUserLeft = (callback) => {
  const socket = getSocket();
  socket.on('user-left', callback);
};

export const onUserTyping = (callback) => {
  const socket = getSocket();
  socket.on('user-typing', callback);
};

export const onUserStopTyping = (callback) => {
  const socket = getSocket();
  socket.on('user-stop-typing', callback);
};

export const onTrendUpdate = (callback) => {
  const socket = getSocket();
  socket.on('trend-update', callback);
};

export const onNotification = (callback) => {
  const socket = getSocket();
  socket.on('notification', callback);
};
