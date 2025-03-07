import React from 'react';

const DashboardStats = ({ stats, onActionClick }) => {
  return (
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
          <button 
            className="action-btn" 
            onClick={() => onActionClick('mentors')}
          >
            Review Mentor Requests
          </button>
          <button 
            className="action-btn" 
            onClick={() => onActionClick('events')}
          >
            Create New Event
          </button>
        </div>
      </div>
    </div>
  );
};

export default DashboardStats;