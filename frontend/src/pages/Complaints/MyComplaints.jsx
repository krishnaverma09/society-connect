import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  getComplaints,
  deleteComplaint
} from "../../api/complaints";

const MyComplaints = () => {
  const navigate = useNavigate();

  const [complaints, setComplaints] = useState([]);
  const [filtered, setFiltered] = useState([]);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    try {
      const res = await getComplaints();
      setComplaints(res.data.complaints);
      setFiltered(res.data.complaints);
    } catch (err) {
      console.error("Failed to load complaints");
    }
  };

  // 🔍 Filtering logic
  useEffect(() => {
    let data = complaints;

    if (search.trim()) {
      data = data.filter((c) =>
        c.title.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (statusFilter) {
      data = data.filter((c) => c.status === statusFilter);
    }

    setFiltered(data);
  }, [search, statusFilter, complaints]);

  return (
    <div className="page-container">
      <h2>My Complaints</h2>

      {/* Filters */}
      <div
        className="filters"
        style={{ display: "flex", gap: "10px", marginBottom: "15px" }}
      >
        <input
          type="text"
          placeholder="Search complaints..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="input"
        />

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="input"
        >
          <option value="">All Status</option>
          <option value="Pending">Pending</option>
          <option value="In Progress">In Progress</option>
          <option value="Resolved">Resolved</option>
        </select>
      </div>

      {filtered.length === 0 && <p>No complaints found.</p>}

      {filtered.map((c) => (
        <div key={c._id} className="complaint-card">
          <h3>{c.title}</h3>
          <p>{c.description}</p>
          <p>
            Status: <strong>{c.status}</strong>
          </p>

          {/* Image */}
          {c.image && (
            <img
              src={`${import.meta.env.VITE_API_BASE_URL}${c.image}`}
              alt="Complaint"
              style={{ width: "180px", borderRadius: "8px", marginTop: "10px" }}
            />
          )}

          {/* Edit + Delete buttons */}
          <div style={{ marginTop: "10px" }}>
            <button
              onClick={() => navigate(`/complaints/edit/${c._id}`)}
              style={{
                background: "#444",
                color: "#fff",
                padding: "6px 12px",
                borderRadius: "6px",
                marginRight: "10px",
                cursor: "pointer",
              }}
            >
              Edit
            </button>

            <button
              onClick={async () => {
                if (!confirm("Are you sure you want to delete this complaint?"))
                  return;
                await deleteComplaint(c._id);
                load(); // refresh
              }}
              style={{
                background: "red",
                color: "white",
                padding: "6px 12px",
                borderRadius: "6px",
                cursor: "pointer",
              }}
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default MyComplaints;
