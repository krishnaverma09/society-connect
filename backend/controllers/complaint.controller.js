const { validationResult } = require("express-validator");
const Complaint = require("../models/Complaint");

// ========================
// Resident + Admin: Get Complaints
// ========================
exports.getComplaints = async (req, res) => {
  try {
    let complaints;

    if (req.user.role === "admin") {
      // Admin sees ALL
      complaints = await Complaint.find()
        .populate("resident", "name email apartmentNumber")
        .populate("assignedTo", "name email")
        .sort({ createdAt: -1 });
    } else {
      // Resident sees only THEIR complaints
      complaints = await Complaint.find({ resident: req.user._id })
        .populate("assignedTo", "name email")
        .sort({ createdAt: -1 });
    }

    return res.status(200).json({
      success: true,
      count: complaints.length,
      complaints,
    });
  } catch (error) {
    console.error("Get complaints error:", error);
    return res
      .status(500)
      .json({ message: "Server error while fetching complaints" });
  }
};

// ========================
// Resident: Create Complaint
// ========================
exports.createComplaint = async (req, res) => {
  try {
    // validation from express-validator
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { title, description } = req.body;

    const residentId = req.user._id;
    const apartmentNumber = req.user.apartmentNumber;

    const image = req.file ? `/uploads/${req.file.filename}` : null;

    const complaint = await Complaint.create({
      title,
      description,
      resident: residentId,
      apartmentNumber,
      status: "Pending",
      image,
    });

    await complaint.populate("resident", "name email apartmentNumber");

    return res.status(201).json({
      success: true,
      message: "Complaint created successfully",
      complaint,
    });
  } catch (error) {
    console.error("Create complaint error:", error);
    return res
      .status(500)
      .json({ message: "Server error while creating complaint" });
  }
};

// ========================
// Admin: Update Complaint (status, notes, assignee)
// ========================
exports.updateComplaint = async (req, res) => {
  try {
    // validate
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const complaintId = req.params.id;
    const { status, assignedTo, adminNotes } = req.body;

    const complaint = await Complaint.findById(complaintId);

    if (!complaint) {
      return res.status(404).json({ message: "Complaint not found" });
    }

    // Update fields
    if (status) complaint.status = status;
    if (assignedTo) complaint.assignedTo = assignedTo;
    if (adminNotes !== undefined) complaint.adminNotes = adminNotes;

    await complaint.save();

    await complaint.populate("resident", "name email apartmentNumber");
    await complaint.populate("assignedTo", "name email");

    return res.status(200).json({
      success: true,
      message: "Complaint updated successfully",
      complaint,
    });
  } catch (error) {
    console.error("Update complaint error:", error);
    return res
      .status(500)
      .json({ message: "Server error while updating complaint" });
  }
};

// ========================
// Resident: Edit Complaint
// ========================
const fs = require("fs");
const path = require("path");

exports.editComplaint = async (req, res) => {
  try {
    const complaintId = req.params.id;

    const complaint = await Complaint.findById(complaintId);
    if (!complaint) {
      return res.status(404).json({ message: "Complaint not found" });
    }

    // Resident can edit ONLY their own complaint
    if (complaint.resident.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to edit this complaint" });
    }

    const { title, description } = req.body;

    if (title) complaint.title = title;
    if (description) complaint.description = description;

    // If new image uploaded → delete old one
    if (req.file) {
      if (complaint.image) {
        const oldPath = path.join(__dirname, "..", complaint.image);
        fs.unlink(oldPath, (err) => {
          if (err) console.log("Failed to delete old image:", err);
        });
      }

      complaint.image = `/uploads/${req.file.filename}`;
    }

    await complaint.save();

    return res.status(200).json({
      success: true,
      message: "Complaint updated successfully",
      complaint
    });

  } catch (error) {
    console.error("Edit complaint error:", error);
    return res.status(500).json({ message: "Server error while editing complaint" });
  }
};

// ========================
// Resident: Delete Complaint
// ========================
exports.deleteComplaint = async (req, res) => {
  try {
    const complaintId = req.params.id;

    const complaint = await Complaint.findById(complaintId);
    if (!complaint) {
      return res.status(404).json({ message: "Complaint not found" });
    }

    // Resident can delete ONLY their own complaint
    if (complaint.resident.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to delete this complaint" });
    }

    // Delete uploaded image
    if (complaint.image) {
      const imgPath = path.join(__dirname, "..", complaint.image);
      fs.unlink(imgPath, (err) => {
        if (err) console.log("Failed to delete image:", err);
      });
    }

    await complaint.deleteOne();

    return res.status(200).json({
      success: true,
      message: "Complaint deleted successfully"
    });

  } catch (error) {
    console.error("Delete complaint error:", error);
    return res.status(500).json({ message: "Server error while deleting complaint" });
  }
};
