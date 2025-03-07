import axios from 'axios';

// API endpoints
export const API_ENDPOINTS = {
  MENTORS: 'http://localhost:5000/api/mentors',
  EVENTS: 'http://localhost:5000/api/events',
  BLOGS: 'http://localhost:5000/api/blogs',
  AUTH: 'http://localhost:5000/auth'
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

// Make API request with proper auth
export const apiRequest = async (method, url, data = null, user = null, isMultipart = false) => {
  const headers = {
    ...getAuthHeader(user)
  };
  
  if (!isMultipart) {
    headers['Content-Type'] = 'application/json';
  }
  
  try {
    const response = await axios({
      method,
      url,
      data,
      headers
    });
    return response.data;
  } catch (error) {
    console.error(`API Error (${method} ${url}):`, error);
    throw error;
  }
};