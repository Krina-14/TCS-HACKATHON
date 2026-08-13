import express from 'express';
import http from 'http';
import cors from 'cors';
import helmet from 'helmet';
import mongoSanitize from 'mongo-sanitize';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';

import { connectDB } from './config/database.js';
import { initSocket } from './config/socket.js';
import { apiLimiter } from './middleware/rateLimiter.js';
import { globalErrorHandler as errorHandler } from './middleware/errorMiddleware.js';
import { seedDatabase } from './utils/seedData.js';

// Import Route Handlers
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import facultyRoutes from './routes/facultyRoutes.js';
import subjectRoutes from './routes/subjectRoutes.js';
import divisionRoutes from './routes/divisionRoutes.js';
import roomRoutes from './routes/roomRoutes.js';
import timetableRoutes from './routes/timetableRoutes.js';
import substitutionRoutes from './routes/substitutionRoutes.js';
import conflictRoutes from './routes/conflictRoutes.js';
import simulatorRoutes from './routes/simulatorRoutes.js';
import analyticsRoutes from './routes/analyticsRoutes.js';
import notificationRoutes from './routes/notificationRoutes.js';
import eventRoutes from './routes/eventRoutes.js';
import examRoutes from './routes/examRoutes.js';
import importExportRoutes from './routes/importExportRoutes.js';
import auditRoutes from './routes/auditRoutes.js';
import settingsRoutes from './routes/settingsRoutes.js';
import voiceRoutes from './routes/voiceRoutes.js';

dotenv.config();

const app = express();
const server = http.createServer(app);

// Ensure uploads and exports directories exist
const uploadDir = path.resolve('uploads');
const exportDir = path.resolve('exports');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });
if (!fs.existsSync(exportDir)) fs.mkdirSync(exportDir, { recursive: true });

// 1. Security & Core Middleware
app.use(helmet({ contentSecurityPolicy: false }));
app.use(
  cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Custom NoSQL Injection Protection Middleware
app.use((req, res, next) => {
  if (req.body) req.body = mongoSanitize(req.body);
  if (req.query) req.query = mongoSanitize(req.query);
  if (req.params) req.params = mongoSanitize(req.params);
  next();
});

app.use('/api', apiLimiter);

// 2. WebSockets Initialization
initSocket(server);

// 3. Health Check Route
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'SmartSched AI Backend API running smoothly',
    timestamp: new Date(),
  });
});

// 4. Mount API Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/faculty', facultyRoutes);
app.use('/api/subjects', subjectRoutes);
app.use('/api/divisions', divisionRoutes);
app.use('/api/rooms', roomRoutes);
app.use('/api/timetable', timetableRoutes);
app.use('/api/substitutions', substitutionRoutes);
app.use('/api/conflicts', conflictRoutes);
app.use('/api/simulator', simulatorRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/exams', examRoutes);
app.use('/api/import-export', importExportRoutes);
app.use('/api/audit', auditRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/voice', voiceRoutes);

// 5. Global Error Middleware
app.use(errorHandler);

// 6. Database Connection & Server Startup
const PORT = process.env.PORT || 5000;

const listenOnPort = (portToTry) => {
  server.listen(portToTry, () => {
    console.log(`🚀 SmartSched AI Server running on port ${portToTry}`);
    console.log(`🌐 API Base URL: http://localhost:${portToTry}/api`);
  }).on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.log(`⚠️ Port ${portToTry} is in use, retrying on port ${portToTry + 1}...`);
      listenOnPort(portToTry + 1);
    } else {
      console.error('Server listen error:', err);
    }
  });
};

const startServer = async () => {
  try {
    await connectDB();

    if (process.env.DEMO_MODE === 'true') {
      await seedDatabase();
      console.log('✅ Demo mode enabled - Seed data loaded');
    }

    listenOnPort(PORT);
  } catch (err) {
    console.error('❌ Server startup error:', err);
    process.exit(1);
  }
};

startServer();
