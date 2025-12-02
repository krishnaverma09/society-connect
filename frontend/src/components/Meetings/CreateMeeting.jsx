import { useState } from "react";
import axios from "../../api/axios";
import "../../css/MeetingForms.css";

export default function CreateMeeting({ onNavigate }) {
  const [form, setForm] = useState({
    title: "",
    agenda: "",
    date: "",
    location: "",
  });

  const onChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const submit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("/api/meetings", form);
      alert("Meeting created!");
      if (onNavigate) onNavigate('meetings:list');
    } catch (err) {
      alert("Failed to create meeting");
      console.error(err);
    }
  };

  return (
    <div className="meeting-form-wrap">
      <div className="meeting-form-container">
        <button className="back-button" onClick={() => onNavigate && onNavigate('meetings:list')}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M19 12H5M5 12l7 7M5 12l7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Back to Meetings
        </button>

        <div className="meeting-form-header">
          <h1 className="meeting-form-title">Create Meeting</h1>
          <p className="meeting-form-subtitle">Schedule a new meeting for residents</p>
        </div>

        <form onSubmit={submit} className="meeting-form">
          <div className="form-group">
            <label className="form-label">Meeting Title *</label>
            <input
              type="text"
              name="title"
              placeholder="Enter meeting title"
              value={form.title}
              onChange={onChange}
              className="form-input"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Agenda *</label>
            <textarea
              name="agenda"
              placeholder="Describe the meeting agenda"
              value={form.agenda}
              onChange={onChange}
              className="form-textarea"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Date & Time *</label>
            <input
              type="datetime-local"
              name="date"
              value={form.date}
              onChange={onChange}
              className="form-input"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Location</label>
            <input
              type="text"
              name="location"
              placeholder="Enter meeting location"
              value={form.location}
              onChange={onChange}
              className="form-input"
            />
          </div>

          <div className="form-actions">
            <button type="button" className="btn-secondary" onClick={() => onNavigate && onNavigate('meetings:list')}>
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              Create Meeting
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
