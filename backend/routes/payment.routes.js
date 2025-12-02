const express = require('express');
const { body } = require('express-validator');
const paymentController = require('../controllers/payment.controller');
const authMiddleware = require('../middleware/auth.middleware');
const roleMiddleware = require('../middleware/role.middleware');
const upload = require('../utils/upload');

const router = express.Router();

// All routes require authentication
router.use(authMiddleware);

// ==========================================
// OLD ROUTES (KEEPED AS THEY ARE)
// ==========================================

// GET /api/payments - Get all payments (admin sees all, resident sees own)
router.get('/', paymentController.getPayments);

// POST /api/payments - Create new payment (admin only)
router.post(
  '/',
  roleMiddleware('admin'),
  [
    body('resident').notEmpty().withMessage('Resident ID is required'),
    body('amount')
      .isNumeric()
      .withMessage('Amount must be a number')
      .isFloat({ min: 0 })
      .withMessage('Amount must be positive'),
    body('dueDate').isISO8601().withMessage('Due date must be a valid date'),
    body('description').trim().notEmpty().withMessage('Description is required'),
  ],
  paymentController.createPayment
);

// ==========================================
// NEW ROUTES (MANUAL PAYMENT + SCREENSHOT)
// ==========================================

// Resident: Submit payment + screenshot
router.post(
  '/submit',
  upload.single('proofImage'),
  paymentController.submitPayment
);

// Resident: View my payment history
router.get('/my-payments', paymentController.getMyPayments);

// Admin: See ALL payments (with screenshots)
router.get('/all', paymentController.getAllPayments);

// Admin: Update status (Pending / Paid / Unpaid)
router.put('/update/:id', paymentController.updateStatus);

module.exports = router;
