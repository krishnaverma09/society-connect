import { useState, useEffect } from "react";
import axios from "../../api/axios";
import { useParams } from "react-router-dom";

export default function PollResultsPage() {
  const { id } = useParams();
  const [results, setResults] = useState(null);

  const load = async () => {
    const res = await axios.get(`/api/meetings/${id}/results`);
    setResults(res.data);
  };

  useEffect(() => {
    load();
  }, []);

  if (!results) return <p>Loading...</p>;

  return (
    <div style={{ padding: "20px" }}>
      <h2>{results.question}</h2>

      {results.options.map((opt, i) => (
        <p key={i}>
          {opt}: <b>{results.votes[i]}</b> votes
        </p>
      ))}
    </div>
  );
}
