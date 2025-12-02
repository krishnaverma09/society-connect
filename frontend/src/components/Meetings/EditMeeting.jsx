import { useState, useEffect } from "react";
import axios from "../../api/axios";
import { useParams, useNavigate } from "react-router-dom";

export default function EditMeeting() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [meeting, setMeeting] = useState(null);

  const loadMeeting = async () => {
    const res = await axios.get(`/api/meetings/${id}`);
    setMeeting(res.data);
  };

  useEffect(() => {
    loadMeeting();
  }, []);

  const updateMeeting = async () => {
    try {
      await axios.put(`/api/meetings/${id}`, meeting);
      alert("Meeting updated!");
      navigate(`/meetings/${id}`);
    } catch {
      alert("Failed to update meeting");
    }
  };

  if (!meeting) return <p>Loading...</p>;

  return (
    <div style={{ padding: "20px" }}>
      <h2>Edit Meeting</h2>

      <input
        type="text"
        value={meeting.title}
        onChange={(e) => setMeeting({ ...meeting, title: e.target.value })}
        placeholder="Title"
      />

      <textarea
        value={meeting.agenda}
        onChange={(e) => setMeeting({ ...meeting, agenda: e.target.value })}
        placeholder="Agenda"
      ></textarea>

      <input
        type="datetime-local"
        value={meeting.date?.slice(0, 16)}
        onChange={(e) => setMeeting({ ...meeting, date: e.target.value })}
      />

      <input
        type="text"
        value={meeting.location}
        onChange={(e) => setMeeting({ ...meeting, location: e.target.value })}
        placeholder="Location"
      />

      <button onClick={updateMeeting}>Save Changes</button>
    </div>
  );
}
