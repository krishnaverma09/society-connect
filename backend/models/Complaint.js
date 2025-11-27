const mongoose = require('mongoose');

const complaintSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
    },

    // Complaint status
    status: {
      type: String,
      enum: ['Pending', 'In Progress', 'Resolved'],
      default: 'Pending',
    },

    // Which resident created this complaint
    resident: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },

    // Optionally assign a staff/admin
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },

    // NEW: Apartment number (auto from user on creation)
    apartmentNumber: {
      type: String,
      required: true,
    },

    // NEW: Image support (optional)
    image: {
      type: String, // stored as "/uploads/image.jpg"
      default: null,
    },

    // NEW: Admin notes (optional)
    adminNotes: {
      type: String,
      default: "",
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Complaint', complaintSchema);
