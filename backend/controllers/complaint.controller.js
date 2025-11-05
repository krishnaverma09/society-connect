const { validationResult } = require('express-validator');
const Complaint = require('../models/Complaint');

// Get all complaints (admin sees all, resident sees own)
exports.getComplaints = async (req, res) => {
  try {
    let complaints;

    if (req.user.role === 'admin') {
      // Admin sees all complaints
      complaints = await Complaint.find()
        .populate('resident', 'name email apartment')
        .populate('assignedTo', 'name email')
        .sort({ createdAt: -1 });
    } else {
      // Resident sees only their complaints
      complaints = await Complaint.find({ resident: req.user._id })
        .populate('assignedTo', 'name email')
        .sort({ createdAt: -1 });
    }

    res.status(200).json({
      success: true,
      count: complaints.length,
      complaints,
    });
  } catch (error) {
    console.error('Get complaints error:', error);
    res.status(500).json({ message: 'Server error while fetching complaints' });
  }
};

// Create new complaint (resident only)
exports.createComplaint = async (req, res) => {
  try {
    // Validate input
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { title, description } = req.body;

    const complaint = new Complaint({
      title,
      description,
      resident: req.user._id,
      status: 'Pending',
    });

    await complaint.save();
    await complaint.populate('resident', 'name email apartment');

    res.status(201).json({
      success: true,
      message: 'Complaint created successfully',
      complaint,
    });
  } catch (error) {
    console.error('Create complaint error:', error);
    res.status(500).json({ message: 'Server error while creating complaint' });
  }
};

// Update complaint status (admin only)
exports.updateComplaint = async (req, res) => {
  try {
    // Validate input
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;
    const { status, assignedTo } = req.body;

    const complaint = await Complaint.findById(id);

    if (!complaint) {
      return res.status(404).json({ message: 'Complaint not found' });
    }

    // Update fields
    if (status) {
      complaint.status = status;
    }
    if (assignedTo) {
      complaint.assignedTo = assignedTo;
    }

    await complaint.save();
    await complaint.populate('resident', 'name email apartment');
    await complaint.populate('assignedTo', 'name email');

    res.status(200).json({
      success: true,
      message: 'Complaint updated successfully',
      complaint,
    });
  } catch (error) {
    console.error('Update complaint error:', error);
    res.status(500).json({ message: 'Server error while updating complaint' });
  }
};
