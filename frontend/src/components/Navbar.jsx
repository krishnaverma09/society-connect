import { useNavigate } from 'react-router-dom'
import './Navbar.css'

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
        <div className="navbar-brand">
          <h2 style={{cursor: 'pointer'}} onClick={() => navigate('/dashboard')}>🏢 SocietyConnect</h2>
          <button onClick={() => navigate('/notices')} className="nav-link-btn">Notices</button>
        </div>
        <div className="navbar-user">
          <span className="user-info">
            Welcome, <strong>{user.name || 'User'}</strong> ({user.role || 'N/A'})
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
