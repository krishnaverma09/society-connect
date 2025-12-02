import { useState, useEffect } from "react";
import axios from "../../api/axios";
import "../../css/MeetingForms.css";

export default function PollVotePage({ meetingId, onNavigate }) {
  const [meeting, setMeeting] = useState(null);
  const [selected, setSelected] = useState(null);

  const loadMeeting = async () => {
    try {
      const res = await axios.get(`/api/meetings/${meetingId}`);
      setMeeting(res.data);
    } catch (err) {
      alert("Failed to load poll");
    }
  };

  useEffect(() => {
    if (meetingId) {
      loadMeeting();
    }
  }, [meetingId]);

  const submitVote = async () => {
    try {
      await axios.post(`/api/meetings/${meetingId}/vote`, {
        optionIndex: selected,
      });

      alert("Your vote has been submitted");
      if (onNavigate) onNavigate('meetings:details');
    } catch (err) {
      alert("Failed to vote");
    }
  };

  if (!meeting) return (
    <div className="poll-vote-wrap">
      <div className="loading-state">Loading poll...</div>
    </div>
  );

  if (!meeting.poll) return (
    <div className="poll-vote-wrap">
      <div className="empty-state">No poll available</div>
    </div>
  );

  return (
    <div className="poll-vote-wrap">
      <div className="poll-vote-container">
        <button className="back-button" onClick={() => onNavigate && onNavigate('meetings:details')}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M19 12H5M5 12l7 7M5 12l7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Back to Meeting
        </button>

        <h2 className="poll-question">{meeting.poll.question}</h2>

        <div className="poll-options">
          {meeting.poll.options.map((opt, index) => (
            <div 
              key={index} 
              className={`poll-option ${selected === index ? 'selected' : ''}`}
              onClick={() => setSelected(index)}
            >
              <input
                type="radio"
                name="vote"
                id={`option-${index}`}
                checked={selected === index}
                onChange={() => setSelected(index)}
              />
              <label htmlFor={`option-${index}`}>{opt}</label>
            </div>
          ))}
        </div>

        <button 
          className="btn-primary" 
          disabled={selected === null} 
          onClick={submitVote}
          style={{ width: '100%' }}
        >
          Submit Vote
        </button>
      </div>
    </div>
  );
}
