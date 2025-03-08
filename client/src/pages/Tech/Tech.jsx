import React, { useState, useEffect, useContext } from 'react';
import { apiRequest, API_ENDPOINTS } from '../../utils/apiUtils';
import { AuthContext } from '../../context/AuthContext';
import Navbar from '../../components/Navbar/Navbar';
import Footer from '../../components/Footer/Footer';
import './Tech.css';

const Tech = () => {
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useContext(AuthContext);
  
  // Track all active filters
  const [filters, setFilters] = useState({
    category: 'all',
    type: 'all',
    experience: 'all',
    search: ''
  });
  
  // Track all available categories and job types
  const [availableCategories, setAvailableCategories] = useState([]);
  const [availableTypes, setAvailableTypes] = useState([]);
  
  // Initialize standardized category mapping
  const categoryMapping = {
    // Map external API categories to standardized categories
    'frontend': 'engineering',
    'backend': 'engineering',
    'fullstack': 'engineering',
    'data science': 'data',
    'devops': 'engineering',
    'mobile': 'engineering',
    // Keep manual categories as is
    'engineering': 'engineering',
    'design': 'design',
    'product': 'product',
    'data': 'data',
    'management': 'management',
    'other': 'other'
  };
  
  // Define display names for categories
  const categoryDisplayNames = {
    'engineering': 'Engineering',
    'design': 'Design',
    'product': 'Product',
    'data': 'Data Science',
    'management': 'Management',
    'other': 'Other'
  };

  // Fetch jobs from API
  useEffect(() => {
    fetchJobs();
  }, []);
  
  // Apply filters whenever jobs or filters change
  useEffect(() => {
    if (jobs.length) {
      applyFilters();
    }
  }, [jobs, filters]);
  
  // Extract available categories and types from jobs
  useEffect(() => {
    if (jobs.length) {
      extractAvailableOptions();
    }
  }, [jobs]);
  
  const fetchJobs = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await apiRequest('get', API_ENDPOINTS.JOBS);
      console.log('Jobs response:', response);
      
      if (response && response.jobs) {
        // Standardize categories for all jobs
        const standardizedJobs = response.jobs.map(job => ({
          ...job,
          // Map category to standardized format or default to 'other'
          displayCategory: job.category ? 
            (categoryMapping[job.category.toLowerCase()] || 'other') : 'other'
        }));
        
        setJobs(standardizedJobs);
        setFilteredJobs(standardizedJobs);
        console.log('Jobs loaded:', standardizedJobs.length);
      } else {
        setError('No jobs available at this time.');
        setJobs([]);
        setFilteredJobs([]);
      }
    } catch (err) {
      console.error('Error fetching jobs:', err);
      setError('Failed to load job listings. Please try again later.');
      setJobs([]);
      setFilteredJobs([]);
    } finally {
      setLoading(false);
    }
  };
  
  const extractAvailableOptions = () => {
    // Extract unique categories from jobs
    const categories = [...new Set(jobs.map(job => 
      job.displayCategory || 'other'
    ))].sort();
    
    // Extract unique job types
    const types = [...new Set(jobs.map(job => job.type || 'Full-time'))].sort();
    
    setAvailableCategories(categories);
    setAvailableTypes(types);
    
    console.log('Available categories:', categories);
    console.log('Available types:', types);
  };
  
  const applyFilters = () => {
    let result = [...jobs];
    
    // Filter by category
    if (filters.category !== 'all') {
      result = result.filter(job => 
        (job.displayCategory || 'other').toLowerCase() === filters.category.toLowerCase()
      );
    }
    
    // Filter by job type
    if (filters.type !== 'all') {
      result = result.filter(job => 
        (job.type || 'Full-time').toLowerCase() === filters.type.toLowerCase()
      );
    }
    
    // Filter by experience
    if (filters.experience !== 'all') {
      result = result.filter(job => {
        // Handle both string and numeric experience
        const jobExp = job.experience || '';
        
        if (filters.experience === 'entry') {
          return String(jobExp).toLowerCase().includes('entry') || 
                 String(jobExp).toLowerCase().includes('junior') ||
                 (Number(jobExp) <= 2);
        } else if (filters.experience === 'mid') {
          return String(jobExp).toLowerCase().includes('mid') ||
                 (Number(jobExp) > 2 && Number(jobExp) <= 5);
        } else if (filters.experience === 'senior') {
          return String(jobExp).toLowerCase().includes('senior') ||
                 (Number(jobExp) > 5);
        }
        return true;
      });
    }
    
    // Filter by search term
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      result = result.filter(job => 
        job.company?.toLowerCase().includes(searchTerm) ||
        job.role?.toLowerCase().includes(searchTerm) ||
        job.description?.toLowerCase().includes(searchTerm) ||
        job.location?.toLowerCase().includes(searchTerm) ||
        (Array.isArray(job.skills) && job.skills.some(skill => 
          skill.toLowerCase().includes(searchTerm)
        ))
      );
    }
    
    setFilteredJobs(result);
  };
  
  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };
  
  const handleSearchChange = (e) => {
    setFilters(prev => ({
      ...prev,
      search: e.target.value
    }));
  };

  return (
    <div className="tech-page">
      <Navbar />
      
      <div className="tech-container">
        <div className="tech-header">
          <h1>Tech Jobs</h1>
          <p>Find your dream tech role in companies that value diversity</p>
        </div>
        
        <div className="filters-container">
          <div className="search-container">
            <input
              type="text"
              placeholder="Search jobs, companies, or skills"
              value={filters.search}
              onChange={handleSearchChange}
            />
          </div>
          
          <div className="filter-options">
            <div className="filter-group">
              <label>Category</label>
              <select 
                value={filters.category} 
                onChange={(e) => handleFilterChange('category', e.target.value)}
              >
                <option value="all">All Categories</option>
                {availableCategories.map(category => (
                  <option key={category} value={category}>
                    {categoryDisplayNames[category] || category}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="filter-group">
              <label>Job Type</label>
              <select 
                value={filters.type} 
                onChange={(e) => handleFilterChange('type', e.target.value)}
              >
                <option value="all">All Types</option>
                {availableTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
            
            <div className="filter-group">
              <label>Experience</label>
              <select 
                value={filters.experience} 
                onChange={(e) => handleFilterChange('experience', e.target.value)}
              >
                <option value="all">All Levels</option>
                <option value="entry">Entry Level</option>
                <option value="mid">Mid Level</option>
                <option value="senior">Senior Level</option>
              </select>
            </div>
          </div>
        </div>
        
        {loading ? (
          <div className="loading-spinner">Loading jobs...</div>
        ) : error ? (
          <div className="error-message">{error}</div>
        ) : filteredJobs.length === 0 ? (
          <div className="no-jobs-message">
            <h3>No jobs found matching your filters</h3>
            <p>Try adjusting your search criteria or check back later for new opportunities.</p>
          </div>
        ) : (
          <div className="jobs-grid">
            {filteredJobs.map(job => (
              <div key={job._id} className="job-card">
                <div className="job-header">
                  <div className="company-logo">
                    <img 
                      src={job.logo || `https://ui-avatars.com/api/?name=${encodeURIComponent(job.company)}&background=random`} 
                      alt={job.company} 
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(job.company)}&background=random`;
                      }}
                    />
                  </div>
                  <div className="job-title-container">
                    <h3 className="job-title">{job.role}</h3>
                    <p className="company-name">{job.company}</p>
                  </div>
                </div>
                
                <div className="job-details">
                  <div className="job-tag location">
                    <i className="fas fa-map-marker-alt"></i>
                    {job.location}
                  </div>
                  <div className="job-tag job-type">
                    <i className="fas fa-briefcase"></i>
                    {job.type || 'Full-time'}
                  </div>
                  <div className="job-tag experience">
                    <i className="fas fa-user-clock"></i>
                    {typeof job.experience === 'number' ? 
                      `${job.experience}+ years` : job.experience || 'Not specified'}
                  </div>
                </div>
                
                <div className="job-skills">
                  {Array.isArray(job.skills) ? job.skills.slice(0, 4).map((skill, index) => (
                    <span key={index} className="skill-tag">{skill}</span>
                  )) : (
                    <span className="skill-tag">General Skills</span>
                  )}
                  {Array.isArray(job.skills) && job.skills.length > 4 && (
                    <span className="skill-tag more">+{job.skills.length - 4}</span>
                  )}
                </div>
                
                <div className="job-description">
                  {job.description?.substring(0, 150)}
                  {job.description?.length > 150 ? '...' : ''}
                </div>
                
                <div className="job-actions">
                  <a 
                    href={job.applyLink} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="apply-btn"
                  >
                    Apply Now
                  </a>
                  <button className="save-job-btn">
                    <i className="far fa-bookmark"></i>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      
      <Footer />
    </div>
  );
};

export default Tech;