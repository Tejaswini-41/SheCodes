// Update the handleSubmit function

const handleSubmit = async (e) => {
  e.preventDefault();
  setSubmitting(true);
  setError(null);
  
  try {
    console.log('Submitting mentor application with data:', formData);
    
    // Format expertise as an array if it's a string
    const formattedData = {
      ...formData,
      expertise: Array.isArray(formData.expertise) ? 
        formData.expertise : 
        formData.expertise.split(',').map(item => item.trim())
    };
    
    const response = await apiRequest(
      'post',
      API_ENDPOINTS.MENTORS,
      formattedData,
      null,
      false
    );
    
    console.log('Mentor application submitted successfully:', response);
    
    setSuccess(true);
    resetForm();
    
    if (onSuccess) {
      onSuccess();
    }
  } catch (err) {
    console.error('Error submitting mentor application:', err);
    setError(err.response?.data?.message || 'Failed to submit application. Please try again.');
  } finally {
    setSubmitting(false);
  }
};