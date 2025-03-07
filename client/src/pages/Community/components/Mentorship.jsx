import React, { useState, useEffect } from 'react';
import axios from 'axios';

const MENTOR_API_URL = 'http://localhost:5000/api/mentors';

const Mentorship = () => {
  const [showMentorForm, setShowMentorForm] = useState(false);
  const [mentors, setMentors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [mentorForm, setMentorForm] = useState({
    name: '',
    role: '',
    company: '',
    expertise: '',
    availability: '',
    linkedinUrl: '',
    avatar: 'https://cdn.prod.website-files.com/5ce11396d0cadb67eb2cac0e/621e3dddf8077a0ce7a409ba_Professional%20mentor.pngg',
    imageFile: null
  });

  const handleMentorInputChange = (e) => {
    const { name, value } = e.target;
    setMentorForm(prev => ({ ...prev, [name]: value }));
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
      console.log('Attempting to fetch mentors from:', MENTOR_API_URL);
      const response = await axios.get(MENTOR_API_URL);
      console.log('Response received:', response.data);
      setMentors(response.data);
    } catch (err) {
      console.error('Error details:', {
        message: err.message,
        response: err.response,
        status: err.response?.status
      });
      setError('Failed to load mentors. Please check if the server is running.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMentors();
  }, []);

  const handleMentorSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      const formData = new FormData();
      
      // Validate required fields before submission
      if (!mentorForm.name || !mentorForm.role || !mentorForm.company || !mentorForm.availability) {
        throw new Error('Please fill in all required fields');
      }
  
      // Process expertise - ensure it's not empty
      const expertiseArray = mentorForm.expertise
        .split(',')
        .map(item => item.trim())
        .filter(item => item !== '');
  
      if (expertiseArray.length === 0) {
        throw new Error('Please add at least one area of expertise');
      }
  
      // Add form fields to formData
      formData.append('name', mentorForm.name);
      formData.append('role', mentorForm.role);
      formData.append('company', mentorForm.company);
      formData.append('expertise', JSON.stringify(expertiseArray));
      formData.append('availability', mentorForm.availability);
      formData.append('linkedinUrl', mentorForm.linkedinUrl || 'https://www.linkedin.com/in/');
      
      if (mentorForm.imageFile) {
        formData.append('image', mentorForm.imageFile);
      }
  
      const response = await axios.post(MENTOR_API_URL, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
  
      setMentors(prevMentors => [...prevMentors, response.data]);
      setShowMentorForm(false);
      alert('Successfully registered as mentor!');
      
      // Reset form
      setMentorForm({
        name: '',
        role: '',
        company: '',
        expertise: '',
        availability: '',
        linkedinUrl: '',
        avatar: 'https://cdn.prod.website-files.com/5ce11396d0cadb67eb2cac0e/621e3dddf8077a0ce7a409ba_Professional%20mentor.pngg',
        imageFile: null
      });
    } catch (err) {
      console.error('Error submitting mentor form:', err);
      const errorMessage = err.response?.data?.errors?.[0] || 
                          err.response?.data?.message || 
                          err.message || 
                          'Failed to register as mentor';
      setError(errorMessage);
      alert(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="mentorship-section">
      <div className="section-header">
        <h2>Available Mentors</h2>
        <button 
          className="become-mentor-btn" 
          onClick={() => setShowMentorForm(true)}
        >
          Become a Mentor
        </button>
      </div>
      
      {loading && <div>Loading mentors...</div>}
      {error && <div className="error-message">{error}</div>}
      
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

      {showMentorForm && (
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
                <input 
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                />
                {mentorForm.avatar && (
                  <img 
                    src={mentorForm.avatar} 
                    alt="Preview" 
                    style={{ width: '100px', marginTop: '10px' }} 
                  />
                )}
              </div>
              <div className="form-actions">
                <button type="button" onClick={() => setShowMentorForm(false)}>
                  Cancel
                </button>
                <button type="submit" disabled={loading}>
                  {loading ? 'Submitting...' : 'Submit'}
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