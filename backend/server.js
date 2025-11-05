require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// initialize app
const app = express();

// ✅ CORS FIX — must be the FIRST middleware
app.use(
  cors({
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
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
