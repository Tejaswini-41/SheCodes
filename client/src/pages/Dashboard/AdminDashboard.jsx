import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';
import { Navigate } from 'react-router-dom';
import './AdminDashboard.css';

const MENTOR_API_URL = 'http://localhost:5000/api/mentors';
const EVENT_API_URL = 'http://localhost:5000/api/events';

const AdminDashboard = () => {
  const { user } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    totalEvents: 0,
    totalMentors: 0
  });
  
  const [mentorRequests, setMentorRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Event creation state
  const [showEventForm, setShowEventForm] = useState(false);
  const [eventForm, setEventForm] = useState({
    title: '',
    date: '',
    time: '',
    location: '',
    attendees: 0,
    image: null
  });
  
  // Check for admin role, redirect if not admin
  if (!user || user.role !== 'admin') {
    return <Navigate to="/dashboard" />;
  }
  
  // Get auth token for API requests
  const getAuthHeader = () => {
    if (user && user.token) {
      return { Authorization: `Bearer ${user.token}` };
    }
    return {};
  };
  
  // Fetch admin statistics and mentor requests
  useEffect(() => {
    const fetchAdminData = async () => {
      setLoading(true);
      try {
        // Fetch pending mentor requests with authentication token
        const mentorsResponse = await axios.get(`${MENTOR_API_URL}/all`, {
          headers: getAuthHeader()
        });
        
        const pendingMentors = mentorsResponse.data.filter(mentor => mentor.status === 'pending');
        setMentorRequests(pendingMentors);
        
        // Get other stats
        setStats({
          totalUsers: 125, // Placeholder - would come from an API
          activeUsers: 78,
          totalEvents: mentorsResponse.data.length,
          totalMentors: mentorsResponse.data.filter(m => m.status === 'approved').length
        });
      } catch (error) {
        console.error('Error fetching admin data:', error);
        setError('Failed to load admin data. Please check that you are logged in with admin privileges.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchAdminData();
  }, [user]); // Added user as dependency to rerun when user/auth changes
  
  const handleApproveMentor = async (mentorId) => {
    try {
      await axios.patch(`${MENTOR_API_URL}/${mentorId}/approve`, {}, {
        headers: getAuthHeader()
      });
      // Remove from pending list
      setMentorRequests(prev => prev.filter(mentor => mentor._id !== mentorId));
      alert('Mentor approved successfully!');
    } catch (err) {
      console.error('Error approving mentor:', err);
      alert('Failed to approve mentor');
    }
  };
  
  const handleRejectMentor = async (mentorId) => {
    try {
      await axios.delete(`${MENTOR_API_URL}/${mentorId}`, {
        headers: getAuthHeader()
      });
      // Remove from pending list
      setMentorRequests(prev => prev.filter(mentor => mentor._id !== mentorId));
      alert('Mentor request rejected!');
    } catch (err) {
      console.error('Error rejecting mentor:', err);
      alert('Failed to reject mentor');
    }
  };
  
  const handleEventInputChange = (e) => {
    const { name, value } = e.target;
    setEventForm(prev => ({ ...prev, [name]: value }));
  };

  const handleEventImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setEventForm(prev => ({ ...prev, imageFile: file, image: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };
  
  const handleCreateEvent = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      Object.keys(eventForm).forEach(key => {
        if (key === 'imageFile' && eventForm[key]) {
          formData.append('image', eventForm[key]);
        } else if (key !== 'imageFile') {
          formData.append(key, eventForm[key]);
        }
      });

      await axios.post(EVENT_API_URL, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      setShowEventForm(false);
      alert('Event created successfully!');
      
      // Reset form
      setEventForm({
        title: '',
        date: '',
        time: '',
        location: '',
        attendees: 0,
        image: null,
        imageFile: null
      });
    } catch (err) {
      console.error('Error creating event:', err);
      alert('Failed to create event');
    }
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
      
      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="admin-tab-content">
          <div className="admin-stats">
            <div className="stat-card">
              <h3>Total Users</h3>
              <p className="stat-number">{stats.totalUsers}</p>
            </div>
            <div className="stat-card">
              <h3>Active Users</h3>
              <p className="stat-number">{stats.activeUsers}</p>
            </div>
            <div className="stat-card">
              <h3>Total Events</h3>
              <p className="stat-number">{stats.totalEvents}</p>
            </div>
            <div className="stat-card">
              <h3>Mentors</h3>
              <p className="stat-number">{stats.totalMentors}</p>
            </div>
          </div>
          
          <div className="admin-actions">
            <h2>Quick Actions</h2>
            <div className="action-buttons">
              <button className="action-btn" onClick={() => setActiveTab('mentors')}>
                Review Mentor Requests
              </button>
              <button className="action-btn" onClick={() => setActiveTab('events')}>
                Create New Event
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Mentor Requests Tab */}
      {activeTab === 'mentors' && (
        <div className="admin-tab-content">
          <h2>Pending Mentor Requests</h2>
          
          {mentorRequests.length === 0 ? (
            <p>No pending mentor requests.</p>
          ) : (
            <div className="mentor-requests-list">
              {mentorRequests.map((request) => (
                <div key={request._id} className="mentor-request-card">
                  <div className="request-avatar">
                    <img src={request.avatar || 'https://randomuser.me/api/portraits/women/1.jpg'} alt={request.name} />
                  </div>
                  <div className="request-info">
                    <h4>{request.name}</h4>
                    <p>{request.role} at {request.company}</p>
                    <p>Expertise: {Array.isArray(request.expertise) ? 
                      request.expertise.join(', ') : request.expertise}</p>
                    <p>Availability: {request.availability}</p>
                  </div>
                  <div className="request-actions">
                    <button 
                      className="approve-btn" 
                      onClick={() => handleApproveMentor(request._id)}
                    >
                      Approve
                    </button>
                    <button 
                      className="reject-btn" 
                      onClick={() => handleRejectMentor(request._id)}
                    >
                      Reject
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
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
                <form onSubmit={handleCreateEvent} className="event-form">
                  <div className="form-group">
                    <label>Event Title</label>
                    <input 
                      type="text" 
                      name="title" 
                      value={eventForm.title} 
                      onChange={handleEventInputChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Date</label>
                    <input 
                      type="date" 
                      name="date" 
                      value={eventForm.date} 
                      onChange={handleEventInputChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Time</label>
                    <input 
                      type="time" 
                      name="time" 
                      value={eventForm.time} 
                      onChange={handleEventInputChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Location</label>
                    <input 
                      type="text" 
                      name="location" 
                      value={eventForm.location} 
                      onChange={handleEventInputChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Event Image</label>
                    <input 
                      type="file"
                      accept="image/*"
                      onChange={handleEventImageUpload}
                    />
                    {eventForm.image && (
                      <img 
                        src={eventForm.image} 
                        alt="Preview" 
                        style={{ width: '100px', marginTop: '10px' }} 
                      />
                    )}
                  </div>
                  <div className="form-actions">
                    <button type="button" onClick={() => setShowEventForm(false)}>Cancel</button>
                    <button type="submit">Create Event</button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;