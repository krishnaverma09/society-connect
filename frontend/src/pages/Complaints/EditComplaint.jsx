import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  getComplaints,
  editComplaint
} from "../../api/complaints";

const EditComplaint = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [complaint, setComplaint] = useState(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [imageFile, setImageFile] = useState(null);

  useEffect(() => {
    loadComplaint();
  }, []);

  const loadComplaint = async () => {
    try {
      const res = await getComplaints(); // resident gets only their complaints
      const found = res.data.complaints.find((c) => c._id === id);

      if (!found) {
        alert("Complaint not found");
        navigate("/complaints/my");
        return;
      }

      setComplaint(found);
      setTitle(found.title);
      setDescription(found.description);
    } catch (err) {
      console.error("Error loading complaint", err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const form = new FormData();
    form.append("title", title);
    form.append("description", description);
    if (imageFile) {
      form.append("image", imageFile);
    }

    try {
      await editComplaint(id, form);
      alert("Complaint updated successfully!");
      navigate("/complaints/my");
    } catch (error) {
      alert("Failed to update complaint");
      console.error("Update error:", error);
    }
  };

  if (!complaint) {
    return <p style={{ padding: "20px" }}>Loading complaint...</p>;
  }

  return (
    <div className="page-container" style={{ maxWidth: "600px", margin: "auto" }}>
      <h2>Edit Complaint</h2>

      <form
        onSubmit={handleSubmit}
        encType="multipart/form-data"
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "15px",
          marginTop: "20px",
        }}
      >
        {/* Title */}
        <div>
          <label>Title</label>
          <input
            className="input"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            style={{ width: "100%", padding: "10px" }}
          />
        </div>

        {/* Description */}
        <div>
          <label>Description</label>
          <textarea
            className="input"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            style={{
              width: "100%",
              padding: "10px",
              minHeight: "120px",
              resize: "vertical",
            }}
          />
        </div>

        {/* Replace Image */}
        <div>
          <label>Replace Image (optional)</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImageFile(e.target.files[0])}
          />
        </div>

        {/* Show Current Image */}
        {complaint.image && (
          <div style={{ marginTop: "10px" }}>
            <p>Current Image:</p>
            <img
              src={`${import.meta.env.VITE_API_BASE_URL}${complaint.image}`}
              alt="Current Complaint"
              style={{
                width: "200px",
                borderRadius: "10px",
                marginTop: "5px",
              }}
            />
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          className="submit-btn"
          style={{
            padding: "12px",
            background: "#333",
            color: "white",
            borderRadius: "6px",
            cursor: "pointer",
            marginTop: "10px",
          }}
        >
          Save Changes
        </button>
      </form>
    </div>
  );
};

export default EditComplaint;
