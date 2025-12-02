import { useEffect, useState } from "react";
import axios from "../../api/axios";
import "../../css/MeetingsPage.css";

export default function MeetingsPage({ onNavigate, setSelectedMeetingId }) {
  const [meetings, setMeetings] = useState([]);
  const [loading, setLoading] = useState(true);

  // FIX: user must be defined
  const user = JSON.parse(localStorage.getItem("user"));

  const fetchMeetings = async () => {
    try {
      const res = await axios.get("/api/meetings");
      setMeetings(res.data);
    } catch (err) {
      console.error(err);
      alert("Failed to fetch meetings");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMeetings();
  }, []);

  const handleViewDetails = (meetingId) => {
    if (setSelectedMeetingId) {
      setSelectedMeetingId(meetingId);
    }
    if (onNavigate) {
      onNavigate('meetings:details');
    }
  };

  const handleCreateMeeting = () => {
    if (onNavigate) {
      onNavigate('meetings:create');
    }
  };

  return (
    <div className="meetings-wrap">
      <div className="meetings-container">
        {/* Header */}
        <div className="meetings-header">
          <div>
            <h1 className="meetings-title">Meetings</h1>
            <p className="meetings-subtitle">View and manage upcoming meetings.</p>
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <div className="meetings-state">Loading meetings...</div>
        ) : meetings.length === 0 ? (
          <div className="meetings-empty">
            <h3>No meetings scheduled</h3>
            <p>Upcoming meetings will appear here.</p>
          </div>
        ) : (
          <div className="meetings-grid">
            {meetings.map((m) => (
              <div key={m._id} className="meeting-card">
                <h3>{m.title}</h3>
                
                <div className="meeting-info">
                  <div className="meeting-info-item">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <rect x="3" y="4" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="2"/>
                      <path d="M16 2v4M8 2v4M3 10h18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                    </svg>
                    <span className="meeting-info-label">Date:</span>
                    <span className="meeting-info-text">{new Date(m.date).toLocaleString('en-US', { 
                      month: '2-digit', 
                      day: '2-digit', 
                      year: 'numeric', 
                      hour: '2-digit', 
                      minute: '2-digit',
                      hour12: false
                    })}</span>
                  </div>
                  
                  <div className="meeting-info-item">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    <span className="meeting-info-label">Agenda:</span>
                    <span className="meeting-info-text">{m.agenda}</span>
                  </div>
                </div>

                <button className="meeting-view-btn" onClick={() => handleViewDetails(m._id)}>
                  View Details
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Floating Create Button - Admin only */}
        {user?.role === "admin" && (
          <button className="meetings-create-btn-floating" onClick={handleCreateMeeting}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
              <path d="M12 8v8M8 12h8" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            Create Meeting
          </button>
        )}
      </div>
    </div>
  );
}
