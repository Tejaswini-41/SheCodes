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
    
    const { title, date, time, location, attendees, image } = req.body;
    
    const event = new Event({
      title,
      date,
      time,
      location,
      attendees: Number(attendees) || 0,
      image: image || '/Images/events/default.jpg'
    });

    console.log('Created event object:', event);
    
    const createdEvent = await event.save();
    console.log('✅ Event saved to database:', createdEvent);
    res.status(201).json(createdEvent);
  } catch (error) {
    console.error('❌ Error in createEvent:', error);
    res.status(400).json({ message: error.message });
  }
};