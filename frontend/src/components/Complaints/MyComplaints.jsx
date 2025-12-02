import { useEffect, useState } from "react";
import {
  getComplaints,
  deleteComplaint,
  createComplaint
} from "../../api/complaints";
import "../../css/MyComplaints.css";

const MyComplaints = ({ onNavigate, onEditComplaint }) => {

  const [complaints, setComplaints] = useState([]);
  const [filtered, setFiltered] = useState([]);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  // Create modal state
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);
  const [createError, setCreateError] = useState("");

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

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this complaint?")) return;
    try {
      await deleteComplaint(id);
      load(); // refresh
    } catch (err) {
      console.error("Failed to delete complaint");
    }
  };

  const handleCreateComplaint = async (e) => {
    e.preventDefault();
    setCreateError("");

    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", description);
      if (image) formData.append("image", image);

      await createComplaint(formData);
      
      // Reset form and close modal
      setTitle("");
      setDescription("");
      setImage(null);
      setShowCreateModal(false);
      
      // Reload complaints
      load();
    } catch (err) {
      setCreateError(err.response?.data?.message || "Failed to create complaint");
    }
  };

  return (
    <div className="my-complaints-wrapper">
      <h1 className="my-complaints-title">My Complaints</h1>

      {/* Filters */}
      <div className="my-complaints-filters">
        <div className="search-input-wrapper">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="11" cy="11" r="8" stroke="#666" strokeWidth="2"/>
            <path d="m21 21-4.35-4.35" stroke="#666" strokeWidth="2" strokeLinecap="round"/>
          </svg>
          <input
            type="text"
            placeholder="Search complaints..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="my-complaints-search-input"
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="my-complaints-status-select"
        >
          <option value="">All Status</option>
          <option value="Pending">Pending</option>
          <option value="In Progress">In Progress</option>
          <option value="Resolved">Resolved</option>
        </select>
      </div>

      {/* Complaints List */}
      <div className="my-complaints-list">
        {filtered.map((c) => (
          <div key={c._id} className="my-complaint-card">
            <div className="my-complaint-main">
              <div className="my-complaint-content">
                <h3 className="my-complaint-title">{c.title}</h3>
                <p className="my-complaint-desc">{c.description}</p>
                
                <div className="my-complaint-meta">
                  <span className="meta-item">
                    <strong>Status:</strong> 
                    <span className={`status-badge status-${(c.status || '').toLowerCase().replace(/\s+/g, '-')}`}>
                      {c.status || 'Pending'}
                    </span>
                  </span>
                </div>

                {/* Action Buttons */}
                <div className="action-buttons">
                  <button 
                    className="edit-btn"
                    onClick={() => onEditComplaint?.(c._id)}
                  >
                    Edit
                  </button>
                  <button 
                    className="delete-btn"
                    onClick={() => handleDelete(c._id)}
                  >
                    Delete
                  </button>
                </div>
              </div>

              {/* Image */}
              {c.image && (
                <div className="my-complaint-image">
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

      {/* Floating Create Button */}
      <button 
        className="create-complaint-floating-btn"
        onClick={() => setShowCreateModal(true)}
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        </svg>
        Create Complaint
      </button>

      {/* Create Complaint Modal */}
      {showCreateModal && (
        <div className="modal-overlay" onClick={() => setShowCreateModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Create Complaint</h2>
              <button className="modal-close" onClick={() => setShowCreateModal(false)}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </button>
            </div>

            {createError && <p className="error-message">{createError}</p>}

            <form onSubmit={handleCreateComplaint} className="create-form">
              <div className="form-group">
                <label>Title</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  placeholder="Enter complaint title"
                />
              </div>

              <div className="form-group">
                <label>Description</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                  placeholder="Describe your complaint"
                  rows="5"
                />
              </div>

              <div className="form-group">
                <label>Image (optional)</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setImage(e.target.files[0])}
                />
              </div>

              <div className="modal-actions">
                <button type="button" className="btn-cancel" onClick={() => setShowCreateModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn-submit">
                  Submit Complaint
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyComplaints;