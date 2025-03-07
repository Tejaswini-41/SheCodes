import axios from 'axios';

// Base URL for your API
const API_BASE_URL = 'http://localhost:5000'; 

export const API_ENDPOINTS = {
  AUTH: `${API_BASE_URL}/auth`,
  EVENTS: `${API_BASE_URL}/api/events`,
  MENTORS: `${API_BASE_URL}/api/mentors`,
  BLOGS: `${API_BASE_URL}/api/blogs`,
  JOBS: `${API_BASE_URL}/api/jobs`
};

// Get authentication headers
export const getAuthHeader = (user) => {
  if (user && user.token) {
    return { Authorization: `Bearer ${user.token}` };
  }
  return {};
};

// Handle image preview for upload inputs
export const handleImagePreview = (file, setFormData) => {
  if (!file) return;
  
  const reader = new FileReader();
  reader.onloadend = () => {
    setFormData(prev => ({ 
      ...prev, 
      imageFile: file, 
      image: reader.result 
    }));
  };
  reader.readAsDataURL(file);
};

export const apiRequest = async (method, endpoint, data = null, token = null, requireAuth = true, params = {}) => {
  try {
    const headers = {};
    
    // Only set Content-Type if we're actually sending data
    if (data !== null && data !== undefined) {
      headers['Content-Type'] = 'application/json';
    }

    // Add authorization token if provided and required
    if (token && requireAuth) {
      headers['Authorization'] = `Bearer ${token}`;
      console.log(`Adding Authorization header to ${endpoint} request`);
    }

    console.log(`API Request: ${method} ${endpoint}`, {
      params,
      hasToken: !!token && requireAuth,
      hasData: !!data
    });
    
    // Configure the request
    const config = {
      method,
      url: endpoint,
      headers,
      params
    };
    
    // Only add data property if data exists
    if (data !== null && data !== undefined) {
      config.data = data;
    }
    
    const response = await axios(config);

    console.log(`API Response from ${endpoint}:`, response.status);
    return response.data;
  } catch (error) {
    console.error(`API Error (${method} ${endpoint}):`, error.message);
    
    if (error.response) {
      console.error('Response error:', error.response.status, error.response.data);
    }
    
    throw error;
  }
};