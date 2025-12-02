const { validationResult } = require('express-validator');
const Payment = require('../models/Payment');

// =====================================
// EXISTING FEATURE: Admin + Resident View
// =====================================
exports.getPayments = async (req, res) => {
  try {
    let payments;

    if (req.user.role === 'admin') {
      payments = await Payment.find()
        .populate('resident', 'name email apartment')
        .sort({ dueDate: -1 });
    } else {
      payments = await Payment.find({ resident: req.user._id }).sort({
        dueDate: -1,
      });
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

// =====================================
// EXISTING FEATURE: Admin Creates Payment
// =====================================
exports.createPayment = async (req, res) => {
  try {
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

// =====================================
// NEW FEATURE: Resident Submits Payment + Screenshot
// =====================================
exports.submitPayment = async (req, res) => {
  try {
    const { month, referenceId, description, dueDate } = req.body;
    const filePath = req.file ? req.file.path : null;

    const payment = await Payment.create({
      resident: req.user.id,
      month,
      amount: 1000,
      referenceId,
      proofImage: filePath,
      description,
      dueDate,
      status: "Pending",
    });

    res.json({
      success: true,
      message: "Payment submitted successfully!",
      payment,
    });
  } catch (error) {
    console.log("Payment submit error:", error);
    res.status(500).json({ error: "Failed to submit payment" });
  }
};

// =====================================
// NEW FEATURE: Resident Payment History
// =====================================
exports.getMyPayments = async (req, res) => {
  try {
    const payments = await Payment.find({ resident: req.user.id })
      .sort({ createdAt: -1 });

    res.json({ success: true, payments });
  } catch (error) {
    res.status(500).json({ error: "Failed to load payments" });
  }
};

// =====================================
// NEW FEATURE: Admin Get All Payments
// =====================================
exports.getAllPayments = async (req, res) => {
  try {
    const payments = await Payment.find()
      .populate("resident", "name email apartmentNumber")
      .sort({ createdAt: -1 });

    res.json({ success: true, payments });
  } catch (error) {
    res.status(500).json({ error: "Failed to load all payments" });
  }
};

// =====================================
// NEW FEATURE: Admin Update Payment Status
// =====================================
exports.updateStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const payment = await Payment.findByIdAndUpdate(
      req.params.id,
      {
        status,
        updatedBy: req.user.id,
        paidAt: status === "Paid" ? new Date() : null,
      },
      { new: true }
    );

    if (!payment) return res.status(404).json({ error: "Payment not found" });

    res.json({
      success: true,
      message: "Status updated successfully",
      payment,
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to update status" });
  }
};
