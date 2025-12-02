import { useState, useEffect } from "react";
import axios from "../../api/axios";
import "../../css/MeetingForms.css";

export default function PollResultsPage({ meetingId, onNavigate }) {
  const [results, setResults] = useState(null);

  const load = async () => {
    const res = await axios.get(`/api/meetings/${meetingId}/results`);
    setResults(res.data);
  };

  useEffect(() => {
    if (meetingId) {
      load();
    }
  }, [meetingId]);

  if (!results) return (
    <div className="poll-results-wrap">
      <div className="loading-state">Loading poll results...</div>
    </div>
  );

  const totalVotes = results.votes.reduce((sum, v) => sum + v, 0);

  return (
    <div className="poll-results-wrap">
      <div className="poll-results-container">
        <button className="back-button" onClick={() => onNavigate && onNavigate('meetings:details')}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M19 12H5M5 12l7 7M5 12l7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Back to Meeting
        </button>

        <h2 className="poll-results-title">{results.question}</h2>

        <div style={{ marginBottom: '32px', padding: '16px', background: '#f5f0e6', borderRadius: '12px', textAlign: 'center' }}>
          <div style={{ fontSize: '14px', color: '#666666', marginBottom: '4px' }}>Total Votes</div>
          <div style={{ fontSize: '32px', fontWeight: '900', color: '#1a1a1a' }}>{totalVotes}</div>
        </div>

        {results.options.map((opt, i) => {
          const votes = results.votes[i];
          const percentage = totalVotes > 0 ? ((votes / totalVotes) * 100).toFixed(1) : 0;
          
          return (
            <div key={i} className="poll-result-item">
              <div className="poll-result-option">{opt}</div>
              <div className="poll-result-bar-container">
                <div className="poll-result-bar" style={{ width: `${percentage}%` }}>
                  <span className="poll-result-bar-text">{percentage}%</span>
                </div>
              </div>
              <div className="poll-result-votes">
                {votes} {votes === 1 ? 'vote' : 'votes'}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
