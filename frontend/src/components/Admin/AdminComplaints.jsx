import { useEffect, useState } from "react";
import { getComplaints, updateComplaint } from "../../api/complaints";
import "../../css/AdminComplaints.css";

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

  const handleStatusChange = async (id, newStatus) => {
    try {
      await updateComplaint(id, { status: newStatus });
      load(); // Reload complaints after update
    } catch (err) {
      console.error("Error updating complaint", err);
    }
  };

  return (
    <div className="admin-complaints-wrapper">
      <h1 className="admin-complaints-title">Manage Complaints</h1>

      {/* Filters */}
      <div className="admin-filters">
        <div className="search-input-wrapper">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="11" cy="11" r="8" stroke="#666" strokeWidth="2"/>
            <path d="m21 21-4.35-4.35" stroke="#666" strokeWidth="2" strokeLinecap="round"/>
          </svg>
          <input
            type="text"
            placeholder="Search title or resident..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="admin-search-input"
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="admin-status-select"
        >
          <option value="">All Status</option>
          <option value="Pending">Pending</option>
          <option value="In Progress">In Progress</option>
          <option value="Resolved">Resolved</option>
        </select>
      </div>

      {/* Complaints List */}
      <div className="complaints-list">
        {filtered.map((c) => (
          <div key={c._id} className="admin-complaint-card">
            <div className="complaint-main">
              <div className="complaint-content">
                <h3 className="complaint-title">{c.title}</h3>
                <p className="complaint-desc">{c.description}</p>
                
                <div className="complaint-meta">
                  <span className="meta-item"><strong>Apartment:</strong> {c.resident?.apartmentNumber || 'N/A'}</span>
                  <span className="meta-item"><strong>By:</strong> {c.resident?.name || 'Unknown'}</span>
                  <span className="meta-item">
                    <strong>Status:</strong> 
                    <span className={`status-badge status-${(c.status || '').toLowerCase().replace(/\s+/g, '-')}`}>
                      {c.status || 'Pending'}
                    </span>
                  </span>
                </div>

                {/* Status Buttons */}
                <div className="status-buttons">
                  <button 
                    className={`status-btn ${c.status === 'Pending' ? 'active-pending' : ''}`}
                    onClick={() => handleStatusChange(c._id, "Pending")}
                  >
                    Pending
                  </button>
                  <button 
                    className={`status-btn ${c.status === 'In Progress' ? 'active-progress' : ''}`}
                    onClick={() => handleStatusChange(c._id, "In Progress")}
                  >
                    In Progress
                  </button>
                  <button 
                    className={`status-btn ${c.status === 'Resolved' ? 'active-resolved' : ''}`}
                    onClick={() => handleStatusChange(c._id, "Resolved")}
                  >
                    Resolved
                  </button>
                </div>
              </div>

              {/* Image */}
              {c.image && (
                <div className="complaint-image">
                  <img
                    src={`${import.meta.env.VITE_API_BASE_URL}${c.image}`}
                    alt="Complaint"
                  />
                </div>
              )}
            </div>
          </div>
        ))}

        {filtered.length === 0 && (
          <div className="no-complaints">
            <p>No complaints found</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminComplaints;
