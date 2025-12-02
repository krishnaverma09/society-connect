import { useState, useEffect } from "react";
import axios from "../../api/axios";
import { useParams, useNavigate } from "react-router-dom";

export default function PollVotePage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [meeting, setMeeting] = useState(null);
  const [selected, setSelected] = useState(null);

  const loadMeeting = async () => {
    try {
      const res = await axios.get(`/api/meetings/${id}`);
      setMeeting(res.data);
    } catch (err) {
      alert("Failed to load poll");
    }
  };

  useEffect(() => {
    loadMeeting();
  }, []);

  const submitVote = async () => {
    try {
      await axios.post(`/api/meetings/${id}/vote`, {
        optionIndex: selected,
      });

      alert("Your vote has been submitted");
      navigate(`/meetings/${id}`);
    } catch (err) {
      alert("Failed to vote");
    }
  };

  if (!meeting) return <p>Loading...</p>;

  if (!meeting.poll) return <p>No poll available</p>;

  return (
    <div style={{ padding: "20px" }}>
      <h2>Vote in Poll</h2>

      <h3>{meeting.poll.question}</h3>

      {meeting.poll.options.map((opt, index) => (
        <div key={index}>
          <input
            type="radio"
            name="vote"
            checked={selected === index}
            onChange={() => setSelected(index)}
          />
          <label style={{ marginLeft: "8px" }}>{opt}</label>
        </div>
      ))}

      <br />

      <button disabled={selected === null} onClick={submitVote}>
        Submit Vote
      </button>
    </div>
  );
}
