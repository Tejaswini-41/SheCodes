import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../../../context/AuthContext';

const MENTOR_API_URL = 'http://localhost:5000/api/mentors';

const Mentorship = ({ isAdmin, isLoggedIn }) => {
  const { user } = useContext(AuthContext); // Get user from context instead of props
  console.log('Mentorship component props:', { isAdmin, isLoggedIn, userFromContext: !!user });
  
  const [showMentorForm, setShowMentorForm] = useState(false);
  const [mentors, setMentors] = useState([]);
  const [mentorRequests, setMentorRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [mentorForm, setMentorForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    role: '',
    company: '',
    expertise: '',
    experience: 1, // Default to 1 year
    availability: '2 slots available',
    linkedinUrl: 'https://www.linkedin.com/in/',
    avatar: '',
    imageFile: null,
    bio: ''
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

  useEffect(() => {
    console.log('Rendering Mentorship with:', { 
      isLoggedIn, 
      isAdmin, 
      showMentorForm: isLoggedIn && !isAdmin && !showMentorForm 
    });
  }, [isLoggedIn, isAdmin, showMentorForm]);

  const handleMentorSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      // Make sure we have the user's email
      if (!user?.email) {
        throw new Error('User email is required. Please ensure you are properly logged in.');
      }
      
      console.log('Submitting mentor form with data:', mentorForm);
      
      // Convert expertise to array if it's a string
      const expertiseArray = Array.isArray(mentorForm.expertise) 
        ? mentorForm.expertise 
        : mentorForm.expertise.split(',').map(item => item.trim());
      
      // Create the payload with required fields
      const mentorData = {
        name: mentorForm.name || user.name,
        email: user.email, // Use the logged in user's email
        role: mentorForm.role,
        company: mentorForm.company,
        expertise: expertiseArray,
        experience: parseInt(mentorForm.experience) || 1, // Parse to integer
        availability: mentorForm.availability || '2 slots available',
        bio: mentorForm.bio || `${mentorForm.role} at ${mentorForm.company}`,
        linkedinUrl: mentorForm.linkedinUrl,
        avatar: mentorForm.avatar || 'https://randomuser.me/api/portraits/women/1.jpg',
        status: 'pending'
      };
      
      console.log('Formatted mentor data to submit:', mentorData);
      
      // Send the request to create a mentor
      const response = await axios.post(MENTOR_API_URL, mentorData);
      
      console.log('Mentor submission response:', response.data);
      
      // Show success message
      alert('Your mentor application has been submitted successfully! Our admin will review it soon.');
      
      // Close the form
      setShowMentorForm(false);
      
    } catch (err) {
      console.error('Error submitting mentor form:', err);
      
      // Show a more detailed error message
      const errorMessage = err.response?.data?.message || err.message || 'Failed to submit mentor application';
      setError(errorMessage);
      alert(`Error: ${errorMessage}`);
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

  const handleSubmitMentorApplication = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      // Format the mentor data with proper expertise handling
      const formattedData = {
        ...mentorForm,
        expertise: Array.isArray(mentorForm.expertise) ? 
          mentorForm.expertise : 
          mentorForm.expertise.split(',').map(item => item.trim())
      };
      
      // If using image file upload, handle that here
      if (!useImageUrl && mentorForm.imageFile) {
        const formData = new FormData();
        formData.append('avatar', mentorForm.imageFile);
        
        // Upload image first if needed
        // const uploadResponse = await axios.post('your-upload-endpoint', formData);
        // formattedData.avatar = uploadResponse.data.url;
      }
      
      // Submit mentor application
      const response = await axios.post(MENTOR_API_URL, formattedData);
      
      // Show success message
      alert('Your mentor application has been submitted! Our team will review it soon.');
      
      // Reset form and hide it
      setMentorForm({
        name: '',
        role: '',
        company: '',
        expertise: '',
        availability: '',
        linkedinUrl: 'https://www.linkedin.com/in/',
        avatar: '',
        imageFile: null,
        bio: '',
        status: 'pending'
      });
      setShowMentorForm(false);
      
      // Refresh mentors list
      fetchMentors();
      
    } catch (err) {
      console.error('Error submitting mentor application:', err);
      setError('Failed to submit your application. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="mentorship-section">
      <div className="section-header">
        <h2>Available Mentors</h2>
        
        {/* Debug version with more explicit rendering */}
        {isLoggedIn ? (
          isAdmin ? (
            <span className="admin-note">Admin users manage mentors in the admin panel</span>
          ) : (
            <button 
              className="become-mentor-btn" 
              onClick={() => setShowMentorForm(true)}
            >
              Become a Mentor
            </button>
          )
        ) : (
          <div className="login-prompt">
            <p>Please <a href="/login">log in</a> to apply as a mentor</p>
          </div>
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
                <label>Experience (years)</label>
                <input 
                  type="number" 
                  name="experience" 
                  value={mentorForm.experience} 
                  onChange={handleMentorInputChange}
                  placeholder="e.g. 5"
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
                <label>Email (from your account)</label>
                <input 
                  type="email" 
                  value={user?.email || ''}
                  disabled
                  className="disabled-input"
                />
                <small className="form-help-text">We'll use your account email for communications</small>
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
              <div className="form-group">
                <label>Years of Experience</label>
                <input
                  type="number"
                  name="experience"
                  min="1"
                  max="50"
                  value={mentorForm.experience}
                  onChange={handleMentorInputChange}
                  required
                />
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