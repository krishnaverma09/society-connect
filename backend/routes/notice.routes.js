const express = require('express');
const { body } = require('express-validator');
const noticeController = require('../controllers/notice.controller');
const authMiddleware = require('../middleware/auth.middleware');
const roleMiddleware = require('../middleware/role.middleware');
const multer = require('multer');
const path = require('path');

const router = express.Router();

// Multer setup - store files in /uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '..', 'uploads'));
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + ext);
  },
});

const upload = multer({ storage });

// All routes require auth
router.use(authMiddleware);

// GET /api/notices
router.get('/', noticeController.getNotices);

// GET /api/notices/:id
router.get('/:id', noticeController.getNoticeById);

// POST /api/notices - admin only
router.post(
  '/',
  roleMiddleware('admin'),
  upload.array('attachments', 10),
  [
    body('title').trim().notEmpty().withMessage('Title is required'),
    body('description').trim().notEmpty().withMessage('Description is required'),
  ],
  noticeController.createNotice
);

// PUT /api/notices/:id - admin only
router.put(
  '/:id',
  roleMiddleware('admin'),
  upload.array('attachments', 10),
  noticeController.updateNotice
);

// DELETE /api/notices/:id - admin only
router.delete('/:id', roleMiddleware('admin'), noticeController.deleteNotice);

module.exports = router;
