import { useState } from "react";
import axios from "../../api/axios";
import { useNavigate } from "react-router-dom";

export default function CreateMeeting() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    agenda: "",
    date: "",
    location: "",
  });

  const onChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const submit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("/api/meetings", form);
      alert("Meeting created!");
      navigate("/meetings");
    } catch (err) {
      alert("Failed to create meeting");
      console.error(err);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Create Meeting (Admin)</h1>

      <form onSubmit={submit}>
        <input
          type="text"
          name="title"
          placeholder="Title"
          value={form.title}
          onChange={onChange}
          required
        /><br />

        <textarea
          name="agenda"
          placeholder="Agenda"
          value={form.agenda}
          onChange={onChange}
          required
        /><br />

        <input
          type="datetime-local"
          name="date"
          value={form.date}
          onChange={onChange}
          required
        /><br />

        <input
          type="text"
          name="location"
          placeholder="Location"
          value={form.location}
          onChange={onChange}
        /><br />

        <button type="submit">Create Meeting</button>
      </form>
    </div>
  );
}
