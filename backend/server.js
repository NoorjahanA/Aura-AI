import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB, getDBStatus } from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import chatRoutes from './routes/chatRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api', chatRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    model: process.env.OPENROUTER_MODEL || 'nvidia/nemotron-3-ultra-550b-a55b:free',
    database: getDBStatus() ? 'MongoDB Connected' : 'In-Memory Fallback Active',
    timestamp: new Date().toISOString()
  });
});

// Start Server
const server = app.listen(PORT, () => {
  console.log(`[Server] Neumorphic AI Chatbot running on port ${PORT}`);
  console.log(`[Server] Health API: http://localhost:${PORT}/api/health`);
  console.log(`[Server] OpenRouter Model: ${process.env.OPENROUTER_MODEL || 'nvidia/nemotron-3-ultra-550b-a55b:free'}`);
  // Asynchronously attempt DB connection
  connectDB().catch((err) => {
    console.warn('[MongoDB] Initialization error:', err.message);
  });
});

