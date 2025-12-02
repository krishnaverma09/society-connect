import { useState, useEffect } from "react";
import axios from "../../api/axios";
import "../../css/MeetingForms.css";

export default function CreatePoll({ meetingId, onNavigate }) {
  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState(["", ""]); // minimum 2 options
  const [meeting, setMeeting] = useState(null);

  // Load meeting to show title/agenda
  const fetchMeeting = async () => {
    try {
      const res = await axios.get(`/api/meetings/${meetingId}`);
      setMeeting(res.data);
    } catch (err) {
      alert("Failed to load meeting details");
    }
  };

  useEffect(() => {
    if (meetingId) {
      fetchMeeting();
    }
  }, [meetingId]);

  const handleOptionChange = (value, index) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const addOption = () => {
    setOptions([...options, ""]);

    const removeOption = (index) => {
      if (options.length > 2) {
        const newOptions = options.filter((_, i) => i !== index);
        setOptions(newOptions);
      }
    };
  };

  const submitPoll = async (e) => {
    e.preventDefault();

    if (!question.trim()) {
      alert("Poll question is required");
      return;
    }

    const cleanOptions = options.map((o) => o.trim()).filter((o) => o !== "");

    if (cleanOptions.length < 2) {
      alert("At least 2 valid options are required");
      return;
    }

    try {
      await axios.post(`/api/meetings/${meetingId}/poll`, {
        question,
        options: cleanOptions,
      });

      alert("Poll created successfully!");
      if (onNavigate) onNavigate('meetings:details');
    } catch (err) {
      console.error(err);
      alert("Failed to create poll");
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
          Back to Meeting
        </button>

        <div className="meeting-form-header">
          <h1 className="meeting-form-title">Create Poll</h1>
          <p className="meeting-form-subtitle">For: {meeting.title}</p>
        </div>

        <form onSubmit={submitPoll} className="meeting-form">
          <div className="form-group">
            <label className="form-label">Poll Question *</label>
            <input
              type="text"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Enter your poll question"
              className="form-input"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Options *</label>
            {options.map((opt, idx) => (
              <div key={idx} style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                <input
                  type="text"
                  value={opt}
                  placeholder={`Option ${idx + 1}`}
                  onChange={(e) => handleOptionChange(e.target.value, idx)}
                  className="form-input"
                  style={{ marginBottom: 0 }}
                  required
                />
                {options.length > 2 && (
                  <button
                    type="button"
                    onClick={() => removeOption(idx)}
                    style={{
                      padding: '0 16px',
                      background: '#dc2626',
                      color: 'white',
                      border: 'none',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      fontSize: '18px',
                      fontWeight: 'bold'
                    }}
                  >
                    ×
                  </button>
                )}
              </div>
            ))}
            <button type="button" onClick={addOption} className="btn-add" style={{ marginTop: '12px' }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                <path d="M12 8v8M8 12h8" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
              Add Option
            </button>
          </div>

          <div className="form-actions">
            <button type="button" className="btn-secondary" onClick={() => onNavigate && onNavigate('meetings:details')}>
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              Create Poll
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
