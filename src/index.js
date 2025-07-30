// Zuno Music Platform - Main App Entry
// Modern Express.js setup, ready for expansion

const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Health check route
app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'Zuno Music Platform' });
});

// Placeholder for future music API routes
app.get('/', (req, res) => {
  res.send('Welcome to Zuno - Your modern music platform backend!');
});

// Start server
app.listen(PORT, () => {
  console.log(`Zuno server running on http://localhost:${PORT}`);
});