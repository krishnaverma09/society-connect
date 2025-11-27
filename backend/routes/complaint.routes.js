const express = require('express');
const { body } = require('express-validator');
const complaintController = require('../controllers/complaint.controller');
const authMiddleware = require('../middleware/auth.middleware');
const roleMiddleware = require('../middleware/role.middleware');

// Multer config (inline → since you said you don't have a custom multer file)
const multer = require("multer");
const path = require("path");

// ===== Multer Storage Config =====
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); // relative to backend root
  },
  filename: function (req, file, cb) {
    const uniqueName =
      Date.now() + "-" + Math.round(Math.random() * 1e9) + path.extname(file.originalname);
    cb(null, uniqueName);
  },
});

// Only images allowed
const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === "image/jpeg" ||
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpg"
  ) {
    cb(null, true);
  } else {
    cb(new Error("Only JPG, JPEG, PNG files are allowed"), false);
  }
};

const upload = multer({ storage, fileFilter });

const router = express.Router();

// 🔒 All routes require authentication
router.use(authMiddleware);

// =============================
// GET /api/complaints
// Admin → all complaints
// Resident → own complaints
// =============================
router.get('/', complaintController.getComplaints);

// =============================
// POST /api/complaints
// Resident → create complaint
// =============================
router.post(
  '/',
  roleMiddleware('resident'),
  upload.single("image"),  // <-- Image support added
  [
    body('title').trim().notEmpty().withMessage('Title is required'),
    body('description').trim().notEmpty().withMessage('Description is required'),
  ],
  complaintController.createComplaint
);

// =============================
// PUT /api/complaints/:id
// Admin → update status, notes, assignedTo
// =============================
router.put(
  '/:id',
  roleMiddleware('admin'),
  [
    body('status')
      .optional()
      .isIn(['Pending', 'In Progress', 'Resolved'])
      .withMessage('Status must be Pending, In Progress, or Resolved'),

    // allow adminNotes (optional)
    body('adminNotes')
      .optional()
      .isString()
      .withMessage('adminNotes must be text'),

    // allow assignedTo (optional)
    body('assignedTo')
      .optional()
      .isMongoId()
      .withMessage('assignedTo must be valid user ID'),
  ],
  complaintController.updateComplaint
);


// Resident: Edit complaint
router.put(
  "/:id/edit",
  roleMiddleware("resident"),
  upload.single("image"),
  complaintController.editComplaint
);

// Resident: Delete complaint
router.delete(
  "/:id",
  roleMiddleware("resident"),
  complaintController.deleteComplaint
);

module.exports = router;