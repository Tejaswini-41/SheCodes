import React from 'react';

const DashboardStats = ({ stats, onActionClick }) => {
  // Add console.log to see what stats are available
  console.log('Dashboard stats received:', stats);

  return (
    <div className="admin-tab-content">
      <div className="admin-stats">
        <div className="stat-card">
          <h3>Total Users</h3>
          <p className="stat-number">{stats?.totalUsers || 0}</p>
        </div>
        <div className="stat-card">
          <h3>Active Users</h3>
          <p className="stat-number">{stats?.activeUsers || 0}</p>
        </div>
        <div className="stat-card">
          <h3>Total Events</h3>
          <p className="stat-number">{stats?.totalEvents || 0}</p>
        </div>
        <div className="stat-card">
          <h3>Approved Mentors</h3>
          <p className="stat-number">{stats?.totalMentors || 0}</p>
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
            {stats?.pendingMentors > 0 && (
              <span className="badge">{stats.pendingMentors}</span>
            )}
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