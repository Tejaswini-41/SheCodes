import Job from '../models/Job.js';
import axios from 'axios';

// Get all jobs with filtering
export const getJobs = async (req, res) => {
  try {
    // Debug incoming request
    console.log('GET /api/jobs request received');
    console.log('Query params:', req.query);
    
    const { category, search, type, limit = 10, page = 1 } = req.query;
    
    // Build filter object properly
    const filter = {};
    
    if (category && category !== 'all') {
      // Make sure you're using the right field name that matches your schema
      filter.category = category;
      console.log(`Filtering by category: ${category}`);
    }
    
    if (search && search.trim() !== '') {
      // Use text search if you have text index, otherwise use regex for basic search
      if (search.length >= 3) { // Only search for terms with 3+ characters
        filter.$or = [
          { role: { $regex: search, $options: 'i' } },
          { company: { $regex: search, $options: 'i' } },
          { description: { $regex: search, $options: 'i' } }
        ];
        
        // If you have skills as an array, search there too
        // This needs special handling since skills is an array
        filter.$or.push({ skills: { $in: [new RegExp(search, 'i')] } });
        
        console.log(`Searching for: ${search}`);
      }
    }
    
    console.log('Final filter:', JSON.stringify(filter, null, 2));
    
    // Execute query with pagination
    const jobs = await Job.find(filter)
      .sort({ postedDate: -1 })
      .skip((parseInt(page) - 1) * parseInt(limit))
      .limit(parseInt(limit));
    
    console.log(`Found ${jobs.length} matching jobs`);
    
    const total = await Job.countDocuments(filter);
    
    return res.status(200).json({
      jobs,
      totalJobs: total,
      currentPage: parseInt(page),
      totalPages: Math.ceil(total / parseInt(limit)),
      filters: { category, search } // Return the applied filters
    });
  } catch (error) {
    console.error('Error in getJobs controller:', error);
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Create new job
export const createJob = async (req, res) => {
  try {
    console.log('Creating job with data:', req.body);
    
    // Ensure all required fields are present and add defaults if needed
    const jobData = {
      ...req.body,
      // Add a default applyLink if not provided
      applyLink: req.body.applyLink || `https://careers.example.com/${req.body.company}`,
    };
    
    // Convert string skills to array if needed
    if (typeof jobData.skills === 'string') {
      jobData.skills = jobData.skills.split(',').map(skill => skill.trim());
    }
    
    // Create the job
    const job = await Job.create(jobData);
    
    console.log('Job created successfully:', job);
    
    res.status(201).json({
      success: true,
      job,
      message: 'Job created successfully'
    });
  } catch (error) {
    console.error('Error creating job:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error', 
      error: error.message 
    });
  }
};

// Update job
export const updateJob = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    
    const updatedJob = await Job.findByIdAndUpdate(
      id,
      { ...updates },
      { new: true }
    );
    
    if (!updatedJob) {
      return res.status(404).json({ message: 'Job not found' });
    }
    
    return res.status(200).json(updatedJob);
  } catch (error) {
    console.error('Error updating job:', error);
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Delete job
export const deleteJob = async (req, res) => {
  try {
    const { id } = req.params;
    
    const deletedJob = await Job.findByIdAndDelete(id);
    
    if (!deletedJob) {
      return res.status(404).json({ message: 'Job not found' });
    }
    
    return res.status(200).json({ message: 'Job deleted successfully', id });
  } catch (error) {
    console.error('Error deleting job:', error);
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update the fetchJobsFromAPI function
export const fetchJobsFromAPI = async (req, res) => {
  try {
    console.log('Fetching jobs from external API');
    
    try {
      // Try to fetch from Adzuna API
      const response = await axios.get('https://api.adzuna.com/v1/api/jobs/gb/search/1', {
        params: {
          app_id: process.env.ADZUNA_APP_ID,
          app_key: process.env.ADZUNA_API_KEY,
          results_per_page: 20,
          what: 'software',
          what_or: 'developer engineer programmer',
          title_only: 'software developer'
        }
      });
      
      console.log(`Fetched ${response.data.results.length} jobs from API`);
      
      // Transform the data
      const jobs = response.data.results.map(job => ({
        company: job.company.display_name,
        role: job.title,
        location: job.location.display_name,
        type: job.contract_time || 'Full-time',
        experience: determineExperience(job.title, job.description),
        skills: extractSkills(job.description),
        logo: job.company.logo_url || defaultLogoForCompany(job.company.display_name),
        category: categorizeJob(job.title),
        description: job.description,
        applyLink: job.redirect_url,
        source: 'adzuna',
        postedDate: new Date(job.created)
      }));
      
      // Save to database
      const savedJobs = await Job.insertMany(jobs);
      console.log(`Saved ${savedJobs.length} jobs to database`);
      
      return res.status(200).json({
        success: true,
        count: savedJobs.length,
        message: `Successfully imported ${savedJobs.length} jobs from Adzuna API`
      });
    } catch (apiError) {
      console.error('Error fetching external jobs:', apiError);
      
      // If API fails, use fallback data
      return await seedTestJobs(req, res);
    }
  } catch (error) {
    console.error('Error in fetchJobsFromAPI:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// Add a solid seedTestJobs function that doesn't depend on external API
export const seedTestJobs = async (req, res) => {
  try {
    console.log('Adding test jobs to database');
    
    // Create an array of test jobs
    const testJobs = [
      {
        company: 'TechCorp',
        role: 'Frontend Developer',
        location: 'Bangalore, India',
        type: 'Full-time',
        experience: 'Entry Level',
        skills: ['JavaScript', 'React', 'CSS'],
        logo: 'https://logo.clearbit.com/techcorp.com',
        category: 'Frontend',
        description: 'We are looking for a frontend developer with experience in React to join our team.',
        applyLink: 'https://example.com/jobs/frontend-dev',
        source: 'test-data',
        postedDate: new Date()
      },
      {
        company: 'InnovateSoft',
        role: 'Backend Developer',
        location: 'Delhi, India',
        type: 'Full-time',
        experience: 'Mid Level',
        skills: ['Node.js', 'Express', 'MongoDB'],
        logo: 'https://logo.clearbit.com/innovatesoft.com',
        category: 'Backend',
        description: 'Backend developer with Node.js and database experience needed for our growing team.',
        applyLink: 'https://example.com/jobs/backend-dev',
        source: 'test-data',
        postedDate: new Date()
      },
      {
        company: 'DataSystems',
        role: 'Data Scientist',
        location: 'Mumbai, India',
        type: 'Full-time',
        experience: 'Senior Level',
        skills: ['Python', 'TensorFlow', 'Data Analysis'],
        logo: 'https://logo.clearbit.com/datasystems.com',
        category: 'Data Science',
        description: 'Looking for an experienced data scientist to lead our machine learning initiatives.',
        applyLink: 'https://example.com/jobs/data-scientist',
        source: 'test-data',
        postedDate: new Date()
      },
      {
        company: 'WebWorks',
        role: 'UI/UX Designer',
        location: 'Hyderabad, India',
        type: 'Contract',
        experience: 'Mid Level',
        skills: ['Figma', 'Adobe XD', 'UI Design'],
        logo: 'https://logo.clearbit.com/webworks.com',
        category: 'Design',
        description: 'UI/UX designer needed for a 6-month contract to redesign our product interface.',
        applyLink: 'https://example.com/jobs/ui-designer',
        source: 'test-data',
        postedDate: new Date()
      },
      {
        company: 'CloudNative',
        role: 'DevOps Engineer',
        location: 'Pune, India',
        type: 'Full-time',
        experience: 'Senior Level',
        skills: ['AWS', 'Docker', 'Kubernetes'],
        logo: 'https://logo.clearbit.com/cloudnative.com',
        category: 'DevOps',
        description: 'DevOps engineer with cloud infrastructure experience needed for our growing operations team.',
        applyLink: 'https://example.com/jobs/devops-engineer',
        source: 'test-data',
        postedDate: new Date()
      }
    ];
    
    // Check if jobs with these companies and roles already exist
    for (const job of testJobs) {
      const exists = await Job.findOne({ 
        company: job.company, 
        role: job.role 
      });
      
      if (!exists) {
        await Job.create(job);
      }
    }
    
    const count = testJobs.length;
    console.log(`Added ${count} test jobs to database`);
    
    return res.status(201).json({
      success: true,
      count,
      message: `Successfully added ${count} test jobs to database`
    });
  } catch (error) {
    console.error('Error creating test jobs:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// Add these helper functions for processing job data

// Extract skills from job description
function extractSkills(description) {
  const skillKeywords = [
    'JavaScript', 'React', 'Angular', 'Vue', 'Node.js', 'Express', 
    'Python', 'Django', 'Flask', 'Java', 'Spring', 'PHP', 'Laravel', 
    'Ruby', 'Rails', 'C#', '.NET', 'SQL', 'MongoDB', 'PostgreSQL', 
    'MySQL', 'AWS', 'Azure', 'GCP', 'Docker', 'Kubernetes', 
    'DevOps', 'CI/CD', 'Git', 'Agile', 'Scrum', 'UI/UX', 'Figma'
  ];
  
  if (!description) return ['General Skills'];
  
  const foundSkills = skillKeywords.filter(skill => 
    description.toLowerCase().includes(skill.toLowerCase())
  );
  
  return foundSkills.length > 0 ? foundSkills : ['General Skills'];
}

// Determine experience level from job title/description
function determineExperience(title, description) {
  const titleAndDesc = (title + ' ' + description).toLowerCase();
  
  if (titleAndDesc.includes('senior') || 
      titleAndDesc.includes('lead') || 
      titleAndDesc.includes('architect') || 
      titleAndDesc.includes('principal')) {
    return 'Senior Level';
  } else if (titleAndDesc.includes('junior') || 
             titleAndDesc.includes('entry') || 
             titleAndDesc.includes('graduate') || 
             titleAndDesc.includes('intern')) {
    return 'Entry Level';
  } else {
    return 'Mid Level';
  }
}

// Categorize job based on title
function categorizeJob(title) {
  const lowerTitle = title.toLowerCase();
  
  if (lowerTitle.includes('front') || lowerTitle.includes('ui') || lowerTitle.includes('react')) {
    return 'Frontend';
  } else if (lowerTitle.includes('back') || lowerTitle.includes('server') || lowerTitle.includes('api')) {
    return 'Backend';
  } else if (lowerTitle.includes('full') || lowerTitle.includes('stack')) {
    return 'Fullstack';
  } else if (lowerTitle.includes('data') || lowerTitle.includes('ml') || lowerTitle.includes('ai')) {
    return 'Data Science';
  } else if (lowerTitle.includes('devops') || lowerTitle.includes('cloud')) {
    return 'DevOps';
  } else if (lowerTitle.includes('mobile') || lowerTitle.includes('android') || lowerTitle.includes('ios')) {
    return 'Mobile';
  } else {
    return 'Other';
  }
}

// Generate a default logo based on company name
function defaultLogoForCompany(company) {
  // Use the first letter of company name for a default logo
  const firstLetter = company.charAt(0).toUpperCase();
  const logoColors = {
    A: '#FF5733', B: '#33FF57', C: '#5733FF', D: '#33A2FF',
    E: '#FF33A2', F: '#A2FF33', G: '#FF5733', H: '#33FF57',
    I: '#5733FF', J: '#33A2FF', K: '#FF33A2', L: '#A2FF33',
    M: '#FF5733', N: '#33FF57', O: '#5733FF', P: '#33A2FF',
    Q: '#FF33A2', R: '#A2FF33', S: '#FF5733', T: '#33FF57',
    U: '#5733FF', V: '#33A2FF', W: '#FF33A2', X: '#A2FF33',
    Y: '#FF5733', Z: '#33FF57'
  };
  
  const color = logoColors[firstLetter] || '#007BFF';
  
  // Return a default image URL or a placeholder
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(company)}&background=${color.replace('#', '')}&color=fff`;
}