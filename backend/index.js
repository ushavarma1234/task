const express = require('express');
const cors = require('cors');
const app = express();
const authRoutes = require('./routes/authRoutes'); // Ensure this path is correct

// Use CORS middleware
app.use(cors({
  origin: 'http://localhost:3000', // Replace with your frontend URL
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Middleware to parse JSON bodies
app.use(express.json()); // Set up only once

// Define routes
app.use('/api/auth', authRoutes); // Ensure this path matches the one in your axios requests

// Start your server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
