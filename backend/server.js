require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// initialize app
const app = express();

// ✅ CORS FIX — must be the FIRST middleware
// whitelist of allowed origins (include deployed frontend and backend if needed)
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  'https://society-connect-five.vercel.app', // frontend (Vercel)
  'https://society-connect-py70.onrender.com',
  'https://society-connect-py70.onrender.com/api/auth/signup' // backend (Render) - only include if the backend needs to call itself cross-origin
];

app.use(
  cors({
    origin: function (origin, callback) {
      // allow requests with no origin (like mobile apps, curl, Postman)
      if (!origin) return callback(null, true);
      if (allowedOrigins.indexOf(origin) !== -1) {
        return callback(null, true);
      } else {
        const msg = `The CORS policy for this site does not allow access from the specified Origin: ${origin}`;
        return callback(new Error(msg), false);
      }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
    optionsSuccessStatus: 200,
  })
);

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

// ✅ routes
app.use('/api/auth', authRoutes);
app.use('/api/complaints', complaintRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/notifications', notificationRoutes);

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
