import React, { useEffect, useState } from "react";
import axios from "../../api/axios";
import "../../css/AdminPaymentsPage.css";

const AdminPaymentsPage = () => {
  const [payments, setPayments] = useState([]);
  const [showImageModal, setShowImageModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState("");

  // Fetch all payments (admin)
  const fetchPayments = async () => {
    try {
      const res = await axios.get("/api/payments/all");
      setPayments(res.data.payments);
    } catch (err) {
      console.log(err);
      alert("Failed to load payments");
    }
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  // Update payment status
  const updateStatus = async (id, status) => {
    try {
      await axios.put(`/api/payments/update/${id}`, { status });
      alert("Payment status updated!");
      fetchPayments();
    } catch (err) {
      console.log(err);
      alert("Failed to update status");
    }
  };

  return (
    <div className="admin-payments-wrapper">
      <div className="admin-payments-header">
        <h1 className="admin-payments-title">All Resident Payments</h1>
        <p className="admin-payments-subtitle">Manage and review all payments made by residents.</p>
      </div>

      <div className="payments-table-container">
        <table className="payments-table">
          <thead>
            <tr>
              <th>RESIDENT</th>
              <th>MONTH</th>
              <th>AMOUNT</th>
              <th>STATUS</th>
              <th>PROOF</th>
              <th>ACTIONS</th>
            </tr>
          </thead>

          <tbody>
            {payments.length === 0 ? (
              <tr>
                <td colSpan="6" className="no-payments">
                  No payments found
                </td>
              </tr>
            ) : (
              payments.map((p) => (
                <tr key={p._id}>
                  <td>
                    <div className="resident-info">
                      <span className="resident-name">{p.resident?.name || "Unknown"}</span>
                      <span className="resident-email">{p.resident?.email || ""}</span>
                    </div>
                  </td>

                  <td>{p.month || "-"}</td>

                  <td>₹{p.amount}</td>

                  <td>
                    <span className={`payment-status-badge status-${(p.status || 'unpaid').toLowerCase()}`}>
                      {p.status || "Unpaid"}
                    </span>
                  </td>

                  <td>
                    {p.proofImage ? (
                      <button
                        onClick={() => {
                          setSelectedImage(`${import.meta.env.VITE_API_BASE_URL}/${p.proofImage}`);
                          setShowImageModal(true);
                        }}
                        className="proof-link"
                        style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
                      >
                        View
                      </button>
                    ) : (
                      "-"
                    )}
                  </td>

                  <td>
                    <div className="payment-actions">
                      <button
                        onClick={() => updateStatus(p._id, "Paid")}
                        className="payment-action-btn approve"
                      >
                        Approve
                      </button>

                      <button
                        onClick={() => updateStatus(p._id, "Pending")}
                        className="payment-action-btn pending"
                      >
                        Pending
                      </button>

                      <button
                        onClick={() => updateStatus(p._id, "Unpaid")}
                        className="payment-action-btn reject"
                      >
                        Reject
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Image Modal */}
      {showImageModal && (
        <div className="payment-modal-overlay" onClick={() => setShowImageModal(false)}>
          <div className="payment-modal-content image-modal" onClick={(e) => e.stopPropagation()}>
            <div className="payment-modal-header">
              <h2>Payment Proof</h2>
              <button className="payment-modal-close" onClick={() => setShowImageModal(false)}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </button>
            </div>
            <div className="image-modal-body">
              <img src={selectedImage} alt="Payment Proof" className="proof-image" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPaymentsPage;
