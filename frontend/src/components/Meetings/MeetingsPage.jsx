import { useEffect, useState } from "react";
import axios from "../../api/axios";
import { Link } from "react-router-dom";

export default function MeetingsPage() {
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

  return (
    <div style={{ padding: "20px" }}>
      <h1>Meetings</h1>

      {/* Admin-only create button */}
      {user?.role === "admin" && (
        <Link to="/meetings/create">
          <button style={{ marginBottom: "20px" }}>Create Meeting</button>
        </Link>
      )}

      {loading ? (
        <p>Loading...</p>
      ) : (
        meetings.map((m) => (
          <div
            key={m._id}
            style={{
              border: "1px solid #ddd",
              margin: "10px",
              padding: "10px",
            }}
          >
            <h3>{m.title}</h3>
            <p>
              <b>Date:</b> {new Date(m.date).toLocaleString()}
            </p>
            <p>
              <b>Agenda:</b> {m.agenda}
            </p>

            <Link to={`/meetings/${m._id}`}>
              <button>View Details</button>
            </Link>
          </div>
        ))
      )}
    </div>
  );
}
