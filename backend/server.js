const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Database connection state
let isConnected = false;

const connectDB = async () => {
  if (isConnected) return;
  if (!process.env.MONGODB_URI) {
    console.error('Missing MONGODB_URI environment variable');
    throw new Error('Database configuration missing');
  }

  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    isConnected = !!conn.connections[0].readyState;
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`MongoDB Connection Error: ${error.message}`);
    throw error;
  }
};

// Vercel Serverless Middleware: Ensure DB is connected before every request
app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (error) {
    res.status(500).json({ error: 'Database connection failed', details: error.message });
  }
});

// Test route to verify server is alive
app.get(['/api/test', '/_/backend/api/test'], (req, res) => {
  res.json({ message: 'Backend is alive and database is connected!' });
});

// Routes (Mounting on both to handle Vercel's routePrefix)
const contactRoutes = require('./routes/contact');
const authRoutes = require('./routes/auth');
const messageRoutes = require('./routes/messages');

app.use('/api/contact', contactRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/messages', messageRoutes);

// Vercel experimentalServices fallback routes
app.use('/_/backend/api/contact', contactRoutes);
app.use('/_/backend/api/auth', authRoutes);
app.use('/_/backend/api/messages', messageRoutes);

// Error handler
app.use((err, req, res, next) => {
  console.error('Server Error:', err.stack);
  res.status(500).json({ message: err.message || 'Server Error' });
});

const PORT = process.env.PORT || 5000;

// Start server if not running in Vercel
if (process.env.NODE_ENV !== 'production' || !process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

// Export for Vercel Serverless Function
module.exports = app;
