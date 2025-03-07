import axios from 'axios';
import Job from '../models/Job.js';

// Fetch jobs from Adzuna API
export const fetchJobsFromAPI = async () => {
  try {
    const response = await axios.get('https://api.adzuna.com/v1/api/jobs/in/search/1', {
      params: {
        app_id: process.env.ADZUNA_APP_ID,
        app_key: process.env.ADZUNA_API_KEY,
        results_per_page: 20,
        what: 'software developer',
        what_or: 'software engineer programmer developer designer',
        category: 'it-jobs'
      }
    });
    
    // Transform the data to match your schema
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
      source: 'api',
      postedDate: new Date(job.created)
    }));
    
    // Save to database (only new jobs that don't exist)
    for (const job of jobs) {
      // Check if similar job exists by company and role
      const exists = await Job.findOne({ 
        company: job.company,
        role: job.role,
        // Only consider jobs from the last 30 days
        postedDate: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) }
      });
      
      if (!exists) {
        await Job.create(job);
      }
    }
    
    console.log(`Successfully fetched and processed ${jobs.length} jobs`);
    return jobs;
  } catch (error) {
    console.error('Error fetching jobs:', error);
    throw error;
  }
};

// Helper function to determine experience level from job description
function determineExperience(title, description) {
  const text = (title + ' ' + description).toLowerCase();
  
  if (text.includes('senior') || text.includes('sr.') || text.includes('lead')) {
    return '5+ years';
  } else if (text.includes('mid') || text.includes('intermediate')) {
    return '2-5 years';
  } else if (text.includes('junior') || text.includes('entry') || text.includes('graduate')) {
    return '0-2 years';
  }
  
  return '1-3 years'; // Default
}

// Helper function to extract skills from job description
function extractSkills(description) {
  const commonSkills = [
    'javascript', 'python', 'react', 'node', 'angular', 'vue', 'java', 'c#', 
    'aws', 'azure', 'gcp', 'devops', 'docker', 'kubernetes', 'figma', 'sketch', 
    'ui/ux', 'typescript', 'sql', 'nosql', 'mongodb', 'css', 'html', 'git'
  ];
  
  const skills = [];
  const desc = description.toLowerCase();
  
  commonSkills.forEach(skill => {
    if (desc.includes(skill)) {
      // Capitalize first letter
      skills.push(skill.charAt(0).toUpperCase() + skill.slice(1));
    }
  });
  
  return skills.slice(0, 5); // Return top 5 skills
}

// Helper function to categorize job
function categorizeJob(title) {
  const t = title.toLowerCase();
  
  if (t.includes('designer') || t.includes('design') || t.includes('ux') || t.includes('ui')) {
    return 'design';
  } else if (t.includes('manager') || t.includes('director') || t.includes('lead')) {
    return 'management';
  } else if (t.includes('developer') || t.includes('engineer') || t.includes('programmer')) {
    return 'engineering';
  }
  
  return 'other';
}

// Helper function to provide a default logo based on company name
function defaultLogoForCompany(company) {
  const knownCompanies = {
    'Google': 'https://logos-world.net/wp-content/uploads/2020/09/Google-Logo-2010-2013.jpg',
    'Microsoft': 'https://logos-world.net/wp-content/uploads/2020/09/Microsoft-Logo-2012-present.jpg',
    'Amazon': 'https://logos-world.net/wp-content/uploads/2020/04/Amazon-Logo.png',
    'Apple': 'https://logos-world.net/wp-content/uploads/2020/04/Apple-Logo.png',
    'Meta': 'https://1000logos.net/wp-content/uploads/2021/10/Meta-Logo.png'
  };
  
  // Check for company name containing any of the known companies
  for (const [knownCompany, logo] of Object.entries(knownCompanies)) {
    if (company.toLowerCase().includes(knownCompany.toLowerCase())) {
      return logo;
    }
  }
  
  // Default placeholder logo
  return 'https://via.placeholder.com/100x100?text=' + company.charAt(0);
}