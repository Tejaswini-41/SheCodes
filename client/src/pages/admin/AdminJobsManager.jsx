import React, { useState, useEffect } from 'react';
import { apiRequest, API_ENDPOINTS } from '../../utils/apiUtils';
import './AdminJobsManager.css';

// Update the component signature to accept token
const AdminJobsManager = ({ user, token }) => {
  // Initialize jobs as empty array, not undefined
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showJobForm, setShowJobForm] = useState(false);
  const [editingJob, setEditingJob] = useState(null);
  const [jobForm, setJobForm] = useState({
    company: '',
    role: '',
    location: '',
    type: 'Full-time',
    experience: '2', // Make sure this is a string since we're using it as a string in the form
    skills: '',
    description: '',
    category: 'General',
    applyLink: '',  // Add this line
    logo: ''
  });
  const [fetchingExternalJobs, setFetchingExternalJobs] = useState(false);
  const [error, setError] = useState(null);

  // Fetch all jobs
  useEffect(() => {
    fetchJobs();
  }, []);

  // Update fetchJobs function
  const fetchJobs = async () => {
    try {
      setLoading(true);
      console.log('Fetching jobs...');
      
      const response = await apiRequest('get', API_ENDPOINTS.JOBS, null, token);
      console.log('API response:', response);
      
      // Add defensive check for response and response.jobs
      if (response && response.jobs) {
        console.log('Jobs found:', response.jobs.length);
        setJobs(response.jobs);
      } else {
        console.warn('No jobs array in response or response is invalid:', response);
        // Initialize with empty array if response.jobs is missing
        setJobs([]);
      }
    } catch (error) {
      console.error('Error fetching jobs:', error);
      // Always set jobs to empty array on error
      setJobs([]);
      alert('Failed to fetch jobs');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'skills') {
      // Convert comma-separated string to array
      setJobForm(prev => ({ ...prev, [name]: value }));
    } else {
      setJobForm(prev => ({ ...prev, [name]: value }));
    }
  };

  // Add this function to validate the form before submission
  const validateForm = () => {
    const errors = {};
    
    if (!jobForm.company) errors.company = 'Company name is required';
    if (!jobForm.role) errors.role = 'Job role is required';
    if (!jobForm.location) errors.location = 'Job location is required';
    if (!jobForm.description) errors.description = 'Job description is required';
    if (!jobForm.applyLink) errors.applyLink = 'Application link is required';
    
    return errors;
  };

  // Update handleSubmit to use validation
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    const formErrors = validateForm();
    
    if (Object.keys(formErrors).length > 0) {
      // Show validation errors
      let errorMessage = 'Please fix the following errors:\n';
      Object.keys(formErrors).forEach(field => {
        errorMessage += `- ${formErrors[field]}\n`;
      });
      alert(errorMessage);
      return;
    }
    
    setLoading(true);
    
    try {
      const formData = { ...jobForm };
      
      // Make sure applyLink exists
      if (!formData.applyLink || formData.applyLink.trim() === '') {
        formData.applyLink = `https://careers.example.com/${formData.company.toLowerCase().replace(/\s+/g, '-')}`;
      }
      
      // Convert skills from comma-separated string to array
      if (typeof formData.skills === 'string') {
        formData.skills = formData.skills.split(',').map(skill => skill.trim());
      }
      
      // Add source field to indicate it's a manual entry
      formData.source = 'manual';
      
      console.log('Submitting job data:', formData);
      
      if (editingJob) {
        await apiRequest('put', `${API_ENDPOINTS.JOBS}/${editingJob._id}`, formData, token);
        alert('Job updated successfully!');
      } else {
        await apiRequest('post', API_ENDPOINTS.JOBS, formData, token);
        alert('Job created successfully!');
      }
      
      setShowJobForm(false);
      setEditingJob(null);
      setJobForm({
        company: '',
        role: '',
        location: '',
        type: 'Full-time',
        experience: '2',
        skills: '',
        description: '',
        category: 'General',
        applyLink: '',
        logo: ''
      });
      fetchJobs();
    } catch (error) {
      console.error('Error saving job:', error);
      alert('Failed to save job. Please check all required fields.');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (job) => {
    setEditingJob(job);
    setJobForm({
      ...job,
      // Convert array back to comma-separated string for the form
      skills: Array.isArray(job.skills) ? job.skills.join(', ') : job.skills,
      // Make sure applyLink is always set
      applyLink: job.applyLink || ''
    });
    setShowJobForm(true);
  };

  // Update handleDelete function
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this job?')) return;
    
    try {
      setLoading(true);
      await apiRequest('delete', `${API_ENDPOINTS.JOBS}/${id}`, null, token);
      alert('Job deleted successfully!');
      fetchJobs();
    } catch (error) {
      console.error('Error deleting job:', error);
      alert('Failed to delete job');
    } finally {
      setLoading(false);
    }
  };

  // Update fetchExternalJobs function
  const fetchExternalJobs = async () => {
    if (!window.confirm('This will fetch jobs from external API. Continue?')) return;
    
    try {
      setFetchingExternalJobs(true);
      setError(null);
      
      console.log('Fetching external jobs with token:', token ? 'Valid token' : 'No token');
      
      const response = await apiRequest(
        'post', 
        `${API_ENDPOINTS.JOBS}/fetch-external`, 
        null,
        token,
        true
      );
      
      console.log('External jobs response:', response);
      
      if (response.success) {
        alert(`Successfully fetched ${response.count} jobs!`);
        fetchJobs();
      } else {
        alert('Failed to fetch external jobs: ' + response.message);
      }
    } catch (error) {
      console.error('Error fetching external jobs:', error);
      
      // Try the test jobs endpoint as fallback
      try {
        const fallbackResponse = await apiRequest(
          'get',
          `${API_ENDPOINTS.JOBS}/seed-test`,
          null,
          token,
          true
        );
        
        alert(`External API unavailable. Added ${fallbackResponse.count} test jobs instead.`);
        fetchJobs();
      } catch (fallbackError) {
        alert('Failed to fetch jobs. Adzuna API is currently unavailable and fallback also failed.');
        setError('Failed to fetch jobs. Please try again later.');
      }
    } finally {
      setFetchingExternalJobs(false);
    }
  };

  return (
    <div className="admin-jobs-manager">
      <div className="manager-header">
        <h2>Manage Job Listings</h2>
        <div className="action-buttons">
          <button 
            className="add-job-btn"
            onClick={() => setShowJobForm(true)}
          >
            <i className="fas fa-plus"></i> Add New Job
          </button>
          <button 
            className="fetch-external-btn"
            onClick={fetchExternalJobs}
            disabled={fetchingExternalJobs}
          >
            <i className="fas fa-cloud-download-alt"></i> 
            {fetchingExternalJobs ? 'Fetching...' : 'Fetch External Jobs'}
          </button>
        </div>
      </div>
      
      {loading && <div className="loading-spinner">Loading...</div>}
      
      {showJobForm && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>{editingJob ? 'Edit Job' : 'Add New Job'}</h2>
            <form onSubmit={handleSubmit} className="job-form">
              <div className="form-grid">
                <div className="form-group">
                  <label>Company Name*</label>
                  <input 
                    type="text" 
                    name="company" 
                    value={jobForm.company} 
                    onChange={handleInputChange}
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label>Role/Position*</label>
                  <input 
                    type="text" 
                    name="role" 
                    value={jobForm.role} 
                    onChange={handleInputChange}
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label>Location*</label>
                  <input 
                    type="text" 
                    name="location" 
                    value={jobForm.location} 
                    onChange={handleInputChange}
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label>Job Type</label>
                  <select 
                    name="type" 
                    value={jobForm.type} 
                    onChange={handleInputChange}
                  >
                    <option value="Full-time">Full-time</option>
                    <option value="Part-time">Part-time</option>
                    <option value="Contract">Contract</option>
                    <option value="Freelance">Freelance</option>
                    <option value="Internship">Internship</option>
                  </select>
                </div>
                
                <div className="form-group">
                  <label>Experience Level</label>
                  <input 
                    type="text" 
                    name="experience" 
                    value={jobForm.experience} 
                    onChange={handleInputChange}
                    placeholder="e.g. 2-3 years"
                  />
                </div>
                
                <div className="form-group">
                  <label>Skills (comma-separated)</label>
                  <input 
                    type="text" 
                    name="skills" 
                    value={jobForm.skills} 
                    onChange={handleInputChange}
                    placeholder="e.g. JavaScript, React, Node.js"
                  />
                </div>
                
                <div className="form-group">
                  <label>Company Logo URL</label>
                  <input 
                    type="text" 
                    name="logo" 
                    value={jobForm.logo} 
                    onChange={handleInputChange}
                    placeholder="https://example.com/logo.png"
                  />
                </div>
                
                <div className="form-group">
                  <label>Category*</label>
                  <select 
                    name="category" 
                    value={jobForm.category} 
                    onChange={handleInputChange}
                    required
                  >
                    <option value="engineering">Engineering</option>
                    <option value="design">Design</option>
                    <option value="product">Product</option>
                    <option value="data">Data</option>
                    <option value="management">Management</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                
                <div className="form-group">
                  <label>Salary Range</label>
                  <input 
                    type="text" 
                    name="salary" 
                    value={jobForm.salary} 
                    onChange={handleInputChange}
                    placeholder="e.g. $80K-$120K"
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="applyLink">Application Link</label>
                  <input
                    type="url"
                    id="applyLink"
                    name="applyLink"
                    value={jobForm.applyLink}
                    onChange={handleInputChange}
                    placeholder="https://example.com/apply"
                    required
                  />
                  <div className="form-help">URL where candidates can apply for this job</div>
                </div>
              </div>
              
              <div className="form-group full-width">
                <label>Job Description</label>
                <textarea 
                  name="description" 
                  value={jobForm.description} 
                  onChange={handleInputChange}
                  rows="5"
                  placeholder="Describe the job responsibilities and requirements"
                ></textarea>
              </div>
              
              <div className="form-actions">
                <button 
                  type="button" 
                  onClick={() => {
                    setShowJobForm(false);
                    setEditingJob(null);
                  }}
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  disabled={loading}
                >
                  {loading ? 'Saving...' : editingJob ? 'Update Job' : 'Add Job'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      
      <div className="jobs-table-container">
        <table className="jobs-table">
          <thead>
            <tr>
              <th>Company</th>
              <th>Role</th>
              <th>Location</th>
              <th>Type</th>
              <th>Category</th>
              <th>Posted Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {/* Add null check with optional chaining or use ! operator */}
            {!jobs || jobs.length === 0 ? (
              <tr>
                <td colSpan="7" className="no-jobs">No job listings found</td>
              </tr>
            ) : (
              jobs.map(job => (
                <tr key={job._id}>
                  <td>{job.company}</td>
                  <td>{job.role}</td>
                  <td>{job.location}</td>
                  <td>{job.type}</td>
                  <td>{job.category}</td>
                  <td>{job.postedDate ? new Date(job.postedDate).toLocaleDateString() : 'N/A'}</td>
                  <td className="actions-cell">
                    <button 
                      className="edit-btn"
                      onClick={() => handleEdit(job)}
                    >
                      <i className="fas fa-edit"></i>
                    </button>
                    <button 
                      className="delete-btn"
                      onClick={() => handleDelete(job._id)}
                    >
                      <i className="fas fa-trash"></i>
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminJobsManager;
