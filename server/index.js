import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import connectDB from './config/db.js';
import notesRouter from './routes/notes.js';
import errorHandler from './middleware/errorHandler.js';

const app = express();
const PORT = process.env.PORT;

app.use(cors({
  origin: process.env.CORS_ORIGIN,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type'],
}));

app.use(express.json({ limit: '1mb' }));

app.use('/api/notes', notesRouter);

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.use((_req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

app.use(errorHandler);

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
});
