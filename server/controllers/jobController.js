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
    const jobData = req.body;
    
    // Create new job
    const job = new Job({
      ...jobData,
      postedDate: new Date()
    });
    
    // Save to database
    const savedJob = await job.save();
    return res.status(201).json(savedJob);
  } catch (error) {
    console.error('Error creating job:', error);
    return res.status(500).json({ message: 'Server error', error: error.message });
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

// Fetch jobs from external API
export const fetchJobsFromAPI = async (req, res) => {
  try {
    // Example using the Adzuna API (requires registration for API key)
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
    
    // Transform the data to match your schema
    const jobs = response.data.results.map(job => ({
      company: job.company.display_name,
      role: job.title,
      location: job.location.display_name,
      type: job.contract_time || 'Full-time',
      experience: 'Not specified',
      skills: job.category.label.split(','),
      logo: job.company.logo_url || '/default-company-logo.png',
      category: job.category.tag,
      description: job.description,
      url: job.redirect_url,
      salary: job.salary_min ? `${job.salary_min}-${job.salary_max}` : 'Not specified',
      postedDate: new Date(job.created)
    }));
    
    // Save to database
    await Job.insertMany(jobs);
    
    return res.status(200).json({ 
      message: `Successfully fetched and stored ${jobs.length} jobs`,
      count: jobs.length
    });
  } catch (error) {
    console.error('Error fetching external jobs:', error);
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const seedTestJobs = async (req, res) => {
  try {
    // First clear existing jobs (optional)
    await Job.deleteMany({});
    
    const testJobs = [
      {
        company: "TechStar",
        role: "Frontend Developer",
        location: "Remote",
        type: "Full-time",
        experience: "2-3 years",
        skills: ["React", "JavaScript", "CSS"],
        category: "engineering",
        description: "Looking for a talented frontend developer experienced in React, modern JavaScript and responsive designs. You'll work on our customer-facing applications and collaborate with our design and backend teams.",
        url: "https://www.linkedin.com/jobs/view/frontend-developer-at-techstar-systems-3737224529",
        salary: "₹12L-₹18L",
        postedDate: new Date()
      },
      {
        company: "DesignHub",
        role: "UI/UX Designer",
        location: "Bangalore",
        type: "Full-time",
        experience: "3+ years",
        skills: ["Figma", "Adobe XD", "User Research"],
        category: "design",
        description: "Join our creative design team to create intuitive and engaging user experiences. You'll conduct user research, create wireframes, prototypes, and collaborate closely with our development team to bring designs to life.",
        url: "https://www.naukri.com/ui-ux-designer-jobs-in-bangalore",
        salary: "₹10L-₹15L",
        postedDate: new Date()
      },
      {
        company: "DataWorks",
        role: "Data Analyst",
        location: "Hyderabad",
        type: "Full-time",
        experience: "1-3 years",
        skills: ["SQL", "Excel", "Power BI"],
        category: "data",
        description: "We're looking for a detail-oriented data analyst to join our analytics team. You'll help extract insights from customer data, create dashboards, and present findings to stakeholders to drive business decisions.",
        url: "https://www.indeed.co.in/jobs?q=data+analyst&l=Hyderabad",
        salary: "₹6L-₹9L",
        postedDate: new Date(Date.now() - 5*24*60*60*1000) // 5 days ago
      },
      {
        company: "ProductGenius",
        role: "Product Manager",
        location: "Mumbai",
        type: "Full-time",
        experience: "4+ years",
        skills: ["Product Strategy", "Agile", "User Stories"],
        category: "product",
        description: "Lead the development of our flagship SaaS product. You'll work with cross-functional teams to define product vision, create roadmaps, and ensure successful delivery of high-value features that solve real customer problems.",
        url: "https://www.instahyre.com/search-jobs/product%20manager/mumbai/",
        salary: "₹18L-₹25L",
        postedDate: new Date(Date.now() - 2*24*60*60*1000) // 2 days ago
      },
      {
        company: "Infosys",
        role: "Backend Developer",
        location: "Pune",
        type: "Full-time",
        experience: "3-5 years",
        skills: ["Java", "Spring Boot", "Microservices"],
        category: "engineering",
        description: "Join our team to design and implement robust backend services using Java and Spring Boot. You'll work on scalable, high-performance systems that power our enterprise solutions.",
        url: "https://career.infosys.com/jobdesc?jobReferance=IN_PR_JR_002",
        salary: "₹10L-₹16L",
        postedDate: new Date(Date.now() - 7*24*60*60*1000) // 7 days ago
      },
      {
        company: "Microsoft India",
        role: "Cloud Solutions Architect",
        location: "Bangalore",
        type: "Full-time",
        experience: "5+ years",
        skills: ["Azure", "Cloud Architecture", "Solution Design"],
        category: "engineering",
        description: "As a Cloud Solutions Architect, you'll help our enterprise customers design and implement cloud solutions using Microsoft Azure. You'll need strong technical skills and the ability to translate business requirements into architecture.",
        url: "https://careers.microsoft.com/professionals/us/en/india-jobs",
        salary: "₹25L-₹40L",
        postedDate: new Date(Date.now() - 3*24*60*60*1000) // 3 days ago
      },
      {
        company: "Wipro",
        role: "DevOps Engineer",
        location: "Chennai",
        type: "Full-time",
        experience: "2-4 years",
        skills: ["Jenkins", "Docker", "Kubernetes", "AWS"],
        category: "engineering",
        description: "We're looking for a DevOps engineer to help automate our deployment pipelines and manage our cloud infrastructure. You'll work with development and operations teams to improve our CI/CD processes.",
        url: "https://careers.wipro.com/careers-home/",
        salary: "₹8L-₹14L",
        postedDate: new Date(Date.now() - 10*24*60*60*1000) // 10 days ago
      },
      {
        company: "Amazon India",
        role: "Data Scientist",
        location: "Hyderabad",
        type: "Full-time",
        experience: "3+ years",
        skills: ["Python", "Machine Learning", "SQL", "AWS"],
        category: "data",
        description: "Join Amazon's data science team to build predictive models and machine learning solutions that improve customer experience. You'll work with large datasets and collaborate with business and engineering teams.",
        url: "https://www.amazon.jobs/en/search?base_query=data+scientist&loc_query=India",
        salary: "₹15L-₹25L",
        postedDate: new Date()
      }
    ];
    
    await Job.insertMany(testJobs);
    
    return res.status(200).json({
      message: `Successfully added ${testJobs.length} test jobs`,
      count: testJobs.length
    });
  } catch (error) {
    console.error('Error adding test jobs:', error);
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};