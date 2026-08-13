import { Server } from 'socket.io';
import jwt from 'jsonwebtoken';

let io = null;

export const initSocket = (httpServer) => {
  io = new Server(httpServer, {
    cors: {
      origin: process.env.FRONTEND_URL || 'http://localhost:5173',
      methods: ['GET', 'POST', 'PUT', 'DELETE'],
      credentials: true,
    },
  });

  // JWT Middleware for Socket Handshake
  io.use((socket, next) => {
    const token = socket.handshake.auth?.token || socket.handshake.headers?.authorization?.split(' ')[1];
    if (!token) {
      // Allow unauthenticated sockets in demo mode or reject
      socket.user = { role: 'guest' };
      return next();
    }
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'smartsched_secret_key');
      socket.user = decoded;
      next();
    } catch (err) {
      console.warn('Socket connection unauthenticated token verification warning:', err.message);
      socket.user = { role: 'guest' };
      next();
    }
  });

  io.on('connection', (socket) => {
    console.log(`🔌 WebSockets: Client connected (${socket.id}) - User: ${socket.user?.id || 'guest'}`);

    // Auto-join role & custom rooms
    if (socket.user?.role === 'admin') socket.join('admin-room');
    if (socket.user?.role === 'faculty') socket.join('faculty-room');
    if (socket.user?.role === 'student') socket.join('student-room');
    if (socket.user?.divisionId) socket.join(`division-${socket.user.divisionId}`);
    if (socket.user?.id) socket.join(`user-${socket.user.id}`);

    // Custom room join handler
    socket.on('join-room', ({ room, divisionId, userId }) => {
      if (room) socket.join(room);
      if (divisionId) socket.join(`division-${divisionId}`);
      if (userId) socket.join(`user-${userId}`);
      console.log(`Socket ${socket.id} joined room: ${room || divisionId || userId}`);
    });

    socket.on('disconnect', () => {
      console.log(`🔌 WebSockets: Client disconnected (${socket.id})`);
    });
  });

  return io;
};

export const getIO = () => {
  if (!io) {
    throw new Error('Socket.io has not been initialized!');
  }
  return io;
};

export const emitToRoom = (room, event, data) => {
  if (io) {
    io.to(room).emit(event, data);
  }
};

export const emitToAll = (event, data) => {
  if (io) {
    io.emit(event, data);
  }
};
