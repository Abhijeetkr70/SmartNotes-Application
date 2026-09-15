import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import mongoose from 'mongoose';
import connectDB from './config/db.js';
import notesRouter from './routes/notes.js';
import { requireAuth } from './middleware/auth.js';
import errorHandler from './middleware/errorHandler.js';
import timeout from './middleware/timeoutMiddleware.js';
import { v4 as uuidv4 } from 'uuid';

const app = express();
const PORT = process.env.PORT || 10000;
const NODE_ENV = process.env.NODE_ENV || 'development';

// Trust proxy for Render
app.set('trust proxy', 1);

// Security headers
app.use(helmet({
  contentSecurityPolicy: NODE_ENV === 'production' ? undefined : false,
  crossOriginEmbedderPolicy: false,
}));

// CORS - strict origin matching, no wildcard fallback
const corsOrigin = process.env.CORS_ORIGIN;
if (!corsOrigin) {
  console.error('WARNING: CORS_ORIGIN not set. CORS will reject all origins in production.');
}
app.use(cors({
  origin: corsOrigin,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  optionsSuccessStatus: 200,
}));

// Rate limiting (memory store - free tier friendly)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: { success: false, message: 'Too many requests, please try again later' },
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => req.path === '/api/health',
});
app.use('/api/', limiter);

// Correlation ID middleware
app.use((req, res, next) => {
  const correlationId = req.headers['x-correlation-id'] || uuidv4();
  req.correlationId = correlationId;
  res.setHeader('X-Correlation-ID', correlationId);
  next();
});

// Body parsing
app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ extended: true, limit: '5mb' }));

// Request timeout
app.use(timeout(30000));

// Health check (liveness)
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Readiness check (includes DB connectivity)
app.get('/api/ready', async (req, res) => {
  const dbState = mongoose.connection.readyState;
  const isReady = dbState === 1; // 1 = connected
  
  if (isReady) {
    res.json({ 
      status: 'ready', 
      database: 'connected',
      timestamp: new Date().toISOString(),
      correlationId: req.correlationId 
    });
  } else {
    res.status(503).json({ 
      status: 'not ready', 
      database: ['disconnected', 'connecting', 'disconnecting'][dbState] || 'unknown',
      timestamp: new Date().toISOString(),
      correlationId: req.correlationId 
    });
  }
});

// API routes
app.use('/api/notes', requireAuth, notesRouter);

// 404 handler
app.use((_req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

// Error handler
app.use(errorHandler);

// Graceful shutdown
let server;
const gracefulShutdown = async (signal) => {
  console.log(`\n${signal} received. Starting graceful shutdown...`);
  
  if (server) {
    server.close(async () => {
      console.log('HTTP server closed');
      try {
        await mongoose.connection.close(false);
        console.log('MongoDB connection closed');
        process.exit(0);
      } catch (err) {
        console.error('Error during shutdown:', err);
        process.exit(1);
      }
    });
    
    // Force close after 10 seconds
    setTimeout(() => {
      console.error('Forced shutdown after timeout');
      process.exit(1);
    }, 10000);
  }
};

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

// Start server after DB connection
connectDB().then(() => {
  server = app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT} (${NODE_ENV})`);
  });
}).catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
