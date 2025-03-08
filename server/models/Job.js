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
    type: mongoose.Schema.Types.Mixed, // Accept both string and number
    default: '2'
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
    required: function() {
      // Only require applyLink for manual entries
      return this.source === 'manual';
    },
    default: function() {
      // Generate a default link based on company name
      return this.company ? 
        `https://careers.example.com/${this.company.toLowerCase().replace(/\s+/g, '-')}` : 
        'https://example.com/apply';
    }
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