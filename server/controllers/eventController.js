import Event from '../models/Event.js';

// Get all events
export const getEvents = async (req, res) => {
  try {
    console.log('Fetching all events...');
    const events = await Event.find({}).sort({ date: 1 });
    console.log(`✅ Successfully fetched ${events.length} events`);
    res.json(events);
  } catch (error) {
    console.error('❌ Error fetching events:', error);
    res.status(500).json({ message: error.message });
  }
};

// Create a new event
export const createEvent = async (req, res) => {
  try {
    console.log('Received event data:', req.body);
    
    // Get data from request body
    const { title, date, time, location, attendees, image } = req.body;
    
    // Validate required fields
    if (!title || !date || !time || !location) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }
    
    // Create and save the event
    const event = await Event.create({
      title,
      date,
      time,
      location,
      attendees: attendees || 0,
      image: image || '/Images/events/default.jpg'
    });
    
    res.status(201).json(event);
  } catch (error) {
    console.error('Error creating event:', error);
    res.status(500).json({ message: error.message });
  }
};