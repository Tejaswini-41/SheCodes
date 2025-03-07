import mongoose from 'mongoose';

const eventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  date: {
    type: String,
    required: true
  },
  time: {
    type: String,
    required: true
  },
  location: {
    type: String,
    required: true
  },
  attendees: {
    type: Number,
    default: 0
  },
  image: {
    type: String,
    default: '/Images/events/default.jpg'
  }
}, {
  timestamps: true
});

const Event = mongoose.model('Event', eventSchema);
export default Event;