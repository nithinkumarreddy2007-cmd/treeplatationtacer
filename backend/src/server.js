import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB, getDBStatus } from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import treeRoutes from './routes/treeRoutes.js';
import statsRoutes from './routes/statsRoutes.js';
import { notFound, errorHandler } from './middleware/errorHandler.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS for frontend Vite dev server (5173) and any origin in dev
app.use(
  cors({
    origin: true,
    credentials: true,
  })
);

app.use(express.json());

// API Status & Health Check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    appName: 'Tree Plantation Tracker API',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    db: getDBStatus(),
  });
});

// Mount Routes
app.use('/api/auth', authRoutes);
app.use('/api/trees', treeRoutes);
app.use('/api/stats', statsRoutes);

// Error handlers
app.use(notFound);
app.use(errorHandler);

// Start server
const startServer = async () => {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`🌲 [Server] Tree Plantation Tracker API running on port ${PORT}`);
    console.log(`🌐 [Health Check] http://localhost:${PORT}/api/health`);
    console.log(`🌳 [Trees API]   http://localhost:${PORT}/api/trees`);
    console.log(`📊 [Stats API]   http://localhost:${PORT}/api/stats`);
  });
};

startServer();
