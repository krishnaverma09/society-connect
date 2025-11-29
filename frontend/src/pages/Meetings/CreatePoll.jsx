import { useState, useEffect } from "react";
import axios from "../../api/axios";
import { useParams, useNavigate } from "react-router-dom";

export default function CreatePoll() {
  const { id } = useParams(); // meeting ID
  const navigate = useNavigate();

  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState(["", ""]); // minimum 2 options
  const [meeting, setMeeting] = useState(null);

  // Load meeting to show title/agenda
  const fetchMeeting = async () => {
    try {
      const res = await axios.get(`/api/meetings/${id}`);
      setMeeting(res.data);
    } catch (err) {
      alert("Failed to load meeting details");
    }
  };

  useEffect(() => {
    fetchMeeting();
  }, []);

  const handleOptionChange = (value, index) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const addOption = () => {
    setOptions([...options, ""]);
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
      await axios.post(`/api/meetings/${id}/poll`, {
        question,
        options: cleanOptions,
      });

      alert("Poll created successfully!");
      navigate(`/meetings/${id}`);
    } catch (err) {
      console.error(err);
      alert("Failed to create poll");
    }
  };

  if (!meeting) return <p>Loading...</p>;

  return (
    <div style={{ padding: "20px" }}>
      <h1>Create Poll for: {meeting.title}</h1>

      <form onSubmit={submitPoll} style={{ maxWidth: "500px" }}>
        <label>Poll Question:</label>
        <input
          type="text"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          style={{ width: "100%", marginBottom: "10px" }}
          required
        />

        <label>Options:</label>
        {options.map((opt, idx) => (
          <input
            key={idx}
            type="text"
            value={opt}
            placeholder={`Option ${idx + 1}`}
            onChange={(e) => handleOptionChange(e.target.value, idx)}
            style={{ width: "100%", marginBottom: "8px" }}
            required
          />
        ))}

        <button type="button" onClick={addOption} style={{ marginTop: "10px" }}>
          + Add Option
        </button>

        <br /><br />

        <button type="submit">Create Poll</button>
      </form>
    </div>
  );
}
