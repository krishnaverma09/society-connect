import MyComplaints from './MyComplaints'

export default function ComplaintsHome({ onNavigate, onEditComplaint }) {
  return <MyComplaints onNavigate={onNavigate} onEditComplaint={onEditComplaint} />
}
