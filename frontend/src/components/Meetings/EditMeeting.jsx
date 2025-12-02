import { useState, useEffect } from "react";
import axios from "../../api/axios";
import "../../css/MeetingForms.css";

export default function EditMeeting({ meetingId, onNavigate }) {
  const [meeting, setMeeting] = useState(null);

  const loadMeeting = async () => {
    const res = await axios.get(`/api/meetings/${meetingId}`);
    setMeeting(res.data);
  };

  useEffect(() => {
    if (meetingId) {
      loadMeeting();
    }
  }, [meetingId]);

  const updateMeeting = async () => {
    try {
      await axios.put(`/api/meetings/${meetingId}`, meeting);
      alert("Meeting updated!");
      if (onNavigate) onNavigate('meetings:details');
    } catch {
      alert("Failed to update meeting");
    }
  };

  if (!meeting) return (
    <div className="meeting-form-wrap">
      <div className="loading-state">Loading meeting details...</div>
    </div>
  );

  return (
    <div className="meeting-form-wrap">
      <div className="meeting-form-container">
        <button className="back-button" onClick={() => onNavigate && onNavigate('meetings:details')}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M19 12H5M5 12l7 7M5 12l7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Back to Details
        </button>

        <div className="meeting-form-header">
          <h1 className="meeting-form-title">Edit Meeting</h1>
          <p className="meeting-form-subtitle">Update meeting information</p>
        </div>

        <div className="meeting-form">
          <div className="form-group">
            <label className="form-label">Meeting Title</label>
            <input
              type="text"
              value={meeting.title}
              onChange={(e) => setMeeting({ ...meeting, title: e.target.value })}
              placeholder="Enter meeting title"
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Agenda</label>
            <textarea
              value={meeting.agenda}
              onChange={(e) => setMeeting({ ...meeting, agenda: e.target.value })}
              placeholder="Describe the meeting agenda"
              className="form-textarea"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Date & Time</label>
            <input
              type="datetime-local"
              value={meeting.date?.slice(0, 16)}
              onChange={(e) => setMeeting({ ...meeting, date: e.target.value })}
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Location</label>
            <input
              type="text"
              value={meeting.location || ''}
              onChange={(e) => setMeeting({ ...meeting, location: e.target.value })}
              placeholder="Enter meeting location"
              className="form-input"
            />
          </div>

          <div className="form-actions">
            <button className="btn-secondary" onClick={() => onNavigate && onNavigate('meetings:details')}>
              Cancel
            </button>
            <button className="btn-primary" onClick={updateMeeting}>
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
