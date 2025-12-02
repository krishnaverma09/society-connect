import { useEffect, useState } from "react";
import axios from "../../api/axios";
import "../../css/MeetingForms.css";

export default function MeetingDetails({ meetingId, onNavigate, setSelectedMeetingId }) {
  const [meeting, setMeeting] = useState(null);

  const fetchMeeting = async () => {
    try {
      const res = await axios.get(`/api/meetings/${meetingId}`);
      setMeeting(res.data);
    } catch (err) {
      alert("Failed to load meeting");
    }
  };

  useEffect(() => {
    if (meetingId) {
      fetchMeeting();
    }
  }, [meetingId]);

  if (!meeting) return (
    <div className="meeting-details-wrap">
      <div className="loading-state">Loading meeting details...</div>
    </div>
  );

  const user = JSON.parse(localStorage.getItem("user"));

  return (
    <div className="meeting-details-wrap">
      <div className="meeting-details-container">
        <button className="back-button" onClick={() => onNavigate && onNavigate('meetings:list')}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M19 12H5M5 12l7 7M5 12l7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Back to Meetings
        </button>

        <div className="meeting-details-card">
          <h1 className="meeting-details-title">{meeting.title}</h1>

          <div className="meeting-detail-item">
            <div className="meeting-detail-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <div className="meeting-detail-content">
              <div className="meeting-detail-label">Agenda</div>
              <div className="meeting-detail-text">{meeting.agenda}</div>
            </div>
          </div>

          <div className="meeting-detail-item">
            <div className="meeting-detail-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="3" y="4" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="2"/>
                <path d="M16 2v4M8 2v4M3 10h18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </div>
            <div className="meeting-detail-content">
              <div className="meeting-detail-label">Date & Time</div>
              <div className="meeting-detail-text">{new Date(meeting.date).toLocaleString('en-US', { 
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}</div>
            </div>
          </div>

          <div className="meeting-detail-item">
            <div className="meeting-detail-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <div className="meeting-detail-content">
              <div className="meeting-detail-label">Location</div>
              <div className="meeting-detail-text">{meeting.location || "Not specified"}</div>
            </div>
          </div>
        </div>

        {/* Resident: Vote Button */}
        {meeting.poll && user.role === "resident" && (
          <div className="meeting-actions-card">
            <h3 className="meeting-actions-title">Poll Available</h3>
            <button className="action-btn action-btn-view" style={{ width: '100%' }} onClick={() => {
              if (setSelectedMeetingId) setSelectedMeetingId(meetingId);
              if (onNavigate) onNavigate('meetings:vote');
            }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Vote in Poll
            </button>
          </div>
        )}

        {/* Admin: Actions */}
        {user.role === "admin" && (
          <div className="meeting-actions-card">
            <h3 className="meeting-actions-title">Actions</h3>
            <div className="meeting-actions-grid">
              <button className="action-btn action-btn-edit" onClick={() => {
                if (setSelectedMeetingId) setSelectedMeetingId(meetingId);
                if (onNavigate) onNavigate('meetings:edit');
              }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Edit Meeting
              </button>

              <button className="action-btn action-btn-delete" onClick={async () => {
                if (!confirm("Delete this meeting?")) return;
                try {
                  await axios.delete(`/api/meetings/${meetingId}`);
                  alert("Meeting deleted");
                  if (onNavigate) onNavigate('meetings:list');
                } catch (err) {
                  alert("Failed to delete meeting");
                }
              }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Delete Meeting
              </button>

              {!meeting.poll ? (
                <button className="action-btn action-btn-create" onClick={() => {
                  if (setSelectedMeetingId) setSelectedMeetingId(meetingId);
                  if (onNavigate) onNavigate('meetings:poll:create');
                }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                    <path d="M12 8v8M8 12h8" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                  Create Poll
                </button>
              ) : (
                <>
                  <button className="action-btn action-btn-view" onClick={() => {
                    if (setSelectedMeetingId) setSelectedMeetingId(meetingId);
                    if (onNavigate) onNavigate('meetings:results');
                  }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M9 17v-7M15 17v-4M12 17V7M21 12a9 9 0 11-18 0 9 9 0 0118 0z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    Poll Results
                  </button>

                  <button className="action-btn action-btn-delete" onClick={async () => {
                    if (!confirm("Delete poll?")) return;
                    try {
                      await axios.delete(`/api/meetings/${meetingId}/poll`);
                      alert("Poll deleted");
                      fetchMeeting();
                    } catch {
                      alert("Failed to delete poll");
                    }
                  }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    Delete Poll
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
