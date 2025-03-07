import mongoose from 'mongoose';

const mentorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  role: {
    type: String,
    required: true
  },
  company: {
    type: String,
    required: true
  },
  expertise: {
    type: [String],
    required: true
  },
  availability: {
    type: String,
    required: true
  },
  linkedinUrl: {
    type: String,
    default: 'https://www.linkedin.com/in/'
  },
  avatar: {
    type: String,
    default: 'https://cdn.prod.website-files.com/5ce11396d0cadb67eb2cac0e/621e3dddf8077a0ce7a409ba_Professional%20mentor.pngg'
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  }
}, {
  timestamps: true
});

const Mentor = mongoose.model('Mentor', mentorSchema);
export default Mentor;