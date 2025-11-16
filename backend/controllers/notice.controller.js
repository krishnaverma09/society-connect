const { validationResult } = require('express-validator');
const Notice = require('../models/Notice');
const path = require('path');

// Helper: build public URL for an uploaded file
function filePublicPath(req, filename) {
  // Store path relative to server root for client consumption
  return path.posix.join('/uploads', filename)
}

// Create Notice (Admin only)
exports.createNotice = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { title, description, category } = req.body;

  const attachments = (req.files || []).map((f) => filePublicPath(req, f.filename));

    const notice = new Notice({
      title,
      description,
      category,
      attachments,
      createdBy: req.user._id,
    });

    await notice.save();
    await notice.populate('createdBy', 'name email');

    res.status(201).json({ success: true, message: 'Notice created', notice });
  } catch (error) {
    console.error('Create notice error:', error);
    res.status(500).json({ success: false, message: 'Server error while creating notice' });
  }
};

// Get all notices (all authenticated users)
exports.getNotices = async (req, res) => {
  try {
    const notices = await Notice.find()
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, count: notices.length, notices });
  } catch (error) {
    console.error('Get notices error:', error);
    res.status(500).json({ success: false, message: 'Server error while fetching notices' });
  }
};

// Get a single notice by id
exports.getNoticeById = async (req, res) => {
  try {
    const { id } = req.params;
    const notice = await Notice.findById(id).populate('createdBy', 'name email');
    if (!notice) return res.status(404).json({ success: false, message: 'Notice not found' });

    res.status(200).json({ success: true, notice });
  } catch (error) {
    console.error('Get notice by id error:', error);
    res.status(500).json({ success: false, message: 'Server error while fetching notice' });
  }
};

// Update notice (Admin only)
exports.updateNotice = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, category } = req.body;

    const notice = await Notice.findById(id);
    if (!notice) return res.status(404).json({ success: false, message: 'Notice not found' });

    // Update fields
    if (title) notice.title = title;
    if (description) notice.description = description;
    if (category) notice.category = category;

    // If new files uploaded, append their paths
    if (req.files && req.files.length > 0) {
      const newAttachments = req.files.map((f) => filePublicPath(req, f.filename));
      notice.attachments = notice.attachments.concat(newAttachments);
    }

    await notice.save();
    await notice.populate('createdBy', 'name email');

    res.status(200).json({ success: true, message: 'Notice updated', notice });
  } catch (error) {
    console.error('Update notice error:', error);
    res.status(500).json({ success: false, message: 'Server error while updating notice' });
  }
};

// Delete notice (Admin only)
exports.deleteNotice = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Notice.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ success: false, message: 'Notice not found' });

    res.status(200).json({ success: true, message: 'Notice deleted' });
  } catch (error) {
    console.error('Delete notice error:', error);
    res.status(500).json({ success: false, message: 'Server error while deleting notice' });
  }
};
