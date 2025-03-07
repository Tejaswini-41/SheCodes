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
    default: 'Full-time' 
  },
  experience: String,
  skills: [String],
  logo: String,
  category: { 
    type: String, 
    required: true 
  },
  description: String,
  url: String,
  salary: String,
  postedDate: { 
    type: Date, 
    default: Date.now 
  }
}, { timestamps: true });

// Add indexing for better search performance
jobSchema.index({ role: 'text', company: 'text', skills: 'text', description: 'text' });

const Job = mongoose.model('Job', jobSchema);
export default Job;