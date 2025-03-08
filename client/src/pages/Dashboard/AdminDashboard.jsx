import React, { useContext, useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { apiRequest, API_ENDPOINTS } from '../../utils/apiUtils';
import EventForm from '../../components/forms/EventForm';
import MentorRequests from '../../components/admin/MentorRequests';
import DashboardStats from '../../components/admin/DashboardStats';
import AdminJobsManager from '../admin/AdminJobsManager';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const { user, token } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState('overview');
  const [mentorRequests, setMentorRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showEventForm, setShowEventForm] = useState(false);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalEvents: 0,
    totalMentors: 0,
    totalBlogs: 0,
    totalJobs: 0
  });
  const [events, setEvents] = useState([]);
  const [editingEvent, setEditingEvent] = useState(null);
  const [activeAdminTab, setActiveAdminTab] = useState('users');

  // Fetch admin data after authentication is confirmed
  useEffect(() => {
    if (token) {
      fetchAdminData();
      fetchMentorRequests();
      fetchEvents();
    } else {
      setError("Authentication required");
      setLoading(false);
    }
  }, [token]);

  const fetchAdminData = async () => {
    try {
      setLoading(true);
      
      console.log("Fetching admin data with token:", token ? "Token exists" : "No token");
      
      const response = await apiRequest(
        'get',
        API_ENDPOINTS.AUTH + '/stats',
        null,
        token,
        true
      );
      
      console.log("Admin stats response:", response);
      
      if (response) {
        setStats(response);
      }
      
      setError(null);
    } catch (err) {
      console.error('Error fetching admin data:', err);
      setError("Failed to load admin data. Please check your permissions.");
    } finally {
      setLoading(false);
    }
  };

  const fetchMentorRequests = async () => {
    try {
      console.log('Fetching pending mentor requests...');
      
      const response = await apiRequest(
        'get',
        `${API_ENDPOINTS.MENTORS}/pending`,
        null,
        token, // Pass token, not user
        true
      );
      
      console.log('Mentor requests response:', response);
      
      // Handle different response formats
      if (response && Array.isArray(response)) {
        setMentorRequests(response);
      } else if (response && Array.isArray(response.mentorRequests)) {
        setMentorRequests(response.mentorRequests);
      } else {
        console.warn('Unexpected mentor requests format:', response);
        setMentorRequests([]);
      }
    } catch (err) {
      console.error('Error fetching mentor requests:', err);
      setMentorRequests([]);
    }
  };

  const fetchEvents = async () => {
    try {
      const response = await apiRequest(
        'get',
        API_ENDPOINTS.EVENTS,
        null,
        token
      );
      
      console.log('Events response:', response);
      
      // Handle different response formats
      if (response && Array.isArray(response)) {
        setEvents(response);
      } else if (response && Array.isArray(response.events)) {
        setEvents(response.events);
      } else {
        console.warn('Unexpected events format:', response);
        setEvents([]);
      }
    } catch (err) {
      console.error('Error fetching events:', err);
      setEvents([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteEvent = async (eventId) => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      try {
        console.log('Deleting event with ID:', eventId);
        
        await apiRequest(
          'delete', 
          `${API_ENDPOINTS.EVENTS}/${eventId}`, 
          null, 
          token, // Pass token, not user
          true
        );
        
        // Remove the deleted event from the list
        setEvents(prevEvents => prevEvents.filter(event => event._id !== eventId));
        alert('Event deleted successfully!');
        
        // Refresh stats after deletion
        fetchAdminData();
      } catch (error) {
        console.error('Error deleting event:', error);
        alert(`Failed to delete event: ${error.response?.data?.message || error.message}`);
      }
    }
  };

  const handleEditEvent = (event) => {
    setEditingEvent(event);
    setShowEventForm(true);
  };

  const handleEventSuccess = (wasEditing) => {
    alert(wasEditing ? 'Event updated successfully!' : 'Event created successfully!');
    setShowEventForm(false);
    setEditingEvent(null);
    
    // Refresh both events and admin stats
    Promise.all([fetchEvents(), fetchAdminData()]);
  };

  const handleMentorUpdate = async () => {
    // Refresh both mentor requests and admin stats
    await Promise.all([fetchMentorRequests(), fetchAdminData()]);
  };
  
  // Show loading state while checking authentication
  if (loading) {
    return <div className="loading-container">Loading admin dashboard...</div>;
  }
  
  // Redirect if not admin - only after auth check is complete
  if (!user || user.role !== 'admin') {
    return <Navigate to="/dashboard" />;
  }

  // Rest of your component remains the same
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
        <button 
          className={activeTab === 'jobs' ? 'active' : ''} 
          onClick={() => setActiveTab('jobs')}
        >
          <i className="fas fa-briefcase"></i> Manage Jobs
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
            onUpdate={handleMentorUpdate}
            user={token} // Pass token, not user object
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
          
          {/* Events list */}
          <div className="admin-events-list">
            {events.length === 0 ? (
              <p>No events found. Create your first event!</p>
            ) : (
              <table className="events-table">
                <thead>
                  <tr>
                    <th>Image</th>
                    <th>Title</th>
                    <th>Date</th>
                    <th>Time</th>
                    <th>Location</th>
                    <th>Attendees</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {events.map(event => (
                    <tr key={event._id}>
                      <td>
                        <img 
                          src={event.image || '/Images/events/default.jpg'} 
                          alt={event.title}
                          className="event-thumbnail"
                          onError={(e) => e.target.src = '/Images/events/default.jpg'}
                        />
                      </td>
                      <td>{event.title}</td>
                      <td>{event.date}</td>
                      <td>{event.time}</td>
                      <td>{event.location}</td>
                      <td>{event.attendees}</td>
                      <td>
                        <div className="event-actions">
                          <button 
                            className="edit-btn"
                            onClick={() => handleEditEvent(event)}
                          >
                            Edit
                          </button>
                          <button 
                            className="delete-btn"
                            onClick={() => handleDeleteEvent(event._id)}
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
          
          {showEventForm && (
            <div className="modal-overlay">
              <div className="modal-content">
                <h2>{editingEvent ? 'Edit Event' : 'Create a New Event'}</h2>
                <EventForm 
                  onClose={() => {
                    setShowEventForm(false);
                    setEditingEvent(null);
                  }}
                  onSuccess={handleEventSuccess}
                  user={token} // Pass token, not user object
                  eventToEdit={editingEvent}
                />
              </div>
            </div>
          )}
        </div>
      )}

      {/* Jobs Management Tab */}
      {activeTab === 'jobs' && (
        <div className="admin-tab-content">
          <AdminJobsManager user={user} token={token} />
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;