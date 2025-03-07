import axios from 'axios';
import Job from '../models/Job.js';

class JobAPIService {
  constructor() {
    this.apiKey = process.env.JOB_API_KEY;
    this.apiId = process.env.JOB_API_ID;
  }
  
  async fetchJobs() {
    try {
      // Example using Adzuna API
      const response = await axios.get('https://api.adzuna.com/v1/api/jobs/in/search/1', {
        params: {
          app_id: this.apiId,
          app_key: this.apiKey,
          results_per_page: 50,
          what: 'software developer',
          what_or: 'engineer programmer developer designer',
          category: 'it-jobs'
        }
      });
      
      if (!response.data || !response.data.results) {
        throw new Error('Invalid API response');
      }
      
      // Transform API data to match our schema
      const jobsData = response.data.results.map(job => ({
        company: job.company.display_name,
        role: job.title,
        location: job.location.display_name,
        type: this.determineJobType(job.contract_time),
        experience: this.determineExperience(job.title),
        skills: this.extractSkills(job.description),
        logo: job.company_logo_url || this.generateLogoPlaceholder(job.company.display_name),
        category: this.determineCategory(job.title, job.description),
        description: job.description,
        applyLink: job.redirect_url,
        salary: job.salary_is_predicted === 1 ? 'Competitive' : `${job.salary_min}-${job.salary_max}`,
        featured: false,
        source: 'api',
        postedDate: new Date(job.created),
        expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days from now
      }));
      
      // Save to database - only insert new jobs that don't exist
      for (const jobData of jobsData) {
        await Job.findOneAndUpdate(
          { 
            company: jobData.company,
            role: jobData.role,
            source: 'api',
            // Use a fuzzy match on role and company to avoid duplicates
            $or: [
              { applyLink: jobData.applyLink },
              { 
                role: { $regex: this.escapeRegex(jobData.role), $options: 'i' },
                company: { $regex: this.escapeRegex(jobData.company), $options: 'i' }
              }
            ]
          },
          jobData,
          { upsert: true, new: true }
        );
      }
      
      console.log(`Processed ${jobsData.length} jobs from API`);
      return jobsData;
    } catch (error) {
      console.error('API service error:', error);
      throw error;
    }
  }
  
  // Helper methods
  determineJobType(contractTime) {
    if (!contractTime) return 'Full-time';
    return contractTime === 'part_time' ? 'Part-time' : 'Full-time';
  }
  
  determineExperience(title) {
    const lowerTitle = title.toLowerCase();
    if (lowerTitle.includes('senior') || lowerTitle.includes('lead')) {
      return '3+ years';
    } else if (lowerTitle.includes('mid') || lowerTitle.includes('intermediate')) {
      return '1-3 years';
    } else if (lowerTitle.includes('junior') || lowerTitle.includes('entry')) {
      return 'Entry Level';
    }
    return 'Not specified';
  }
  
  extractSkills(description) {
    const skills = [];
    const techSkills = [
      'JavaScript', 'React', 'Angular', 'Vue', 'Node.js', 'Python', 
      'Java', 'Ruby', 'C#', '.NET', 'PHP', 'HTML', 'CSS', 'TypeScript',
      'AWS', 'Azure', 'GCP', 'Docker', 'Kubernetes', 'SQL', 'MongoDB',
      'PostgreSQL', 'GraphQL', 'REST', 'Git', 'Figma', 'UX/UI'
    ];
    
    const descLower = description.toLowerCase();
    
    techSkills.forEach(skill => {
      if (descLower.includes(skill.toLowerCase())) {
        skills.push(skill);
      }
    });
    
    // Return up to 5 skills or default skills if none found
    return skills.length ? skills.slice(0, 5) : ['Software Development'];
  }
  
  determineCategory(title, description) {
    const text = (title + ' ' + description).toLowerCase();
    
    if (text.includes('design') || text.includes('ui') || text.includes('ux')) {
      return 'design';
    } else if (text.includes('product manager') || text.includes('product owner')) {
      return 'product';
    } else if (text.includes('marketing') || text.includes('content')) {
      return 'marketing';
    }
    
    return 'engineering';
  }
  
  generateLogoPlaceholder(company) {
    return `https://via.placeholder.com/100x100?text=${company.charAt(0)}`;
  }
  
  escapeRegex(string) {
    return string.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
  }
}

export default JobAPIService;