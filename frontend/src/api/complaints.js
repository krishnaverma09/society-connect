import axios from "./axios";

// Create complaint (resident)
export const createComplaint = (formData) => {
  return axios.post("/api/complaints", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

// Get complaints (resident sees mine, admin sees all)
export const getComplaints = () => {
  return axios.get("/api/complaints");
};

// Admin: update complaint
export const updateComplaint = (id, data) => {
  return axios.put(`/api/complaints/${id}`, data);
};

export const editComplaint = (id, data) =>
  axios.put(`/api/complaints/${id}/edit`, data, {
    headers: { "Content-Type": "multipart/form-data" }
  });

export const deleteComplaint = (id) =>
  axios.delete(`/api/complaints/${id}`);
