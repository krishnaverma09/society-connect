import { useNavigate } from 'react-router-dom'
import '../css/Navbar.css'

const Navbar = () => {
  const navigate = useNavigate()
  const user = JSON.parse(localStorage.getItem('user') || '{}')

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    navigate('/')
  }

  return (
    <nav className="navbar">
      <div className="navbar-container">

        {/* Left Section */}
        <div className="navbar-brand">
          <h2
            style={{ cursor: 'pointer' }}
            onClick={() => navigate('/dashboard')}
          >
            🏢 SocietyConnect
          </h2>

          {/* Global Always Visible */}
          <button
            onClick={() => navigate('/notices')}
            className="nav-link-btn"
          >
            Notices
          </button>

          {/* Resident Only Buttons */}
          {user.role === 'resident' && (
            <>
              <button
                onClick={() => navigate('/complaints/create')}
                className="nav-link-btn"
              >
                Create Complaint
              </button>

              <button
                onClick={() => navigate('/complaints/my')}
                className="nav-link-btn"
              >
                My Complaints
              </button>
            </>
          )}

          {/* Admin Only Button */}
          {user.role === 'admin' && (
            <button
              onClick={() => navigate('/admin/complaints')}
              className="nav-link-btn"
            >
              Manage Complaints
            </button>
          )}
        </div>

        {/* Right Section */}
        <div className="navbar-user">
          <span className="user-info">
            Welcome, <strong>{user.name || 'User'}</strong> (
            {user.role || 'N/A'})
          </span>

          <button className="logout-btn" onClick={handleLogout}>
            Logout
          </button>
        </div>

      </div>
    </nav>
  )
}

export default Navbar
