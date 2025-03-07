import React, { useState, useEffect } from 'react';
import { apiRequest, API_ENDPOINTS } from '../../utils/apiUtils';
import Navbar from '../../components/Navbar/Navbar';
import Footer from '../../components/Footer/Footer';
import './Tech.css';

const Tech = () => {
  // Initialize states properly
  const [jobListings, setJobListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');

  // Keep bootcamps and resources as static data
  const bootcamps = [
    // Your existing bootcamps data
  ];
  
  const resources = [
    // Your existing resources data
  ];

  // Update the useEffect hook for better debugging
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setLoading(true);
        
        // Build params object for clarity
        const params = {};
        
        if (activeCategory !== 'all') {
          params.category = activeCategory;
        }
        
        if (searchTerm && searchTerm.trim() !== '') {
          params.search = searchTerm.trim();
        }
        
        console.log('Fetching jobs with params:', params);
        
        const response = await apiRequest(
          'get',
          API_ENDPOINTS.JOBS,
          null, 
          null,  // Don't send auth token for public endpoint
          false, // Explicitly mark as not requiring auth
          {
            category: activeCategory !== 'all' ? activeCategory : undefined,
            search: searchTerm || undefined
          }
        );
        
        console.log('Full API response:', response);
        
        if (response && response.jobs) {
          console.log(`Received ${response.jobs.length} jobs from API`);
          console.log('Applied filters:', response.filters);
          setJobListings(response.jobs);
        } else {
          console.warn('API response missing jobs array:', response);
          setJobListings([]);
        }
        
      } catch (err) {
        console.error('Error fetching jobs:', err);
        setError('Failed to load job listings. Please try again.');
        setJobListings([]);
      } finally {
        setLoading(false);
      }
    };
    
    fetchJobs();
  }, [activeCategory, searchTerm]); // Dependencies remain the same

  // Track job application clicks
  const handleApplyClick = async (jobId) => {
    try {
      // Optional: Track job application analytics
      console.log(`User applied to job: ${jobId}`);
      
      // You could log this to your backend if needed
      // await apiRequest('post', `${API_ENDPOINTS.JOBS}/${jobId}/apply`, null);
    } catch (err) {
      console.error('Error tracking job application:', err);
    }
  };

  return (
    <div className="tech-container">
      <Navbar />
      <div className="tech-page">
        <div className="tech-hero">
          <h1>Tech Opportunities Hub</h1>
          <p>Discover jobs, bootcamps, and resources to advance your tech career</p>
        </div>

        <section className="jobs-section">
          <h2>Featured Tech Jobs</h2>
          
          {/* Add search functionality */}
          <div className="jobs-search-container">
            <div className="search-input-container">
              <i className="fas fa-search search-icon"></i>
              <input
                type="text"
                placeholder="Search for jobs, skills, or companies..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="job-search-input"
              />
              {searchTerm && (
                <button 
                  className="clear-search-btn"
                  onClick={() => setSearchTerm('')}
                  aria-label="Clear search"
                >
                  <i className="fas fa-times"></i>
                </button>
              )}
            </div>
          </div>
          
          <div className="job-filters">
            <button 
              className={`filter-btn ${activeCategory === 'all' ? 'active' : ''}`}
              onClick={() => setActiveCategory('all')}
            >
              All Roles
            </button>
            <button 
              className={`filter-btn ${activeCategory === 'engineering' ? 'active' : ''}`}
              onClick={() => setActiveCategory('engineering')}
            >
              Engineering
            </button>
            <button 
              className={`filter-btn ${activeCategory === 'design' ? 'active' : ''}`}
              onClick={() => setActiveCategory('design')}
            >
              Design
            </button>
            <button 
              className={`filter-btn ${activeCategory === 'data' ? 'active' : ''}`}
              onClick={() => setActiveCategory('data')}
            >
              Data
            </button>
            <button 
              className={`filter-btn ${activeCategory === 'product' ? 'active' : ''}`}
              onClick={() => setActiveCategory('product')}
            >
              Product
            </button>
          </div>

          {activeCategory !== 'all' && (
            <div className="active-filters">
              <div className="filter-tag">
                {activeCategory}
                <button 
                  onClick={() => setActiveCategory('all')} 
                  className="clear-filter"
                >
                  <i className="fas fa-times"></i>
                </button>
              </div>
            </div>
          )}

          {searchTerm && (
            <div className="active-filters">
              <div className="filter-tag">
                Search: {searchTerm}
                <button 
                  onClick={() => setSearchTerm('')} 
                  className="clear-filter"
                >
                  <i className="fas fa-times"></i>
                </button>
              </div>
            </div>
          )}

          {loading ? (
            <div className="loading-container">
              <div className="loading-spinner"></div>
              <p>Finding the best opportunities for you...</p>
            </div>
          ) : error ? (
            <div className="error-message">
              <i className="fas fa-exclamation-circle"></i>
              <p>{error}</p>
            </div>
          ) : jobListings.length === 0 ? (
            <div className="no-jobs-found">
              <i className="fas fa-search"></i>
              <h3>No job listings found</h3>
              <p>Try adjusting your search criteria</p>
            </div>
          ) : (
            <div className="jobs-grid">
              {jobListings.map((job) => (
                <div key={job._id} className="job-card">
                  <div className="job-header">
                    <img 
                      src={job.logo || '/images/default-company-logo.png'} 
                      alt={job.company} 
                      className="company-logo"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = '/images/default-company-logo.png';
                      }}
                    />
                    <span className="job-type">{job.type}</span>
                  </div>
                  <div className="job-content">
                    <h3>{job.role}</h3>
                    <p className="company-name">{job.company}</p>
                    <div className="job-details">
                      <span><i className="fas fa-map-marker-alt"></i> {job.location}</span>
                      <span><i className="fas fa-briefcase"></i> {job.experience || 'Not specified'}</span>
                    </div>
                    {job.salary && (
                      <div className="job-salary">
                        <i className="fas fa-money-bill-wave"></i> {job.salary}
                      </div>
                    )}
                    <div className="skills-list">
                      {job.skills && job.skills.map((skill, i) => (
                        <span key={i} className="skill-tag">{skill}</span>
                      ))}
                    </div>
                    <div className="job-description-preview">
                      {job.description && job.description.length > 120 
                        ? `${job.description.substring(0, 120)}...` 
                        : job.description}
                    </div>
                    <div className="job-actions">
                      <a 
                        href={job.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="apply-btn"
                        onClick={() => handleApplyClick(job._id)}
                      >
                        <i className="fas fa-paper-plane"></i> Apply Now
                      </a>
                      {/* Optional: Add a save/bookmark button if you want to implement that feature */}
                    </div>
                    <div className="job-posted">
                      Posted {new Date(job.postedDate).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Job pagination - if you want to add it */}
          {!loading && !error && jobListings.length > 0 && (
            <div className="job-pagination">
              <button className="pagination-btn" disabled={true}>
                <i className="fas fa-chevron-left"></i> Previous
              </button>
              <span className="page-indicator">Page 1</span>
              <button className="pagination-btn">
                Next <i className="fas fa-chevron-right"></i>
              </button>
            </div>
          )}
        </section>

        {/* Rest of your component remains the same */}
        <section className="bootcamps-section">
          {/* Your bootcamps section */}
        </section>

        <section className="resources-section">
          {/* Your resources section */}
        </section>
      </div>
      <Footer />
    </div>
  );
};

export default Tech;