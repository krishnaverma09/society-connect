const path = require('path')
require('dotenv').config({ path: path.join(__dirname, '.env') })
const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')

// initialize app
const app = express();

// ✅ CORS FIX — must be the FIRST middleware
// Build allowed origins from env to keep configuration dynamic.
const FRONTEND_URL = process.env.FRONTEND_URL || ''
const allowedOrigins = new Set([
  'http://localhost:5173',
  'http://127.0.0.1:5173',
])

// FRONTEND_URL can be a comma-separated list (for multiple deploys)
if (FRONTEND_URL) {
  FRONTEND_URL.split(',').map((u) => u.trim()).forEach((u) => {
    if (!u) return
    // accept both http and https variants if protocol omitted
    allowedOrigins.add(u)
    if (!u.startsWith('http')) {
      allowedOrigins.add(`https://${u}`)
      allowedOrigins.add(`http://${u}`)
    }
  })
}

// If running in production, require FRONTEND_URL to be set for security.
if (process.env.NODE_ENV === 'production') {
  if (!FRONTEND_URL) {
    console.error('FATAL: FRONTEND_URL is required in production. Set FRONTEND_URL in your environment to the frontend origin (e.g. https://example.com)')
    process.exit(1)
  }
}

// If not running in production, allow all origins to prevent CORS issues during local dev.
if (process.env.NODE_ENV !== 'production') {
  console.log('CORS: development mode - allowing all origins')
  app.use(
    cors({
      origin: true,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
      allowedHeaders: ['Content-Type', 'Authorization'],
      credentials: true,
      optionsSuccessStatus: 200,
    })
  )
} else {
  console.log('CORS allowed origins:', Array.from(allowedOrigins))
  app.use(
    cors({
      origin: function (origin, callback) {
        // allow requests with no origin (like mobile apps, curl, Postman)
        if (!origin) return callback(null, true)
        if (allowedOrigins.has(origin)) return callback(null, true)
        const msg = `The CORS policy for this site does not allow access from the specified Origin: ${origin}`
        return callback(new Error(msg), false)
      },
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
      allowedHeaders: ['Content-Type', 'Authorization'],
      credentials: true,
      optionsSuccessStatus: 200,
    })
  )
}

// ✅ handle preflight (OPTIONS) manually for extra safety
app.options('*', cors());

// ✅ body parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ import routes AFTER cors + parsers
const authRoutes = require('./routes/auth.routes');
const complaintRoutes = require('./routes/complaint.routes');
const paymentRoutes = require('./routes/payment.routes');
const notificationRoutes = require('./routes/notification.routes');
const noticeRoutes = require('./routes/notice.routes');

// ✅ routes
app.use('/api/auth', authRoutes);
app.use('/api/complaints', complaintRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/notifications', notificationRoutes);
// serve uploads folder
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
// mount notices
app.use('/api/notices', noticeRoutes);

// ✅ test route
app.get('/', (req, res) => {
  res.json({ message: 'API is working!' });
});

// ✅ connect MongoDB + start server
const PORT = process.env.PORT || 3000;
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB Connected');
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  })
  .catch((err) => console.error('❌ MongoDB Error:', err));

  
