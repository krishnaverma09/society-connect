const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

// Load environment variables
const FRONTEND_URL = process.env.FRONTEND_URL || '';
const allowedOrigins = new Set([
  'http://localhost:5173',
  'http://127.0.0.1:5173',
]);

// Add production origins
if (FRONTEND_URL) {
  FRONTEND_URL.split(',')
    .map((u) => u.trim())
    .forEach((u) => {
      if (!u) return;
      allowedOrigins.add(u);

      if (!u.startsWith('http')) {
        allowedOrigins.add(`https://${u}`);
        allowedOrigins.add(`http://${u}`);
      }
    });
}

// Production CORS check
if (process.env.NODE_ENV === 'production') {
  if (!FRONTEND_URL) {
    console.error(
      '❌ FATAL: FRONTEND_URL is required in production. Set FRONTEND_URL to your frontend origin.'
    );
    process.exit(1);
  }
}

// CORS handling
if (process.env.NODE_ENV !== 'production') {
  console.log('CORS: development mode - allowing all origins');
  app.use(
    cors({
      origin: true,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
      allowedHeaders: ['Content-Type', 'Authorization'],
      credentials: true,
      optionsSuccessStatus: 200,
    })
  );
} else {
  console.log('CORS allowed origins:', Array.from(allowedOrigins));
  app.use(
    cors({
      origin: function (origin, callback) {
        if (!origin) return callback(null, true);
        if (allowedOrigins.has(origin)) return callback(null, true);
        return callback(
          new Error(
            `The CORS policy for this site does not allow access from origin: ${origin}`
          ),
          false
        );
      },
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
      allowedHeaders: ['Content-Type', 'Authorization'],
      credentials: true,
      optionsSuccessStatus: 200,
    })
  );
}

app.options('*', cors());

// Middleware to parse JSON & form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ROUTES IMPORT
const authRoutes = require('./routes/auth.routes');
const complaintRoutes = require('./routes/complaint.routes');
const paymentRoutes = require('./routes/payment.routes');
const notificationRoutes = require('./routes/notification.routes');
const noticeRoutes = require('./routes/notice.routes');
const meetingRoutes = require('./routes/meeting.routes');

// STATIC FILES
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ==========================
// REGISTER ALL ROUTES HERE
// ==========================
app.use('/api/auth', authRoutes);
app.use('/api/complaints', complaintRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/notices', noticeRoutes);

// ⭐ VERY IMPORTANT — meetings must load BEFORE server starts
app.use('/api/meetings', meetingRoutes);

// Test endpoint
app.get('/', (req, res) => {
  res.json({ message: 'API is working!' });
});

// ==========================
// MONGODB + SERVER INIT
// ==========================
let basePort = parseInt(process.env.PORT, 10) || 3000;
const MAX_PORT = basePort + 10; // try up to 10 increments in dev

function startServer(port) {
  const server = app.listen(port, () => {
    console.log(`🚀 Server running on port ${port}`);
  });

  server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      if (process.env.NODE_ENV === 'production') {
        console.error(`❌ Port ${port} in use. Set a free PORT env variable.`);
        process.exit(1);
      } else {
        const nextPort = port + 1;
        if (nextPort > MAX_PORT) {
          console.error('❌ Exhausted port attempts. Unable to start server.');
          process.exit(1);
        }
        console.warn(`⚠️ Port ${port} in use, retrying on ${nextPort}...`);
        startServer(nextPort);
      }
    } else {
      console.error('❌ Server error:', err);
      process.exit(1);
    }
  });
}

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB Connected');
    startServer(basePort);
  })
  .catch((err) => console.error('❌ MongoDB Error:', err));
