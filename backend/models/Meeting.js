const mongoose = require("mongoose");

const voteSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  optionIndex: { type: Number, required: true }
}, { _id: false });

const pollSchema = new mongoose.Schema({
  question: { type: String },
  options: [{ type: String }],
  votes: [voteSchema]
}, { _id: false });

const meetingSchema = new mongoose.Schema({
  title: { type: String, required: true },
  agenda: { type: String, required: true },
  date: { type: Date, required: true },
  location: { type: String, default: "Society Hall" },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  // Poll details
  poll: pollSchema,
}, { timestamps: true });

module.exports = mongoose.model("Meeting", meetingSchema);
