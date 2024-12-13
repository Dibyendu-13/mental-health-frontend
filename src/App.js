import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import QuestionDetails from './pages/QuestionDetails';
import Login from './pages/Login';
import Register from './pages/Register';
import AddPost from './pages/AddPost';
import Notifications from './components/Notification';
import ChatRequestList from './components/ChatRequestList'; // New: Chat Request List
import ChatRoom from './components/ChatRoom'; // New: Chat Room

// Function to check if the user is authenticated
const isAuthenticated = () => !!localStorage.getItem('token');

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  return isAuthenticated() ? children : <Navigate to="/login" replace />;
};

// Public Route Component
const PublicRoute = ({ children }) => {
  return isAuthenticated() ? <Navigate to="/" replace /> : children;
};

const App = () => {
  return (
    <Router>
      <ToastContainer position="top-center" /> {/* Toast notifications */}
      <Navbar />
      <Routes>
        {/* Redirect to login if not authenticated */}
        <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
        <Route path="/add-post" element={<ProtectedRoute><AddPost /></ProtectedRoute>} />
        <Route path="/question/:id" element={<ProtectedRoute><QuestionDetails /></ProtectedRoute>} />
        <Route path="/notifications" element={<ProtectedRoute><Notifications /></ProtectedRoute>} />
        <Route path="/chat-requests" element={<ProtectedRoute><ChatRequestList /></ProtectedRoute>} />
        <Route path="/chat-room/:chatRoomId" element={<ProtectedRoute><ChatRoom /></ProtectedRoute>} />
        
        {/* Public routes for login and register */}
        <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
        <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />

        {/* Catch-all route for 404 */}
        <Route path="*" element={<div>404 - Page Not Found</div>} />
      </Routes>
    </Router>
  );
};

export default App;
