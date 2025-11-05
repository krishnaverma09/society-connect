const { validationResult } = require('express-validator');
const Notification = require('../models/Notification');

// Get notifications for current user
exports.getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ user: req.user._id })
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: notifications.length,
      notifications,
    });
  } catch (error) {
    console.error('Get notifications error:', error);
    res.status(500).json({ message: 'Server error while fetching notifications' });
  }
};

// Create notification (admin only)
exports.createNotification = async (req, res) => {
  try {
    // Validate input
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { user, title, message } = req.body;

    const notification = new Notification({
      user,
      title,
      message,
      read: false,
    });

    await notification.save();
    await notification.populate('user', 'name email');

    res.status(201).json({
      success: true,
      message: 'Notification created successfully',
      notification,
    });
  } catch (error) {
    console.error('Create notification error:', error);
    res.status(500).json({ message: 'Server error while creating notification' });
  }
};
