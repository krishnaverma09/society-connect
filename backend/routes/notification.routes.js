const express = require('express');
const { body } = require('express-validator');
const notificationController = require('../controllers/notification.controller');
const authMiddleware = require('../middleware/auth.middleware');
const roleMiddleware = require('../middleware/role.middleware');

const router = express.Router();

// All routes require authentication
router.use(authMiddleware);

// GET /api/notifications - Get notifications for current user
router.get('/', notificationController.getNotifications);

// POST /api/notifications - Create notification (admin only)
router.post(
  '/',
  roleMiddleware('admin'),
  [
    body('user').notEmpty().withMessage('User ID is required'),
    body('title').trim().notEmpty().withMessage('Title is required'),
    body('message').trim().notEmpty().withMessage('Message is required'),
  ],
  notificationController.createNotification
);

module.exports = router;
