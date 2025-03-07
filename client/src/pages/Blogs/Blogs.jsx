import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../../components/Navbar/Navbar';
import Footer from '../../components/Footer/Footer';
import './Blogs.css';

const API_URL = 'http://localhost:5000/api/blogs';

const Blogs = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showPostForm, setShowPostForm] = useState(false);
  const [blogForm, setBlogForm] = useState({
    title: '',
    content: '',
    author: '',
    category: 'tech',
    excerpt: '',
    image: ''
  });

  const categories = [
    'all', 'success-stories', 'tech', 'career', 'leadership', 'wellness'
  ];

  // Fetch blogs when component mounts or category changes
  useEffect(() => {
    fetchBlogs();
  }, [selectedCategory]);

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('Fetching blogs for category:', selectedCategory);
      
      const response = await axios.get(`${API_URL}?category=${selectedCategory}`);
      console.log('Blogs fetched successfully:', response.data);
      setBlogs(response.data);
    } catch (err) {
      console.error('Error details:', err);
      setError(err.response?.data?.message);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setBlogForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await axios.post(API_URL, blogForm);
      setBlogs(prev => [response.data, ...prev]);
      setShowPostForm(false);
      setBlogForm({
        title: '',
        content: '',
        author: '',
        category: 'tech',
        excerpt: '',
        image: ''
      });
    } catch (err) {
      setError('Failed to post blog');
      console.error('Error posting blog:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="blogs-container">
      <Navbar />
      <div className="blogs-page">
        <div className="blogs-hero">
          <h1>Stories That Inspire</h1>
          <p>Discover success stories, insights, and knowledge from women leaders</p>
        </div>

        <section className="blog-filters">
          <div className="category-tabs">
            {categories.map((category) => (
              <button
                key={category}
                className={`category-btn ${selectedCategory === category ? 'active' : ''}`}
                onClick={() => setSelectedCategory(category)}
              >
                {category.split('-').join(' ')}
              </button>
            ))}
          </div>
        </section>

        <section className="write-blog">
          <div className="write-blog-content">
            <h2>Share Your Story</h2>
            <p>Inspire others by sharing your experiences and insights</p>
            <button 
              className="write-blog-btn"
              onClick={() => setShowPostForm(true)}
            >
              Start Writing
            </button>
          </div>
        </section>

        {showPostForm && (
          <div className="modal-overlay">
            <div className="modal-content">
              <h2>Write Your Blog</h2>
              <form onSubmit={handleSubmit} className="blog-form">
                <div className="form-group">
                  <label>Title</label>
                  <input
                    type="text"
                    name="title"
                    value={blogForm.title}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Category</label>
                  <select
                    name="category"
                    value={blogForm.category}
                    onChange={handleInputChange}
                    required
                  >
                    {categories.filter(cat => cat !== 'all').map(category => (
                      <option key={category} value={category}>
                        {category.split('-').join(' ')}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>Content</label>
                  <textarea
                    name="content"
                    value={blogForm.content}
                    onChange={handleInputChange}
                    rows="10"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Excerpt (Short summary)</label>
                  <textarea
                    name="excerpt"
                    value={blogForm.excerpt}
                    onChange={handleInputChange}
                    rows="3"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Author Name</label>
                  <input
                    type="text"
                    name="author"
                    value={blogForm.author}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Image URL</label>
                  <input
                    type="text"
                    name="image"
                    value={blogForm.image}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="form-actions">
                  <button type="button" onClick={() => setShowPostForm(false)}>
                    Cancel
                  </button>
                  <button type="submit" disabled={loading}>
                    {loading ? 'Posting...' : 'Post Blog'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {loading && <div className="loading">Loading blogs...</div>}
        {error && <div className="error-message">{error}</div>}

        <section className="blog-grid">
          {blogs.map((blog, index) => (
            <article key={index} className="blog-card">
              <div className="blog-image">
                <img src={blog.image || '/Images/blogs/default.jpg'} alt={blog.title} />
                <span className="category-tag">{blog.category}</span>
              </div>
              <div className="blog-content">
                <h3>{blog.title}</h3>
                <p>{blog.excerpt}</p>
                <div className="blog-meta">
                  <div className="author-info">
                    <img src={blog.authorImg || '/Images/authors/default.jpg'} alt={blog.author} />
                    <span>{blog.author}</span>
                  </div>
                  <div className="post-info">
                    <span>{new Date(blog.createdAt).toLocaleDateString()}</span>
                    <span>{blog.readTime}</span>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </section>
      </div>
      <Footer />
    </div>
  );
};

export default Blogs;
