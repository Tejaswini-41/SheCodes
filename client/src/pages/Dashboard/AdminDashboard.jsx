import React, { useContext, useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { apiRequest, API_ENDPOINTS } from '../../utils/apiUtils';
import EventForm from '../../components/forms/EventForm';
import MentorRequests from '../../components/admin/MentorRequests';
import DashboardStats from '../../components/admin/DashboardStats';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const { user, loading: authLoading } = useContext(AuthContext);
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
  const [events, setEvents] = useState([]);
  const [editingEvent, setEditingEvent] = useState(null);

  // Fetch admin data after authentication is confirmed
  useEffect(() => {
    if (authLoading) return; // Don't do anything while auth is loading
    if (!user || user.role !== 'admin') return;
    
    const fetchAdminData = async () => {
      setLoading(true);
      try {
        // Fetch user stats using the auth endpoint
        const userStatsResponse = await apiRequest(
          'get',
          `${API_ENDPOINTS.AUTH}/stats`,
          null,
          user
        );
        
        // Fetch mentor data
        const mentorsResponse = await apiRequest(
          'get', 
          `${API_ENDPOINTS.MENTORS}/all`, 
          null, 
          user
        );
        
        // Fetch events data
        const eventsResponse = await apiRequest(
          'get',
          `${API_ENDPOINTS.EVENTS}`,
          null,
          user
        );
        
        // Store events in state
        setEvents(Array.isArray(eventsResponse) ? eventsResponse : []);
        
        // Process mentor requests
        const pendingMentors = Array.isArray(mentorsResponse) 
          ? mentorsResponse.filter(mentor => mentor.status === 'pending')
          : [];
        
        setMentorRequests(pendingMentors);
        
        // Set real stats from API responses with fallbacks
        setStats({
          totalUsers: userStatsResponse?.totalUsers || 0,
          activeUsers: userStatsResponse?.activeUsers || 0,
          totalEvents: Array.isArray(eventsResponse) ? eventsResponse.length : 0,
          totalMentors: Array.isArray(mentorsResponse) 
            ? mentorsResponse.filter(m => m.status === 'approved').length 
            : 0
        });
      } catch (error) {
        console.error('Error fetching admin data:', error);
        
        // Fallback to placeholder data if API fails
        setStats({
          totalUsers: 125,
          activeUsers: 78,
          totalEvents: 15,
          totalMentors: 8
        });
        
        setError('Failed to load some admin data. Using placeholder values.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchAdminData();
  }, [authLoading, user]);
  
  const handleDeleteEvent = async (eventId) => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      try {
        console.log('Deleting event with ID:', eventId); // Add for debugging
        
        await apiRequest(
          'delete', 
          `${API_ENDPOINTS.EVENTS}/${eventId}`, 
          null, 
          user
        );
        
        // Remove the deleted event from the list
        setEvents(prevEvents => prevEvents.filter(event => event._id !== eventId));
        alert('Event deleted successfully!');
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
    // Refresh events data
    fetchAdminData();
  };
  
  // Show loading state while checking authentication
  if (authLoading) {
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
                  user={user}
                  eventToEdit={editingEvent}
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