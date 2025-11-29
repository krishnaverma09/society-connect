const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/auth.middleware");
const roleMiddleware = require("../middleware/role.middleware");
const m = require("../controllers/meeting.controller");

// Admin → create meeting
router.post("/", authMiddleware, roleMiddleware("admin"), m.createMeeting);

// All residents & admin → view meetings
router.get("/", authMiddleware, m.getMeetings);
router.get("/:id", authMiddleware, m.getMeetingById);

// Admin → create poll
router.post("/:id/poll", authMiddleware, roleMiddleware("admin"), m.createPoll);

// Residents → vote
router.post("/:id/vote", authMiddleware, roleMiddleware("resident"), m.submitVote);

// Admin → poll results
router.get("/:id/results", authMiddleware, roleMiddleware("admin"), m.getPollResults);

// Admin → update meeting
router.put("/:id", authMiddleware, roleMiddleware("admin"), m.updateMeeting);

// Admin → delete meeting
router.delete("/:id", authMiddleware, roleMiddleware("admin"), m.deleteMeeting);

// Admin → delete poll
router.delete("/:id/poll", authMiddleware, roleMiddleware("admin"), m.deletePoll);


module.exports = router;
