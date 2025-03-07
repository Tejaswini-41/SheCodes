import React, { useState, useEffect } from 'react';
import './ProfileModal.css';

const ProfileModal = ({ isOpen, onClose }) => {
  const defaultUser = {
    name: 'Tejaswini Durge',
    email: 'tejaswinidurge41@gmail.com',
    avatar: '/Images/P1.png',
    role: 'Active Member',
    joinDate: new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
    interests: ['Technology', 'Leadership', 'Community'],
    location: 'New York, USA',
    phone: '845-123-4567',
    occupation: 'Software Developer',
    skills: ['React', 'JavaScript', 'UI/UX Design']
  };

  const [userData, setUserData] = useState(defaultUser);
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState(defaultUser);

  useEffect(() => {
    const storedUser = localStorage.getItem('userData');
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUserData({...defaultUser, ...parsedUser});
        setEditedData({...defaultUser, ...parsedUser});
      } catch (error) {
        console.error('Error parsing user data:', error);
        setUserData(defaultUser);
        setEditedData(defaultUser);
      }
    }
  }, []);

  const handleSave = () => {
    localStorage.setItem('userData', JSON.stringify(editedData));
    setUserData(editedData);
    setIsEditing(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('userData');
    localStorage.removeItem('token');
    window.location.href = '/login';
  };

  if (!isOpen) return null;

  return (
    <div className="profile-modal-overlay" onClick={onClose}>
      <div className="profile-modal" onClick={e => e.stopPropagation()}>
        <div className="profile-content">
          <div className="profile-header">
            <img 
              src={userData?.avatar || '/Images/P1.png'}
              alt={userData?.name}
              className="profile-avatar"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = '/Images/P1.png';
              }}
            />
            <div className="user-info">
              <h3 className="user-name">{userData.name}</h3>
              <p className="user-occupation">{userData.occupation}</p>
            </div>
          </div>

          {isEditing ? (
            <div className="edit-form">
              <input
                type="text"
                value={editedData.name}
                onChange={e => setEditedData({...editedData, name: e.target.value})}
                placeholder="Name"
                className="edit-input"
              />
              <input
                type="email"
                value={editedData.email}
                onChange={e => setEditedData({...editedData, email: e.target.value})}
                placeholder="Email"
                className="edit-input"
              />
              <input
                type="text"
                value={editedData.occupation}
                onChange={e => setEditedData({...editedData, occupation: e.target.value})}
                placeholder="Occupation"
                className="edit-input"
              />
              <input
                type="text"
                value={editedData.location}
                onChange={e => setEditedData({...editedData, location: e.target.value})}
                placeholder="Location"
                className="edit-input"
              />
              <input
                type="tel"
                value={editedData.phone}
                onChange={e => setEditedData({...editedData, phone: e.target.value})}
                placeholder="Phone"
                className="edit-input"
              />
              <div className="button-group">
                <button className="cancel-btn" onClick={() => setIsEditing(false)}>Cancel</button>
                <button className="save-btn" onClick={handleSave}>Save</button>
              </div>
            </div>
          ) : (
            <div className="profile-details">
              <div className="info-grid">
                <div className="info-item">
                  <i className="fas fa-envelope"></i>
                  <p>{userData.email}</p>
                </div>
                <div className="info-item">
                  <i className="fas fa-phone"></i>
                  <p>{userData.phone}</p>
                </div>
                <div className="info-item">
                  <i className="fas fa-map-marker-alt"></i>
                  <p>{userData.location}</p>
                </div>
                <div className="info-item">
                  <i className="fas fa-calendar"></i>
                  <p>Joined {userData.joinDate}</p>
                </div>
              </div>

              <div className="skills-section">
                <h4>Skills</h4>
                <div className="skills-tags">
                  {userData.skills.map((skill, index) => (
                    <span key={index} className="skill-tag">{skill}</span>
                  ))}
                </div>
              </div>

              <div className="interests-section">
                <h4>Interests</h4>
                <div className="interests-tags">
                  {userData.interests.map((interest, index) => (
                    <span key={index} className="interest-tag">{interest}</span>
                  ))}
                </div>
              </div>

              <button className="edit-btn" onClick={() => setIsEditing(true)}>
                <i className="fas fa-edit"></i> Edit Profile
              </button>
              <div className="divider"></div>
              <button className="logout-option" onClick={handleLogout}>
                <i className="fas fa-sign-out-alt"></i> Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileModal;
