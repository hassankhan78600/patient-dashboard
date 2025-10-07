/**
 * The main entry point for the backend application.
 * This file initializes the Express server, configures middleware, mounts API routes, sets up error handling, and starts the server.
 */

require('dotenv').config();

const express = require('express');
const cors = require('cors');
const patientRoutes = require('./src/routes/patientRoutes');
const pool = require('./src/config/database');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

app.use('/api/patients', patientRoutes);

app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Patient Management API is running',
    version: '1.0.0',
    endpoints: {
      patients: '/api/patients'
    }
  });
});

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
    requestedUrl: req.url
  });
});

app.use((err, req, res, next) => {
  console.error('Global error handler:', err.stack);
  
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

app.listen(PORT, () => {
  console.log('='.repeat(50));
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
  console.log(`📊 API endpoints available at http://localhost:${PORT}/api/patients`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log('='.repeat(50));
});

process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');
  pool.end(() => {
    console.log('Database pool closed');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('SIGINT signal received: closing HTTP server');
  pool.end(() => {
    console.log('Database pool closed');
    process.exit(0);
  });
});

process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  pool.end(() => {
    process.exit(1);
  });
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  pool.end(() => {
    process.exit(1);
  });
});