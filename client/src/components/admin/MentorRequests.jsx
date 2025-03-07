import React from 'react';
import { apiRequest, API_ENDPOINTS } from '../../utils/apiUtils';

const MentorRequests = ({ requests, onUpdate, user }) => {
  const handleApproveMentor = async (mentorId) => {
    try {
      console.log('Approving mentor with ID:', mentorId);
      
      await apiRequest(
        'patch', 
        `${API_ENDPOINTS.MENTORS}/${mentorId}/approve`, 
        {}, 
        user.token || user, // Use token directly if that's what's passed
        true
      );
      
      console.log('Mentor approved successfully');
      onUpdate(prev => prev.filter(mentor => mentor._id !== mentorId));
      alert('Mentor approved successfully!');
    } catch (err) {
      console.error('Error approving mentor:', err);
      alert('Failed to approve mentor');
    }
  };
  
  const handleRejectMentor = async (mentorId) => {
    try {
      console.log('Rejecting mentor with ID:', mentorId);
      
      await apiRequest(
        'delete', 
        `${API_ENDPOINTS.MENTORS}/${mentorId}`, 
        null, 
        user.token || user, // Use token directly if that's what's passed
        true
      );
      
      console.log('Mentor rejected successfully');
      onUpdate(prev => prev.filter(mentor => mentor._id !== mentorId));
      alert('Mentor request rejected!');
    } catch (err) {
      console.error('Error rejecting mentor:', err);
      alert('Failed to reject mentor');
    }
  };

  if (requests.length === 0) {
    return <p>No pending mentor requests.</p>;
  }

  return (
    <div className="mentor-requests-list">
      {requests.map((request) => (
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
  );
};

export default MentorRequests;