import { useEffect, useState } from "react";
import { getComplaints, updateComplaint } from "../../api/complaints";

const AdminComplaints = () => {
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
      console.error("Error loading complaints", err);
    }
  };

  // 🔍 Filter + Search
  useEffect(() => {
    let data = complaints;

    if (search.trim()) {
      data = data.filter(c =>
        c.title.toLowerCase().includes(search.toLowerCase()) ||
        c.resident?.name?.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (statusFilter) {
      data = data.filter(c => c.status === statusFilter);
    }

    setFiltered(data);
  }, [search, statusFilter, complaints]);

  return (
    <div className="page-container">
      <h2>Manage Complaints</h2>

      {/* Filters */}
      <div className="filters" style={{ display: "flex", gap: "10px", marginBottom: "15px" }}>
        <input
          type="text"
          placeholder="Search title or resident..."
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

      {filtered.map((c) => (
        <div key={c._id} className="complaint-card">
          <h3>{c.title}</h3>
          <p>{c.description}</p>
          <p>Apartment: {c.resident?.apartmentNumber}</p>
          <p>By: {c.resident?.name}</p>
          <p>Status: <strong>{c.status}</strong></p>

          {/* Image */}
          {c.image && (
  <img
    src={`${import.meta.env.VITE_API_BASE_URL}${c.image}`}
    alt="Complaint"
    style={{ width: "180px", borderRadius: "8px", marginTop: "10px" }}
  />
)}

          {/* Status Buttons */}
          <div className="status-buttons" style={{ marginTop: "10px" }}>
            <button onClick={() => updateComplaint(c._id, { status: "Pending" })}>Pending</button>
            <button onClick={() => updateComplaint(c._id, { status: "In Progress" })}>In Progress</button>
            <button onClick={() => updateComplaint(c._id, { status: "Resolved" })}>Resolved</button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AdminComplaints;
