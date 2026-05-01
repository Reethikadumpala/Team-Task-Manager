const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');

// Load env vars
dotenv.config();

const app = express();

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Enable CORS
app.use(cors({
  origin: [
    'http://localhost:3000', 'http://127.0.0.1:3000',
    'http://localhost:5000', 'http://127.0.0.1:5000',
    'http://localhost:5001', 'http://127.0.0.1:5001',
    'http://localhost:5002', 'http://127.0.0.1:5002',
    'http://localhost:5173', 'http://127.0.0.1:5173',
    'http://localhost:5174', 'http://127.0.0.1:5174'
  ],
  credentials: true
}));

// Health check route
app.get('/api/health', async (req, res) => {
  const dbStatus = mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected';
  res.json({ status: 'OK', database: dbStatus });
});

// DB Connection Check Middleware
app.use((req, res, next) => {
  if (mongoose.connection.readyState !== 1 && req.path !== '/api/health') {
    return res.status(503).json({ 
      message: 'Database connection is being established. Please try again in a few seconds.',
      readyState: mongoose.connection.readyState 
    });
  }
  next();
});

// Route files
const auth = require('./routes/authRoutes');
const projects = require('./routes/projectRoutes');
const tasks = require('./routes/taskRoutes');

// Mount routers
app.use('/api/auth', auth);
app.use('/api/projects', projects);
app.use('/api/tasks', tasks); 
app.use('/api/projects/:projectId/tasks', tasks);

// Error handler (MUST be after routes)
app.use((err, req, res, next) => {
  console.error('--- ERROR HANDLER ---');
  console.error('Message:', err.message);
  console.error('Stack:', err.stack);
  console.error('----------------------');
  
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode).json({
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
});

// Connect to database and start server
const startServer = async () => {
  try {
    await connectDB();
    
    const PORT = process.env.PORT || 5000;
    const server = app.listen(PORT, () => {
      console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
    });

    server.on('error', (err) => {
      if (err.code === 'EADDRINUSE') {
        console.error(`Port ${PORT} is already in use.`);
        process.exit(1);
      } else {
        console.error(err);
      }
    });
  } catch (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
};

startServer();
