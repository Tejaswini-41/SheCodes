import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../../../context/AuthContext';

const MENTOR_API_URL = 'http://localhost:5000/api/mentors';

const Mentorship = ({ isAdmin, isLoggedIn }) => {
  const { user } = useContext(AuthContext); // Add this to get the user context
  const [showMentorForm, setShowMentorForm] = useState(false);
  const [mentors, setMentors] = useState([]);
  const [mentorRequests, setMentorRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [mentorForm, setMentorForm] = useState({
    name: '',
    role: '',
    company: '',
    expertise: '',
    availability: '',
    linkedinUrl: 'https://www.linkedin.com/in/',
    avatar: '',
    imageFile: null,
    status: 'pending' // Add status field for pending/approved
  });
  const [useImageUrl, setUseImageUrl] = useState(true); // Default to URL input instead of file upload

  const handleMentorInputChange = (e) => {
    const { name, value } = e.target;
    setMentorForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setMentorForm(prev => ({ ...prev, imageFile: file, avatar: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const fetchMentors = async () => {
    setLoading(true);
    try {
      // For regular users, only fetch approved mentors
      // For admins, fetch all mentors
      const response = await axios.get(`${MENTOR_API_URL}${isAdmin ? '/all' : ''}`);
      
      if (isAdmin) {
        // If admin, separate approved mentors and pending requests
        const approved = response.data.filter(mentor => mentor.status === 'approved');
        const pending = response.data.filter(mentor => mentor.status === 'pending');
        setMentors(approved);
        setMentorRequests(pending);
      } else {
        // For regular users, only show approved mentors
        setMentors(response.data.filter(mentor => mentor.status === 'approved'));
      }
    } catch (err) {
      console.error('Error fetching mentors:', err);
      setError('Failed to load mentors');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMentors();
  }, [isAdmin]);

  const handleMentorSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      // Process expertise
      const expertiseArray = mentorForm.expertise
        .split(',')
        .map(item => item.trim())
        .filter(item => item !== '');
      
      // Create mentor data object
      const mentorData = {
        name: mentorForm.name,
        role: mentorForm.role,
        company: mentorForm.company,
        expertise: expertiseArray,
        availability: mentorForm.availability,
        linkedinUrl: mentorForm.linkedinUrl || 'https://www.linkedin.com/in/',
        status: 'pending'
      };
      
      // Only include avatar if using URL option or we have a valid avatar URL
      if (useImageUrl && mentorForm.avatar) {
        mentorData.avatar = mentorForm.avatar;
      } else if (!useImageUrl) {
        // Use default avatar or let the server assign one
        // The server already has a default avatar setting in the Mentor model
      }

      // Create headers
      const config = {
        headers: {
          'Content-Type': 'application/json'
        }
      };
      
      if (user && user.token) {
        config.headers['Authorization'] = `Bearer ${user.token}`;
      }
      
      const response = await axios.post(MENTOR_API_URL, mentorData, config);
      console.log('Mentor application submitted:', response.data);

      setShowMentorForm(false);
      alert('Your mentor application has been submitted and is awaiting approval!');
      
      // Reset form
      setMentorForm({
        name: '',
        role: '',
        company: '',
        expertise: '',
        availability: '',
        linkedinUrl: 'https://www.linkedin.com/in/',
        avatar: '',
        imageFile: null,
        status: 'pending'
      });
      
      // Refresh the mentors list
      fetchMentors();
    } catch (err) {
      console.error('Error submitting mentor form:', err);
      const errorMsg = err.response?.data?.message || err.message || 'Failed to submit mentor application';
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };
  
  const handleApproveMentor = async (mentorId) => {
    try {
      await axios.patch(`${MENTOR_API_URL}/${mentorId}/approve`);
      alert('Mentor approved successfully!');
      fetchMentors();
    } catch (err) {
      console.error('Error approving mentor:', err);
      alert('Failed to approve mentor');
    }
  };
  
  const handleRejectMentor = async (mentorId) => {
    try {
      await axios.delete(`${MENTOR_API_URL}/${mentorId}`);
      alert('Mentor request rejected!');
      fetchMentors();
    } catch (err) {
      console.error('Error rejecting mentor:', err);
      alert('Failed to reject mentor');
    }
  };

  return (
    <section className="mentorship-section">
      <div className="section-header">
        <h2>Available Mentors</h2>
        {isLoggedIn && !isAdmin && (
          <button 
            className="become-mentor-btn" 
            onClick={() => setShowMentorForm(true)}
          >
            Become a Mentor
          </button>
        )}
      </div>
      
      {loading && <div>Loading mentors...</div>}
      {error && <div className="error-message">{error}</div>}
      
      {/* Admin section - only visible to admins */}
      {isAdmin && mentorRequests.length > 0 && (
        <div className="mentor-requests">
          <h3>Pending Mentor Requests</h3>
          <div className="requests-list">
            {mentorRequests.map((request, index) => (
              <div key={index} className="mentor-request-card">
                <div className="request-avatar">
                  <img src={request.avatar} alt={request.name} />
                </div>
                <div className="request-info">
                  <h4>{request.name}</h4>
                  <p>{request.role} at {request.company}</p>
                  <p>Expertise: {Array.isArray(request.expertise) ? 
                    request.expertise.join(', ') : request.expertise}</p>
                  <p>Availability: {request.availability}</p>
                </div>
                <div className="request-actions">
                  <button onClick={() => handleApproveMentor(request._id)}>Approve</button>
                  <button onClick={() => handleRejectMentor(request._id)}>Reject</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* Mentors grid - visible to everyone */}
      <div className="mentors-grid">
        {mentors.map((mentor, index) => (
          <div key={index} className="mentor-card">
            <div className="mentor-header">
              <img src={mentor.avatar || 'https://cdn.prod.website-files.com/5ce11396d0cadb67eb2cac0e/621e3dddf8077a0ce7a409ba_Professional%20mentor.pngg'} alt={mentor.name} />
              <div className="mentor-status">{mentor.availability}</div>
            </div>
            <div className="mentor-info">
              <h3>{mentor.name}</h3>
              <p className="mentor-role">{mentor.role} at {mentor.company}</p>
              <div className="mentor-expertise">
                {Array.isArray(mentor.expertise) ? 
                  mentor.expertise.map((skill, i) => (
                    <span key={i} className="expertise-tag">{skill}</span>
                  )) : 
                  <span className="expertise-tag">{mentor.expertise}</span>
                }
              </div>
              <button 
                className="connect-btn" 
                onClick={() => window.location.href = mentor.linkedinUrl || 'https://www.linkedin.com/'}
              >
                Connect
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Mentor application form - only for non-admin users */}
      {showMentorForm && isLoggedIn && !isAdmin && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Become a Mentor</h2>
            <form onSubmit={handleMentorSubmit} className="mentor-form">
              <div className="form-group">
                <label>Full Name</label>
                <input 
                  type="text" 
                  name="name" 
                  value={mentorForm.name} 
                  onChange={handleMentorInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Professional Role</label>
                <input 
                  type="text" 
                  name="role" 
                  value={mentorForm.role} 
                  onChange={handleMentorInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Company</label>
                <input 
                  type="text" 
                  name="company" 
                  value={mentorForm.company} 
                  onChange={handleMentorInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Expertise (comma separated)</label>
                <input 
                  type="text" 
                  name="expertise" 
                  value={mentorForm.expertise} 
                  onChange={handleMentorInputChange}
                  placeholder="e.g. Web Development, Leadership, AI"
                  required
                />
              </div>
              <div className="form-group">
                <label>Availability</label>
                <input 
                  type="text" 
                  name="availability" 
                  value={mentorForm.availability} 
                  onChange={handleMentorInputChange}
                  placeholder="e.g. 2 slots available"
                  required
                />
              </div>
              <div className="form-group">
                <label>LinkedIn URL</label>
                <input 
                  type="text" 
                  name="linkedinUrl" 
                  value={mentorForm.linkedinUrl} 
                  onChange={handleMentorInputChange}
                  placeholder="e.g. https://www.linkedin.com/in/your-profile"
                />
              </div>
              <div className="form-group">
                <label>Profile Image</label>
                
                <div className="image-input-toggle">
                  <label>
                    <input
                      type="radio"
                      name="imageInputType"
                      checked={useImageUrl}
                      onChange={() => setUseImageUrl(true)}
                    />
                    Use Image URL
                  </label>
                  <label style={{marginLeft: '15px'}}>
                    <input
                      type="radio"
                      name="imageInputType"
                      checked={!useImageUrl}
                      onChange={() => setUseImageUrl(false)}
                    />
                    Upload Image
                  </label>
                </div>
                
                {useImageUrl ? (
                  <div>
                    <input
                      type="url"
                      name="avatar"
                      value={mentorForm.avatar}
                      onChange={handleMentorInputChange}
                      placeholder="Enter image URL (e.g., https://example.com/image.jpg)"
                      className="image-url-input"
                    />
                    {mentorForm.avatar && (
                      <img
                        src={mentorForm.avatar}
                        alt="Preview"
                        style={{ width: '100px', marginTop: '10px' }}
                        onError={(e) => e.target.src = 'https://randomuser.me/api/portraits/women/1.jpg'}
                      />
                    )}
                  </div>
                ) : (
                  <div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                    />
                    {mentorForm.avatar && mentorForm.imageFile && (
                      <img
                        src={mentorForm.avatar}
                        alt="Preview"
                        style={{ width: '100px', marginTop: '10px' }}
                      />
                    )}
                  </div>
                )}
              </div>
              <div className="form-actions">
                <button type="button" onClick={() => setShowMentorForm(false)}>
                  Cancel
                </button>
                <button type="submit" disabled={loading}>
                  {loading ? 'Submitting...' : 'Submit Application'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
};

export default Mentorship;