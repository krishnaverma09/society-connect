import React, { useState, useEffect } from "react";
import axios from "../../api/axios";
import "../../css/ResidentPaymentsPage.css";

const ResidentPaymentsPage = () => {
  const [showPayModal, setShowPayModal] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState("");
  const [month, setMonth] = useState("");
  const [referenceId, setReferenceId] = useState("");
  const [proofImage, setProofImage] = useState(null);
  const [payments, setPayments] = useState([]);
  const [error, setError] = useState("");

  // Load resident payment history
  const fetchPayments = async () => {
    try {
      const res = await axios.get("/api/payments/my-payments");
      setPayments(res.data.payments);
    } catch (err) {
      console.log(err);
      alert("Failed to load payments");
    }
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  // Submit payment
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!month || !referenceId || !proofImage) {
      setError("Please fill all fields and upload a screenshot.");
      return;
    }

    const formData = new FormData();
    formData.append("month", month);
    formData.append("referenceId", referenceId);
    formData.append("proofImage", proofImage);

    try {
      await axios.post("/api/payments/submit", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert("Payment submitted successfully!");
      setMonth("");
      setReferenceId("");
      setProofImage(null);
      setShowPayModal(false);
      fetchPayments();
    } catch (err) {
      console.log(err);
      setError(err.response?.data?.message || "Failed to submit payment");
    }
  };

  return (
    <div className="resident-payments-wrapper">
      <h1 className="resident-payments-title">Payment History</h1>

      {/* Payment History Table */}
      <div className="payment-history-section">
        <div className="payment-history-header">
          <h2>My Payment History</h2>
        </div>

        <table className="payment-history-table">
          <thead>
            <tr>
              <th>MONTH</th>
              <th>AMOUNT</th>
              <th>STATUS</th>
              <th>PROOF</th>
            </tr>
          </thead>
          <tbody>
            {payments.length === 0 ? (
              <tr>
                <td colSpan="4" className="no-payment-history">
                  No payment history found
                </td>
              </tr>
            ) : (
              payments.map((p) => (
                <tr key={p._id}>
                  <td>{p.month || "-"}</td>
                  <td>₹{p.amount}</td>
                  <td>
                    <span className={`resident-payment-status status-${(p.status || 'unpaid').toLowerCase()}`}>
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
                        className="resident-proof-link"
                        style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
                      >
                        View
                      </button>
                    ) : (
                      "-"
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Floating Pay Button */}
      <button 
        className="pay-floating-btn"
        onClick={() => setShowPayModal(true)}
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M2 8.5h20M6 16.5h2m4 0h6M6.8 21h10.4c1.68 0 2.52 0 3.162-.327a3 3 0 001.311-1.311C22 18.72 22 17.88 22 16.2V7.8c0-1.68 0-2.52-.327-3.162a3 3 0 00-1.311-1.311C19.72 3 18.88 3 17.2 3H6.8c-1.68 0-2.52 0-3.162.327a3 3 0 00-1.311 1.311C2 5.28 2 6.12 2 7.8v8.4c0 1.68 0 2.52.327 3.162a3 3 0 001.311 1.311C4.28 21 5.12 21 6.8 21z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        Pay
      </button>

      {/* Payment Modal */}
      {showPayModal && (
        <div className="payment-modal-overlay" onClick={() => setShowPayModal(false)}>
          <div className="payment-modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="payment-modal-header">
              <h2>Submit Maintenance Payment</h2>
              <button className="payment-modal-close" onClick={() => setShowPayModal(false)}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </button>
            </div>

            {error && <p className="payment-error-message">{error}</p>}

            <form onSubmit={handleSubmit} className="payment-form">
              <div className="payment-form-group">
                <label>Month</label>
                <input
                  type="month"
                  value={month}
                  onChange={(e) => setMonth(e.target.value)}
                  required
                  placeholder="Select month"
                />
              </div>

              <div className="payment-form-group">
                <label>UPI Reference ID</label>
                <input
                  type="text"
                  value={referenceId}
                  onChange={(e) => setReferenceId(e.target.value)}
                  placeholder="Enter UPI Transaction ID"
                  required
                />
              </div>

              <div className="payment-form-group">
                <label>Upload Screenshot</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setProofImage(e.target.files[0])}
                  required
                />
              </div>

              <div className="payment-modal-actions">
                <button type="button" className="payment-btn-cancel" onClick={() => setShowPayModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="payment-btn-submit">
                  Submit Payment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

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

export default ResidentPaymentsPage;
