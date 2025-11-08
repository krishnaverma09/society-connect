import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import axios from '../api/axios'
import './Login.css'

const Signup = () => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'resident',
    apartment: '',
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const response = await axios.post('/api/auth/signup', formData)
      
      // Save token and user data to localStorage
      localStorage.setItem('token', response.data.token)
      localStorage.setItem('user', JSON.stringify(response.data.user))
      
      // Redirect to dashboard
      navigate('/dashboard')
    } catch (err) {
  // axios interceptor returns { message, status, original }
  const msg = err?.message || (err?.original && err.original.message) || 'Signup failed. Please try again.'
  setError(msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h1>🏢 SocietyConnect</h1>
          <h2>Create Account</h2>
          <p>Sign up to get started</p>
        </div>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="name">Full Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter your full name"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password (min 6 characters)"
              required
              minLength={6}
            />
          </div>

          <div className="form-group">
            <label htmlFor="role">Role</label>
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

          {formData.role === 'resident' && (
            <div className="form-group">
              <label htmlFor="apartment">Apartment Number</label>
              <input
                type="text"
                id="apartment"
                name="apartment"
                value={formData.apartment}
                onChange={handleChange}
                placeholder="e.g., A-101"
              />
            </div>
          )}

          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? 'Creating Account...' : 'Sign Up'}
          </button>
        </form>

        <div className="auth-footer">
          <p>
            Already have an account? <Link to="/">Login</Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Signup
