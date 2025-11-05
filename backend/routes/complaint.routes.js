const express = require('express');
const { body } = require('express-validator');
const complaintController = require('../controllers/complaint.controller');
const authMiddleware = require('../middleware/auth.middleware');
const roleMiddleware = require('../middleware/role.middleware');

const router = express.Router();

// All routes require authentication
router.use(authMiddleware);

// GET /api/complaints - Get all complaints (admin sees all, resident sees own)
router.get('/', complaintController.getComplaints);

// POST /api/complaints - Create new complaint (resident only)
router.post(
  '/',
  roleMiddleware('resident'),
  [
    body('title').trim().notEmpty().withMessage('Title is required'),
    body('description').trim().notEmpty().withMessage('Description is required'),
  ],
  complaintController.createComplaint
);

// PUT /api/complaints/:id - Update complaint status (admin only)
router.put(
  '/:id',
  roleMiddleware('admin'),
  [
    body('status')
      .optional()
      .isIn(['Pending', 'In Progress', 'Resolved'])
      .withMessage('Status must be Pending, In Progress, or Resolved'),
  ],
  complaintController.updateComplaint
);

module.exports = router;
