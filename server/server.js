const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const path = require('path');

// Middleware
app.use(cors());
app.use(express.json());
// Serve uploads directory as static
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/posts', require('./routes/postRoutes'));
app.use('/api/categories', require('./routes/categoryRoutes'));
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/posts/upload', require('./routes/uploadRoutes'));
app.use('/api/comments', require('./routes/commentRoutes'));

// Basic route
app.get('/', (req, res) => {
  res.send('API is running');
});

// Error handling middleware (should be after all routes)
app.use(require('./middleware/errorHandler'));

// MongoDB connection
const PORT = process.env.PORT || 5000;
const HOST = process.env.HOST || 'localhost';
const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  throw new Error('MONGO_URI is not defined in the environment variables.');
}

mongoose.connect(MONGO_URI)
  .then(() => {
    console.log('Connected to the Database');
    app.listen(PORT, HOST, () => {
      console.log(`Server running on http://${HOST}:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Failed to connect to the Database:', err);
  });
