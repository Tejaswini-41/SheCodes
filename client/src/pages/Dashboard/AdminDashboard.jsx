import React, { useContext, useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { apiRequest, API_ENDPOINTS } from '../../utils/apiUtils';
import EventForm from '../../components/forms/EventForm';
import MentorRequests from '../../components/admin/MentorRequests';
import DashboardStats from '../../components/admin/DashboardStats';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const { user } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState('overview');
  const [mentorRequests, setMentorRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showEventForm, setShowEventForm] = useState(false);
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    totalEvents: 0,
    totalMentors: 0
  });
  
  // Check for admin role
  if (!user || user.role !== 'admin') {
    return <Navigate to="/dashboard" />;
  }
  
  // Fetch admin statistics and mentor requests
  useEffect(() => {
    const fetchAdminData = async () => {
      setLoading(true);
      try {
        // Fetch pending mentor requests with authentication
        const mentorsResponse = await apiRequest(
          'get', 
          `${API_ENDPOINTS.MENTORS}/all`, 
          null, 
          user
        );
        
        const pendingMentors = mentorsResponse.filter(mentor => mentor.status === 'pending');
        setMentorRequests(pendingMentors);
        
        // Get other stats
        setStats({
          totalUsers: 125, // Placeholder - would come from an API
          activeUsers: 78,
          totalEvents: mentorsResponse.length,
          totalMentors: mentorsResponse.filter(m => m.status === 'approved').length
        });
      } catch (error) {
        console.error('Error fetching admin data:', error);
        setError('Failed to load admin data. Please check that you are logged in with admin privileges.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchAdminData();
  }, [user]);
  
  const handleEventSuccess = () => {
    alert('Event created successfully!');
    setShowEventForm(false);
  };
  
  return (
    <div className="admin-dashboard">
      <div className="admin-header">
        <h1>Admin Dashboard</h1>
        <p>Welcome back, {user?.name}</p>
      </div>
      
      <div className="admin-nav">
        <button 
          className={activeTab === 'overview' ? 'active' : ''} 
          onClick={() => setActiveTab('overview')}
        >
          Overview
        </button>
        <button 
          className={activeTab === 'mentors' ? 'active' : ''} 
          onClick={() => setActiveTab('mentors')}
        >
          Mentor Requests {mentorRequests.length > 0 && <span className="badge">{mentorRequests.length}</span>}
        </button>
        <button 
          className={activeTab === 'events' ? 'active' : ''} 
          onClick={() => setActiveTab('events')}
        >
          Create Events
        </button>
      </div>
      
      {loading && <div className="loading">Loading data...</div>}
      {error && <div className="error-message">{error}</div>}
      
      {/* Overview Tab - Dashboard Stats */}
      {activeTab === 'overview' && (
        <DashboardStats stats={stats} onActionClick={setActiveTab} />
      )}
      
      {/* Mentor Requests Tab */}
      {activeTab === 'mentors' && (
        <div className="admin-tab-content">
          <h2>Pending Mentor Requests</h2>
          <MentorRequests 
            requests={mentorRequests} 
            onUpdate={setMentorRequests}
            user={user}
          />
        </div>
      )}
      
      {/* Events Tab */}
      {activeTab === 'events' && (
        <div className="admin-tab-content">
          <div className="events-header">
            <h2>Event Management</h2>
            <button 
              className="create-event-btn" 
              onClick={() => setShowEventForm(true)}
            >
              Create New Event
            </button>
          </div>
          
          {showEventForm && (
            <div className="modal-overlay">
              <div className="modal-content">
                <h2>Create a New Event</h2>
                <EventForm 
                  onClose={() => setShowEventForm(false)}
                  onSuccess={handleEventSuccess}
                  user={user}
                />
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;