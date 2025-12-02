import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

import Login from './pages/Login';
import Signup from './pages/Signup';
import Home from './pages/Home';

// Complaint Pages (Resident)
import CreateComplaint from "./components/Complaints/CreateComplaint";
import MyComplaints from "./components/Complaints/MyComplaints";
import EditComplaint from "./components/Complaints/EditComplaint";

// Admin Pages
import AdminComplaints from "./components/Admin/AdminComplaints";

// Sidebar
import Sidebar from "./components/Sidebar";
import './App.css';

// Views are now handled inside Home via switch-case


// ⭐ Protected Route
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
      <Toaster position="top-right" toastOptions={{ duration: 3500 }} />
      <Routes>

        {/* PUBLIC ROUTES */}
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />


        {/* PROTECTED HOME (single-page with sidebar + switch-case) */}
        <Route
          path="/home"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />
        {/* Default redirect for any unknown route to /home when logged-in */}
        <Route path="*" element={<Navigate to="/home" replace />} />


      </Routes>
    </Router>
  );
}

export default App;
