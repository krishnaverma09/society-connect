import { useState } from "react";
import { createComplaint } from "../../api/complaints";
import { useNavigate } from "react-router-dom";

const CreateComplaint = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const submitHandler = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", description);
      if (image) formData.append("image", image);

      await createComplaint(formData);

      navigate("/complaints/my");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create complaint");
    }
  };

  return (
    <div className="page-container">
      <h2>Create Complaint</h2>

      {error && <p className="error">{error}</p>}

      <form onSubmit={submitHandler} className="form-card">
        <label>Title</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />

        <label>Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />

        <label>Image (optional)</label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImage(e.target.files[0])}
        />

        <button type="submit" className="btn-primary">
          Submit Complaint
        </button>
      </form>
    </div>
  );
};

export default CreateComplaint;
