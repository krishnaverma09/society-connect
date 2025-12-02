import { useEffect, useState } from 'react'
import axios from '../api/axios'
import { User as UserIcon } from 'lucide-react'
import '../css/Dashboard.css'

const Dashboard = ({ onNavigate }) => {
  const user = JSON.parse(localStorage.getItem('user') || '{}')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  // aggregated data
  const [openComplaints, setOpenComplaints] = useState(0)
  const [pendingComplaints, setPendingComplaints] = useState(0)
  const [inProgressComplaints, setInProgressComplaints] = useState(0)
  const [recentNoticesCount, setRecentNoticesCount] = useState(0)
  const [announcements, setAnnouncements] = useState([])
  const [upcomingMeetings, setUpcomingMeetings] = useState([])
  const [recentComplaints, setRecentComplaints] = useState([])

  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true)
      setError('')
      try {
        const today = new Date()
        const results = await Promise.allSettled([
          axios.get('/api/complaints'),
          axios.get('/api/notices'),
          axios.get('/api/payments'),
          axios.get('/api/meetings').catch(() => ({ data: { meetings: [] } })),
        ])

        // Complaints
        const complaintsData = results[0].status === 'fulfilled' ? (results[0].value.data.complaints || []) : []
        const pending = complaintsData.filter(c => (c.status || '').toLowerCase() === 'pending').length
        const inProgress = complaintsData.filter(c => (c.status || '').toLowerCase() === 'in-progress' || (c.status || '').toLowerCase() === 'in progress').length
        const totalOpen = pending + inProgress
        setOpenComplaints(totalOpen)
        setPendingComplaints(pending)
        setInProgressComplaints(inProgress)
        const recent = [...complaintsData]
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          .slice(0, 3)
        setRecentComplaints(recent)

        // Notices -> announcements
        const noticesData = results[1].status === 'fulfilled' ? (results[1].value.data.notices || results[1].value.data || []) : []
        setRecentNoticesCount(noticesData.length)
        const recentAnnouncements = [...noticesData]
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          .slice(0, 3)
        setAnnouncements(recentAnnouncements)
        
        // Meetings — handle both array and wrapped { meetings }
        const rawMeetings = results[3].status === 'fulfilled' ? results[3].value.data : []
        const meetingsData = Array.isArray(rawMeetings)
          ? rawMeetings
          : (rawMeetings.meetings || [])
        const recentMeetings = [...meetingsData]
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          .slice(0, 3)
        setUpcomingMeetings(recentMeetings)
      } catch (e) {
        setError(e.message || 'Failed to load dashboard data')
      } finally {
        setLoading(false)
      }
    }
    fetchAll()
  }, [])

  const isAdmin = (user?.role || '').toLowerCase() === 'admin'

  return (
    <div className="dashboard-wrapper">
      <div className="dashboard-topbar">
        <div className="topbar-left">
          <h1>Dashboard</h1>
          {user?.role && (
            <span className="role-badge">{user.role === 'admin' ? 'Admin' : 'Resident'}</span>
          )}
        </div>
        <div className="topbar-center">
          <p className="greeting">Welcome back, <span className="user-name">{user?.name || 'User'}</span>!</p>
        </div>
        <div className="topbar-right">
          <button 
            className="avatar" 
            title={user?.name || 'User'}
            onClick={() => onNavigate?.('profile')}
            aria-label="Go to profile"
          >
            <UserIcon size={20} />
          </button>
        </div>
      </div>

      {error && <div className="dash-error">{error}</div>}

      <div className="cards-row">
        <div className="metric-card">
          <div className="metric-value">{openComplaints}</div>
          <div className="metric-label">Open Complaints</div>
          <div className="metric-breakdown">
            <span className="breakdown-item">Pending: {pendingComplaints}</span>
            <span className="breakdown-separator">•</span>
            <span className="breakdown-item">In Progress: {inProgressComplaints}</span>
          </div>
        </div>
        <div className="metric-card">
          <div className="metric-value">{recentNoticesCount}</div>
          <div className="metric-label">Recent Notices</div>
        </div>
      </div>

      <div className="grid-two">
        <div className="panel announcements">
          <div className="panel-head">
            <h2>Recent Announcements</h2>
            <button className="link-btn" onClick={() => onNavigate?.('notices')}>View All</button>
          </div>
          {loading ? (
            <div className="loading-sm">Loading...</div>
          ) : announcements.length === 0 ? (
            <div className="empty">No announcements</div>
          ) : (
            <ul className="list">
              {announcements.map(a => (
                <li key={a._id} className="list-item">
                  <div className="title">{a.title}</div>
                  <div className="meta">Published: {new Date(a.createdAt).toLocaleDateString()}</div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <div className="grid-two">
        <div className="panel meetings">
          <div className="panel-head">
            <h2>Upcoming Meetings</h2>
            <button className="link-btn" onClick={() => onNavigate?.('meetings:list')}>View All</button>
          </div>
          {loading ? (
            <div className="loading-sm">Loading...</div>
          ) : upcomingMeetings.length === 0 ? (
            <div className="empty">No upcoming meetings</div>
          ) : (
            <ul className="list">
              {upcomingMeetings.map(m => (
                <li key={m._id} className="list-item meeting-item">
                  <div className="title">{m.title || m.name}</div>
                  <div className="meta">{new Date(m.date || m.startDate || m.scheduledAt).toLocaleString()}</div>
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="panel complaints">
          <h2>New Complaints</h2>
          {loading ? (
            <div className="loading-sm">Loading...</div>
          ) : recentComplaints.length === 0 ? (
            <div className="empty">No complaints</div>
          ) : (
            <ul className="list">
              {recentComplaints.map(c => (
                <li key={c._id} className="list-item complaint-item">
                  <div className="title">{c.title}</div>
                  <div className="meta-row">
                    <span className={`status-pill status-${(c.status || 'unknown').replace(/\s+/g,'-').toLowerCase()}`}>{c.status || 'Unknown'}</span>
                    <span className="meta">{new Date(c.createdAt).toLocaleDateString()}</span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  )
}

export default Dashboard
