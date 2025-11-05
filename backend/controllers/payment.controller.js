const { validationResult } = require('express-validator');
const Payment = require('../models/Payment');

// Get all payments (admin sees all, resident sees own)
exports.getPayments = async (req, res) => {
  try {
    let payments;

    if (req.user.role === 'admin') {
      // Admin sees all payments
      payments = await Payment.find()
        .populate('resident', 'name email apartment')
        .sort({ dueDate: -1 });
    } else {
      // Resident sees only their payments
      payments = await Payment.find({ resident: req.user._id })
        .sort({ dueDate: -1 });
    }

    res.status(200).json({
      success: true,
      count: payments.length,
      payments,
    });
  } catch (error) {
    console.error('Get payments error:', error);
    res.status(500).json({ message: 'Server error while fetching payments' });
  }
};

// Create new payment (admin only)
exports.createPayment = async (req, res) => {
  try {
    // Validate input
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { resident, amount, dueDate, description } = req.body;

    const payment = new Payment({
      resident,
      amount,
      dueDate,
      description,
      status: 'Pending',
    });

    await payment.save();
    await payment.populate('resident', 'name email apartment');

    res.status(201).json({
      success: true,
      message: 'Payment created successfully',
      payment,
    });
  } catch (error) {
    console.error('Create payment error:', error);
    res.status(500).json({ message: 'Server error while creating payment' });
  }
};
