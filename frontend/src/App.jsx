import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import NoticesPage from './pages/NoticesPage';

// Complaint Pages (Resident)
import CreateComplaint from "./pages/Complaints/CreateComplaint";
import MyComplaints from "./pages/Complaints/MyComplaints";
import EditComplaint from "./pages/Complaints/EditComplaint";

// Admin Pages
import AdminComplaints from "./pages/Admin/AdminComplaints";

// Sidebar
import Sidebar from "./components/Sidebar";
import './App.css';

// Meetings Feature Pages (NEW)
import MeetingsPage from "./pages/Meetings/MeetingsPage";
import MeetingDetails from "./pages/Meetings/MeetingDetails";
import PollVotePage from "./pages/Meetings/PollVotePage";
import PollResultsPage from "./pages/Meetings/PollResultsPage";
import CreateMeeting from "./pages/Meetings/CreateMeeting";
import CreatePoll from "./pages/Meetings/CreatePoll";
import EditMeeting from "./pages/Meetings/EditMeeting";


// ⭐ Admin-only wrapper (added but doesn’t break any old code)
const AdminOnly = ({ children }) => {
  const user = JSON.parse(localStorage.getItem("user"));
  return user?.role === "admin" ? children : <Navigate to="/meetings" replace />;
};


// ⭐ Protected Route (original)
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');

  if (!token) {
    return <Navigate to="/" replace />;
  }

  return children;
};

// ⭐ Layout wrapper (original)
const ProtectedLayout = ({ children }) => {
  return (
    <div className="app-layout">
      <Sidebar />
      <div className="page-content">{children}</div>
    </div>
  );
};

function App() {
  return (
    <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <Routes>

        {/* ---------------- PUBLIC ROUTES ---------------- */}
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />


        {/* ---------------- PROTECTED ROUTES ---------------- */}
        
        {/* Dashboard */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <ProtectedLayout>
                <Dashboard />
              </ProtectedLayout>
            </ProtectedRoute>
          }
        />

        {/* Notices */}
        <Route
          path="/notices"
          element={
            <ProtectedRoute>
              <ProtectedLayout>
                <NoticesPage />
              </ProtectedLayout>
            </ProtectedRoute>
          }
        />

        {/* Resident Complaints */}
        <Route
          path="/complaints/create"
          element={
            <ProtectedRoute>
              <ProtectedLayout>
                <CreateComplaint />
              </ProtectedLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/complaints/my"
          element={
            <ProtectedRoute>
              <ProtectedLayout>
                <MyComplaints />
              </ProtectedLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/complaints/edit/:id"
          element={
            <ProtectedRoute>
              <ProtectedLayout>
                <EditComplaint />
              </ProtectedLayout>
            </ProtectedRoute>
          }
        />

        {/* Admin Complaints */}
        <Route
          path="/admin/complaints"
          element={
            <ProtectedRoute>
              <ProtectedLayout>
                <AdminComplaints />
              </ProtectedLayout>
            </ProtectedRoute>
          }
        />

        {/* ---------------- MEETINGS ROUTES (ADDED) ---------------- */}

        {/* Meetings List */}
        <Route
          path="/meetings"
          element={
            <ProtectedRoute>
              <ProtectedLayout>
                <MeetingsPage />
              </ProtectedLayout>
            </ProtectedRoute>
          }
        />

        {/* Create Meeting (Admin Only) */}
        <Route
          path="/meetings/create"
          element={
            <ProtectedRoute>
              <ProtectedLayout>
                <AdminOnly>
                  <CreateMeeting />
                </AdminOnly>
              </ProtectedLayout>
            </ProtectedRoute>
          }
        />

        {/* Meeting Details */}
        <Route
          path="/meetings/:id"
          element={
            <ProtectedRoute>
              <ProtectedLayout>
                <MeetingDetails />
              </ProtectedLayout>
            </ProtectedRoute>
          }
        />

        {/* Resident Vote Page */}
        <Route
          path="/meetings/:id/vote"
          element={
            <ProtectedRoute>
              <ProtectedLayout>
                <PollVotePage />
              </ProtectedLayout>
            </ProtectedRoute>
          }
        />

        {/* Poll Results (Admin Only) */}
        <Route
          path="/meetings/:id/results"
          element={
            <ProtectedRoute>
              <ProtectedLayout>
                <AdminOnly>
                  <PollResultsPage />
                </AdminOnly>
              </ProtectedLayout>
            </ProtectedRoute>
          }
        />

        {/* Create Poll (Admin Only) */}
        <Route
          path="/meetings/:id/poll/create"
          element={
            <ProtectedRoute>
              <ProtectedLayout>
                <AdminOnly>
                  <CreatePoll />
                </AdminOnly>
              </ProtectedLayout>
            </ProtectedRoute>
          }
        />

        <Route
        path="/meetings/:id/edit"
        element={
          <ProtectedRoute>
            <ProtectedLayout>
              <AdminOnly>
                <EditMeeting />
              </AdminOnly>
            </ProtectedLayout>
          </ProtectedRoute>
        }
/>

      </Routes>
    </Router>
  );
}

export default App;
