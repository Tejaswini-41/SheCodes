import React, { useState, useEffect } from 'react';
import axios from 'axios';

const EVENT_API_URL = 'http://localhost:5000/api/events';

const Events = () => {
  const [showEventForm, setShowEventForm] = useState(false);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [eventForm, setEventForm] = useState({
    title: '',
    date: '',
    time: '',
    location: '',
    attendees: 0,
    image: '/Images/events/default.jpg',
    imageFile: null
  });

  const handleEventInputChange = (e) => {
    const { name, value } = e.target;
    setEventForm(prev => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setEventForm(prev => ({ ...prev, imageFile: file, image: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const response = await axios.get(EVENT_API_URL);
      setEvents(response.data);
    } catch (err) {
      setError('Failed to load events');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleEventSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      Object.keys(eventForm).forEach(key => {
        if (key === 'imageFile' && eventForm[key]) {
          formData.append('image', eventForm[key]);
        } else {
          formData.append(key, eventForm[key]);
        }
      });

      await axios.post(EVENT_API_URL, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      setShowEventForm(false);
      fetchEvents();
    } catch (err) {
      setError('Failed to create event');
    }
  };

  return (
    <section className="events-section">
      <div className="section-header">
        <h2>Upcoming Events</h2>
        <button className="create-event-btn" onClick={() => setShowEventForm(true)}>
          Create Event
        </button>
      </div>
      
      {loading && <div>Loading events...</div>}
      {error && <div className="error-message">{error}</div>}
      
      {showEventForm && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Create a New Event</h2>
            <form onSubmit={handleEventSubmit} className="event-form">
              <div className="form-group">
                <label>Event Title</label>
                <input 
                  type="text" 
                  name="title" 
                  value={eventForm.title} 
                  onChange={handleEventInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Date</label>
                <input 
                  type="date" 
                  name="date" 
                  value={eventForm.date} 
                  onChange={handleEventInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Time</label>
                <input 
                  type="time" 
                  name="time" 
                  value={eventForm.time} 
                  onChange={handleEventInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Location</label>
                <input 
                  type="text" 
                  name="location" 
                  value={eventForm.location} 
                  onChange={handleEventInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Event Image</label>
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
              <div className="form-actions">
                <button type="button" onClick={() => setShowEventForm(false)}>Cancel</button>
                <button type="submit">Create Event</button>
              </div>
            </form>
          </div>
        </div>
      )}
      
      <div className="events-grid">
        {events.map((event, index) => (
          <div key={index} className="event-card">
            <div className="event-image">
              <img src={event.image} alt={event.title} />
            </div>
            <div className="event-info">
              <h3>{event.title}</h3>
              <p><i className="far fa-calendar"></i> {event.date}</p>
              <p><i className="far fa-clock"></i> {event.time}</p>
              <p><i className="fas fa-map-marker-alt"></i> {event.location}</p>
              <p><i className="fas fa-users"></i> {event.attendees} attending</p>
              <button className="join-event-btn">Join Event</button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Events;
