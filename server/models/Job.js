import mongoose from 'mongoose';

const jobSchema = new mongoose.Schema({
  company: {
    type: String,
    required: true
  },
  role: {
    type: String,
    required: true
  },
  location: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['Full-time', 'Part-time', 'Contract', 'Freelance', 'Internship'],
    default: 'Full-time'
  },
  experience: {
    type: String,
    // enum: ['Entry Level', 'Mid Level', 'Senior Level'],
    default: 2
  },
  skills: {
    type: [String],
    default: []
  },
  logo: {
    type: String,
    default: ''
  },
  category: {
    type: String,
    default: 'General'
  },
  description: {
    type: String,
    required: true
  },
  applyLink: {
    type: String,
    required: true
  },
  source: {
    type: String,
    default: 'manual'
  },
  postedDate: {
    type: Date,
    default: Date.now
  }
});

const Job = mongoose.model('Job', jobSchema);

export default Job;