import { useEffect, useState } from "react";
import axios from "../../api/axios";
import { useParams, Link, useNavigate } from "react-router-dom";

export default function MeetingDetails() {
  const { id } = useParams();
  const [meeting, setMeeting] = useState(null);
  const navigate = useNavigate();

  const fetchMeeting = async () => {
    try {
      const res = await axios.get(`/api/meetings/${id}`);
      setMeeting(res.data);
    } catch (err) {
      alert("Failed to load meeting");
    }
  };

  useEffect(() => {
    fetchMeeting();
  }, []);

  if (!meeting) return <p>Loading...</p>;

  const user = JSON.parse(localStorage.getItem("user"));

  return (
    <div style={{ padding: "20px" }}>
      <h2>{meeting.title}</h2>
      <p>
        <b>Agenda:</b> {meeting.agenda}
      </p>
      <p>
        <b>Date:</b> {new Date(meeting.date).toLocaleString()}
      </p>
      <p><b>Location:</b> {meeting.location || "Not specified"}</p>

      {/* Resident: Vote */}
      {meeting.poll && user.role === "resident" && (
        <button onClick={() => navigate(`/meetings/${id}/vote`)}>
          Vote in Poll
        </button>
      )}

      {/* Admin: Create poll or view results */}
      {user.role === "admin" && (
  <div style={{ marginTop: "20px", display: "flex", gap: "10px" }}>
    
    {/* Update Meeting */}
    <button onClick={() => navigate(`/meetings/${id}/edit`)}>
      Edit Meeting
    </button>

    {/* Delete Meeting */}
    <button
      style={{ background: "red", color: "white" }}
      onClick={async () => {
        if (!confirm("Delete this meeting?")) return;

        try {
          await axios.delete(`/api/meetings/${id}`);
          alert("Meeting deleted");
          navigate("/meetings");
        } catch (err) {
          alert("Failed to delete meeting");
        }
      }}
    >
      Delete Meeting
    </button>

    {/* Poll Actions */}
    {!meeting.poll ? (
      <button onClick={() => navigate(`/meetings/${id}/poll/create`)}>
        Create Poll
      </button>
    ) : (
      <>
        <Link to={`/meetings/${id}/results`}>
          <button>View Poll Results</button>
        </Link>

        <button
          style={{ background: "red", color: "white" }}
          onClick={async () => {
            if (!confirm("Delete poll?")) return;
            try {
              await axios.delete(`/api/meetings/${id}/poll`);
              alert("Poll deleted");
              fetchMeeting();
            } catch {
              alert("Failed to delete poll");
            }
          }}
        >
          Delete Poll
        </button>
      </>
    )}
  </div>
)}

    </div>
  );
}
