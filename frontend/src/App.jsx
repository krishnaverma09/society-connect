import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import NoticesPage from './pages/NoticesPage';

// Complaint Pages (Resident)
import CreateComplaint from "./pages/Complaints/CreateComplaint";
import MyComplaints from "./pages/Complaints/MyComplaints";
import EditComplaint from "./pages/Complaints/EditComplaint";  // ✅ Correct Folder

// Admin Pages
import AdminComplaints from "./pages/Admin/AdminComplaints";

import './App.css';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');

  if (!token) {
    return <Navigate to="/" replace />;
  }

  return children;
};

function App() {
  return (
    <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <Routes>

        {/* Public Routes */}
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Protected Routes */}
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } 
        />

        <Route
          path="/notices"
          element={
            <ProtectedRoute>
              <NoticesPage />
            </ProtectedRoute>
          }
        />

        {/* Resident Complaint Routes */}
        <Route
          path="/complaints/create"
          element={
            <ProtectedRoute>
              <CreateComplaint />
            </ProtectedRoute>
          }
        />

        <Route
          path="/complaints/my"
          element={
            <ProtectedRoute>
              <MyComplaints />
            </ProtectedRoute>
          }
        />

        {/* Resident Edit Complaint Route */}
        <Route
          path="/complaints/edit/:id"
          element={
            <ProtectedRoute>
              <EditComplaint />
            </ProtectedRoute>
          }
        />

        {/* Admin Complaint Routes */}
        <Route
          path="/admin/complaints"
          element={
            <ProtectedRoute>
              <AdminComplaints />
            </ProtectedRoute>
          }
        />

      </Routes>
    </Router>
  );
}

export default App;
