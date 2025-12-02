import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "../api/axios";
import "../css/Login.css";

const Signup = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "resident",
    apartmentNumber: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false); // optional

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await axios.post("/api/auth/signup", formData);

      // Save data
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));

      navigate("/dashboard");
    } catch (err) {
      if (err.response?.data?.errors) {
        const validationErrors = err.response.data.errors
          .map((error) => error.msg)
          .join(", ");
        setError(validationErrors);
      } else {
        setError(
          err.response?.data?.message || "Signup failed. Please try again."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      {/* LEFT PANEL (same as login) */}
      <div className="left-banner">
        <div className="circle circle1"></div>
        <div className="circle circle2"></div>

        <div className="banner-text">
          <h2>SocietyConnect</h2>
          <p>Create your account and join your community.</p>
        </div>
      </div>

      {/* RIGHT PANEL */}
      <div className="right-content">
        <div className="login-box">
          <h1>Create Account</h1>
          <p className="subtitle">Sign up to get started</p>

          {error && <div className="error-message">{error}</div>}

          <form onSubmit={handleSubmit}>
            {/* FULL NAME */}
            <div className="form-group">
              <label htmlFor="name">Full Name</label>
              <input
                id="name"
                type="text"
                name="name"
                placeholder="Enter your full name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            {/* EMAIL */}
            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <input
                id="email"
                type="email"
                name="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            {/* PASSWORD */}
            <div className="form-group">
              <label htmlFor="password">Password</label>

              <div className="password-wrapper">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Enter your password (min 6 characters)"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  minLength={6}
                />

                <span
                  className="eye"
                  onClick={() => setShowPassword((prev) => !prev)}
                >
                  {showPassword ? "👁️" : "👁‍🗨"}
                </span>
              </div>
            </div>

            {/* ROLE SELECT */}
            <div className="form-group">
              <label htmlFor="role">Role</label>
              <div className="select-wrapper">
                <select
                  id="role"
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  required
                >
                  <option value="resident">Resident</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
            </div>

            {/* APARTMENT NUMBER (Only for Resident) */}
            {formData.role === "resident" && (
              <div className="form-group">
                <label htmlFor="apartmentNumber">Apartment Number</label>
                <input
                  id="apartmentNumber"
                  type="text"
                  name="apartmentNumber"
                  placeholder="e.g., A-101"
                  value={formData.apartmentNumber}
                  onChange={handleChange}
                  required
                />
              </div>
            )}

            {/* SUBMIT BUTTON */}
            <button type="submit" className="login-btn" disabled={loading}>
              {loading ? "Creating account..." : "Sign Up"}
            </button>
          </form>

          <p className="signup-text">
            Already have an account? <Link to="/">Login</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
