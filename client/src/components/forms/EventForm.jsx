import React, { useState } from 'react';
import { apiRequest, API_ENDPOINTS, handleImagePreview } from '../../utils/apiUtils';

const EventForm = ({ onClose, onSuccess, user }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [useImageUrl, setUseImageUrl] = useState(true);
  const [eventForm, setEventForm] = useState({
    title: '',
    date: '',
    time: '',
    location: '',
    attendees: 0,
    image: '',
    imageFile: null
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEventForm(prev => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = (e) => {
    handleImagePreview(e.target.files[0], setEventForm);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      if (useImageUrl) {
        // Send event with image URL
        const eventData = {
          ...eventForm,
          image: eventForm.image || '/Images/events/default.jpg'
        };
        
        await apiRequest('post', API_ENDPOINTS.EVENTS, eventData, user);
      } else {
        // Send event with uploaded image
        const formData = new FormData();
        Object.keys(eventForm).forEach(key => {
          if (key === 'imageFile' && eventForm[key]) {
            formData.append('image', eventForm[key]);
          } else if (key !== 'imageFile') {
            formData.append(key, eventForm[key]);
          }
        });
        
        await apiRequest('post', API_ENDPOINTS.EVENTS, formData, user, true);
      }
      
      onSuccess && onSuccess();
      onClose && onClose();
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Failed to create event';
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="event-form">
      {error && <div className="error-message">{error}</div>}
      
      <div className="form-group">
        <label>Event Title</label>
        <input 
          type="text" 
          name="title" 
          value={eventForm.title} 
          onChange={handleInputChange}
          required
        />
      </div>
      
      <div className="form-group">
        <label>Date</label>
        <input 
          type="date" 
          name="date" 
          value={eventForm.date} 
          onChange={handleInputChange}
          required
        />
      </div>
      
      <div className="form-group">
        <label>Time</label>
        <input 
          type="time" 
          name="time" 
          value={eventForm.time} 
          onChange={handleInputChange}
          required
        />
      </div>
      
      <div className="form-group">
        <label>Location</label>
        <input 
          type="text" 
          name="location" 
          value={eventForm.location} 
          onChange={handleInputChange}
          required
        />
      </div>
      
      <div className="form-group">
        <label>Event Image</label>
        
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
              name="image"
              value={eventForm.image || ''}
              onChange={handleInputChange}
              placeholder="Enter image URL (e.g., https://example.com/event.jpg)"
              className="image-url-input"
            />
            {eventForm.image && (
              <img
                src={eventForm.image}
                alt="Preview"
                style={{ width: '100px', marginTop: '10px' }}
                onError={(e) => e.target.src = '/Images/events/default.jpg'}
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
            {eventForm.image && (
              <img
                src={eventForm.image}
                alt="Preview"
                style={{ width: '100px', marginTop: '10px' }}
              />
            )}
          </div>
        )}
      </div>
      
      <div className="form-actions">
        <button type="button" onClick={onClose} disabled={loading}>
          Cancel
        </button>
        <button type="submit" disabled={loading}>
          {loading ? 'Creating...' : 'Create Event'}
        </button>
      </div>
    </form>
  );
};

export default EventForm;