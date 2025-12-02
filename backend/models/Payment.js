const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema(
  {
    resident: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // YOUR EXISTING FIELDS
    amount: {
      type: Number,
      required: [true, "Amount is required"],
      min: 0,
      default: 1000,
    },

    dueDate: {
      type: Date,
    },

    description: {
      type: String,
      trim: true,
    },

    // UPDATED STATUS OPTIONS (your: Pending/Paid + add unpaid)
    status: {
      type: String,
      enum: ["Pending", "Paid", "Unpaid"],
      default: "Pending",
    },

    paidAt: {
      type: Date,
    },

    // NEW FIELDS FOR MANUAL PAYMENT FEATURE
    month: {
      type: String, // "2025-01"
    },

    referenceId: {
      type: String, // UPI transaction ID (optional)
    },

    proofImage: {
      type: String, // local upload path
    },

    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Payment", paymentSchema);
