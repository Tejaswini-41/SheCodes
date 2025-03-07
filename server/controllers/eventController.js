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

// Delete an event
export const deleteEvent = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Check if ID is valid before attempting to find
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ message: 'Invalid event ID format' });
    }
    
    // Use findByIdAndDelete instead of event.remove()
    const deletedEvent = await Event.findByIdAndDelete(id);
    
    if (!deletedEvent) {
      return res.status(404).json({ message: 'Event not found' });
    }
    
    return res.status(200).json({ 
      message: 'Event removed successfully', 
      id 
    });
  } catch (error) {
    console.error('Error deleting event:', error);
    return res.status(500).json({ 
      message: 'Server error', 
      error: error.message 
    });
  }
};

// Update an event
export const updateEvent = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Validate ID format
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ message: 'Invalid event ID format' });
    }
    
    const { title, date, time, location, attendees, image } = req.body;
    
    // Check if event exists
    const eventExists = await Event.findById(id);
    if (!eventExists) {
      return res.status(404).json({ message: 'Event not found' });
    }
    
    // Build update object with only the fields that are provided
    const updateData = {};
    if (title !== undefined) updateData.title = title;
    if (date !== undefined) updateData.date = date;
    if (time !== undefined) updateData.time = time;
    if (location !== undefined) updateData.location = location;
    if (attendees !== undefined) updateData.attendees = attendees;
    if (image !== undefined) updateData.image = image;
    
    // Update the event
    const updatedEvent = await Event.findByIdAndUpdate(
      id,
      updateData,
      { new: true } // Return the updated document
    );
    
    return res.status(200).json(updatedEvent);
  } catch (error) {
    console.error('Error updating event:', error);
    return res.status(500).json({ 
      message: 'Server error while updating event', 
      error: error.message 
    });
  }
};