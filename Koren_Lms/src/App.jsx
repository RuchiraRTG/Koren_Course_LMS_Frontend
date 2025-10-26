import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import SignUp from './pages/SignUp';
import SignIn from './pages/SignIn';
import Home from './pages/Home';
import UserProfile from './pages/UserProfile';
import MockExam from './pages/MockExam';
import TakeExam from './pages/TakeExam';
import AdminDashboard from './pages/AdminDashboard';
import DashboardOverview from './pages/DashboardOverview';
import Students from './pages/Students';
import Questions from './pages/Questions';
import Exams from './pages/Exams';

function App() {
  return (
    <Router>
      <Routes>
        {/* Auth Routes */}
        <Route path="/" element={<Navigate to="/signin" replace />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/signin" element={<SignIn />} />
        
        {/* Student Routes */}
        <Route path="/home" element={<Home />} />
        <Route path="/profile" element={<UserProfile />} />
        <Route path="/mock-exam" element={<MockExam />} />
        <Route path="/take-exam" element={<TakeExam />} />
        
        {/* Admin Routes */}
        <Route path="/admin" element={<AdminDashboard />}>
          <Route index element={<DashboardOverview />} />
          <Route path="students" element={<Students />} />
          <Route path="questions" element={<Questions />} />
          <Route path="exams" element={<Exams />} />
          <Route path="courses" element={<div className="text-center py-12"><h2 className="text-2xl font-bold text-gray-900">Courses Management</h2><p className="text-gray-600 mt-2">Coming soon...</p></div>} />
          <Route path="settings" element={<div className="text-center py-12"><h2 className="text-2xl font-bold text-gray-900">Settings</h2><p className="text-gray-600 mt-2">Coming soon...</p></div>} />
        </Route>
        
        {/* Catch all - redirect to signin */}
        <Route path="*" element={<Navigate to="/signin" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
