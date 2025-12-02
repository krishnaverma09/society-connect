import { useState, useMemo } from 'react'
import Sidebar from '../components/Sidebar'

// Views
import Dashboard from './Dashboard'
import Profile from './Profile'
import NoticesPage from './NoticesPage'
import ComplaintsHome from '../components/Complaints/ComplaintsHome'
import CreateComplaint from '../components/Complaints/CreateComplaint'
import MyComplaints from '../components/Complaints/MyComplaints'
import EditComplaint from '../components/Complaints/EditComplaint'
import AdminComplaints from '../components/Admin/AdminComplaints'
import MeetingsPage from '../components/Meetings/MeetingsPage'
import CreateMeeting from '../components/Meetings/CreateMeeting'
import MeetingDetails from '../components/Meetings/MeetingDetails'
import PollVotePage from '../components/Meetings/PollVotePage'
import PollResultsPage from '../components/Meetings/PollResultsPage'
import CreatePoll from '../components/Meetings/CreatePoll'
import EditMeeting from '../components/Meetings/EditMeeting'
import ResidentPaymentsPage from '../components/Payments/ResidentPaymentsPage'
import AdminPaymentsPage from '../components/Payments/AdminPaymentsPage'

// Simple role check
const isAdmin = () => {
  try {
    const user = JSON.parse(localStorage.getItem('user'))
    return user?.role === 'admin'
  } catch {
    return false
  }
}

export default function Home() {
  const [view, setView] = useState('dashboard')
  const [editingComplaintId, setEditingComplaintId] = useState(null)
  const [selectedMeetingId, setSelectedMeetingId] = useState(null)

  const handleNavigate = (next) => {
    setView(next)
  }

  const handleEditComplaint = (complaintId) => {
    setEditingComplaintId(complaintId)
    setView('complaints:edit')
  }

  const content = useMemo(() => {
    switch (view) {
      case 'dashboard':
        return <Dashboard onNavigate={handleNavigate} />
      case 'notices':
        return <NoticesPage />
      case 'complaints':
        return <ComplaintsHome onNavigate={handleNavigate} onEditComplaint={handleEditComplaint} />
      case 'complaints:create':
        return <CreateComplaint />
      case 'complaints:my':
        return <MyComplaints />
      case 'complaints:edit':
        return <EditComplaint complaintId={editingComplaintId} onNavigate={handleNavigate} />
      case 'complaints:admin':
        return isAdmin() ? <AdminComplaints /> : <ComplaintsHome />
      case 'meetings:list':
        return <MeetingsPage onNavigate={handleNavigate} setSelectedMeetingId={setSelectedMeetingId} />
      case 'meetings:create':
        return isAdmin() ? <CreateMeeting onNavigate={handleNavigate} /> : <MeetingsPage onNavigate={handleNavigate} setSelectedMeetingId={setSelectedMeetingId} />
      case 'meetings:details':
        return <MeetingDetails meetingId={selectedMeetingId} onNavigate={handleNavigate} setSelectedMeetingId={setSelectedMeetingId} />
      case 'meetings:vote':
        return <PollVotePage meetingId={selectedMeetingId} onNavigate={handleNavigate} />
      case 'meetings:results':
        return isAdmin() ? <PollResultsPage meetingId={selectedMeetingId} onNavigate={handleNavigate} /> : <MeetingsPage onNavigate={handleNavigate} setSelectedMeetingId={setSelectedMeetingId} />
      case 'meetings:poll:create':
        return isAdmin() ? <CreatePoll meetingId={selectedMeetingId} onNavigate={handleNavigate} /> : <MeetingsPage onNavigate={handleNavigate} setSelectedMeetingId={setSelectedMeetingId} />
      case 'meetings:edit':
        return isAdmin() ? <EditMeeting meetingId={selectedMeetingId} onNavigate={handleNavigate} /> : <MeetingsPage onNavigate={handleNavigate} setSelectedMeetingId={setSelectedMeetingId} />
      case 'payments:resident':
        return <ResidentPaymentsPage />
      case 'payments:admin':
        return isAdmin() ? <AdminPaymentsPage /> : <ResidentPaymentsPage />
      case 'profile':
        return <Profile />
      default:
        return <Dashboard />
    }
  }, [view])

  return (
    <div className="app-layout">
      <Sidebar onNavigate={handleNavigate} activeKey={view} />
      <div className="page-content">{content}</div>
    </div>
  )
}
