import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Login from './pages/Login/Login';
import Register from './pages/Register/Register';
import Dashboard from './pages/Dashboard/Dashboard';
import Education from './pages/Education/Education';
import Community from './pages/Community/Community';
import Tech from './pages/Tech/Tech';
import Blogs from './pages/Blogs/Blogs';
import Entrepreneurship from './pages/Entrepreneurship/Entrepreneurship';
import Health from './pages/Health/Health';
import Safety from './pages/Safety/Safety';
import Leadership from './pages/Leadership/Leadership';
import Contact from './pages/Contact/Contact';
import Finance from './pages/Finance/Finance';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/dashboard/education" element={<Education />} />
          <Route path="/dashboard/community" element={<Community />} />
          <Route path="/dashboard/tech" element={<Tech />} />
          <Route path="/dashboard/blogs" element={<Blogs />} />
          <Route path="/dashboard/entrepreneurship" element={<Entrepreneurship />} />
          <Route path="/dashboard/health" element={<Health />} />
          <Route path="/dashboard/safety" element={<Safety />} />
          <Route path="/dashboard/leadership" element={<Leadership />} />
          <Route path="/dashboard/finance" element={<Finance />} />
          <Route path="/dashboard/contact" element={<Contact />} />
          <Route path="/" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;