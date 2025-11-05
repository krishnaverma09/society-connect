import { useState, useEffect } from 'react'
import axios from '../api/axios'
import Navbar from '../components/Navbar'
import './Dashboard.css'

const Dashboard = () => {
  const [complaints, setComplaints] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const user = JSON.parse(localStorage.getItem('user') || '{}')

  useEffect(() => {
    fetchComplaints()
  }, [])

  const fetchComplaints = async () => {
    try {
      setLoading(true)
      const response = await axios.get('/api/complaints')
      setComplaints(response.data.complaints || [])
      setError('')
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch complaints')
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'Pending':
        return '#ffc107'
      case 'In Progress':
        return '#17a2b8'
      case 'Resolved':
        return '#28a745'
      default:
        return '#6c757d'
    }
  }

  return (
    <div className="dashboard">
      <Navbar />
      
      <div className="dashboard-container">
        <div className="dashboard-header">
          <h1>Dashboard</h1>
          <p>Welcome to your SocietyConnect dashboard</p>
        </div>

        <div className="dashboard-stats">
          <div className="stat-card">
            <h3>{complaints.length}</h3>
            <p>Total Complaints</p>
          </div>
          <div className="stat-card">
            <h3>{complaints.filter(c => c.status === 'Pending').length}</h3>
            <p>Pending</p>
          </div>
          <div className="stat-card">
            <h3>{complaints.filter(c => c.status === 'In Progress').length}</h3>
            <p>In Progress</p>
          </div>
          <div className="stat-card">
            <h3>{complaints.filter(c => c.status === 'Resolved').length}</h3>
            <p>Resolved</p>
          </div>
        </div>

        <div className="complaints-section">
          <h2>
            {user.role === 'admin' ? 'All Complaints' : 'My Complaints'}
          </h2>

          {loading ? (
            <div className="loading">Loading complaints...</div>
          ) : error ? (
            <div className="error-message">{error}</div>
          ) : complaints.length === 0 ? (
            <div className="no-data">
              <p>No complaints found.</p>
              {user.role === 'resident' && (
                <p className="hint">Create your first complaint to get started!</p>
              )}
            </div>
          ) : (
            <div className="complaints-grid">
              {complaints.map((complaint) => (
                <div key={complaint._id} className="complaint-card">
                  <div className="complaint-header">
                    <h3>{complaint.title}</h3>
                    <span 
                      className="status-badge"
                      style={{ backgroundColor: getStatusColor(complaint.status) }}
                    >
                      {complaint.status}
                    </span>
                  </div>
                  <p className="complaint-description">{complaint.description}</p>
                  <div className="complaint-footer">
                    {user.role === 'admin' && complaint.resident && (
                      <p className="complaint-meta">
                        <strong>Resident:</strong> {complaint.resident.name}
                        {complaint.resident.apartment && ` (${complaint.resident.apartment})`}
                      </p>
                    )}
                    {complaint.assignedTo && (
                      <p className="complaint-meta">
                        <strong>Assigned To:</strong> {complaint.assignedTo.name}
                      </p>
                    )}
                    <p className="complaint-date">
                      Created: {new Date(complaint.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Dashboard
