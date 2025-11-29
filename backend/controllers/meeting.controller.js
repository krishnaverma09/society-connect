const Meeting = require("../models/Meeting");

// ================================
// Create Meeting (Admin)
// ================================
const createMeeting = async (req, res) => {
  try {
    const { title, agenda, date, location } = req.body;

    const meeting = await Meeting.create({
      title,
      agenda,
      date,
      location,
      createdBy: req.user.id
    });

    res.status(201).json({
      success: true,
      message: "Meeting created successfully",
      meeting
    });

  } catch (err) {
    console.error("Create meeting error:", err);
    res.status(500).json({ message: "Failed to create meeting" });
  }
};

// ================================
// Get All Meetings
// ================================
const getMeetings = async (req, res) => {
  try {
    const meetings = await Meeting.find().sort({ date: 1 });
    res.json(meetings);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch meetings" });
  }
};

// ================================
// Get Meeting by ID
// ================================
const getMeetingById = async (req, res) => {
  try {
    const meeting = await Meeting.findById(req.params.id);
    if (!meeting)
      return res.status(404).json({ message: "Meeting not found" });

    res.json(meeting);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch meeting" });
  }
};

// ================================
// Admin → Create Poll
// ================================
const createPoll = async (req, res) => {
  try {
    const { question, options } = req.body;
    const meeting = await Meeting.findById(req.params.id);

    if (!meeting)
      return res.status(404).json({ message: "Meeting not found" });

    meeting.poll = { question, options, votes: [] };
    await meeting.save();

    res.json({
      success: true,
      message: "Poll created successfully",
      poll: meeting.poll
    });

  } catch (err) {
    res.status(500).json({ message: "Failed to create poll" });
  }
};

// ================================
// Resident → Vote
// ================================
const submitVote = async (req, res) => {
  try {
    const meeting = await Meeting.findById(req.params.id);
    if (!meeting)
      return res.status(404).json({ message: "Meeting not found" });

    if (!meeting.poll)
      return res.status(400).json({ message: "Poll not available" });

    const { optionIndex } = req.body;

    meeting.poll.votes = meeting.poll.votes.filter(
      (v) => v.userId.toString() !== req.user.id
    );

    meeting.poll.votes.push({
      userId: req.user.id,
      optionIndex
    });

    await meeting.save();

    res.json({
      success: true,
      message: "Vote submitted"
    });

  } catch (err) {
    console.error("Vote error:", err);
    res.status(500).json({ message: "Failed to submit vote" });
  }
};

// ================================
// Admin → Poll Results
// ================================
const getPollResults = async (req, res) => {
  try {
    const meeting = await Meeting.findById(req.params.id);
    if (!meeting)
      return res.status(404).json({ message: "Meeting not found" });

    if (!meeting.poll)
      return res.status(400).json({ message: "Poll not found" });

    const counts = Array(meeting.poll.options.length).fill(0);
    meeting.poll.votes.forEach(v => counts[v.optionIndex]++);

    res.json({
      question: meeting.poll.question,
      options: meeting.poll.options,
      votes: counts
    });

  } catch (err) {
    res.status(500).json({ message: "Failed to fetch poll results" });
  }
};


const updateMeeting = async (req, res) => {
  try {
    const { title, agenda, date, location } = req.body;

    const meeting = await Meeting.findByIdAndUpdate(
      req.params.id,
      { title, agenda, date, location },
      { new: true }
    );

    if (!meeting) {
      return res.status(404).json({ message: "Meeting not found" });
    }

    res.json({
      success: true,
      message: "Meeting updated successfully",
      meeting
    });
  } catch (err) {
    console.error("Update meeting error:", err);
    res.status(500).json({ message: "Failed to update meeting" });
  }
};

const deleteMeeting = async (req, res) => {
  try {
    const meeting = await Meeting.findByIdAndDelete(req.params.id);

    if (!meeting) {
      return res.status(404).json({ message: "Meeting not found" });
    }

    res.json({
      success: true,
      message: "Meeting deleted successfully"
    });
  } catch (err) {
    console.error("Delete meeting error:", err);
    res.status(500).json({ message: "Failed to delete meeting" });
  }
};

const deletePoll = async (req, res) => {
  try {
    const meeting = await Meeting.findById(req.params.id);

    if (!meeting) {
      return res.status(404).json({ message: "Meeting not found" });
    }

    meeting.poll = undefined;
    await meeting.save();

    res.json({
      success: true,
      message: "Poll deleted successfully"
    });
  } catch (err) {
    console.error("Delete poll error:", err);
    res.status(500).json({ message: "Failed to delete poll" });
  }
};


module.exports = {
  createMeeting,
  getMeetings,
  getMeetingById,
  createPoll,
  submitVote,
  getPollResults,
  updateMeeting,
  deleteMeeting,
  deletePoll
};

