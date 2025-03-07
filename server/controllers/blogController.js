import Blog from '../models/Blog.js';

// Get all blogs
export const getBlogs = async (req, res) => {
  try {
    const { category } = req.query;
    const filter = category && category !== 'all' ? { category } : {};
    
    console.log('Fetching blogs with filter:', filter);
    const blogs = await Blog.find(filter).sort({ createdAt: -1 });
    console.log(`✅ Successfully fetched ${blogs.length} blogs`);
    res.json(blogs);
  } catch (error) {
    console.error('❌ Error fetching blogs:', error);
    res.status(500).json({ message: error.message });
  }
};

// Create new blog
export const createBlog = async (req, res) => {
  try {
    console.log('Creating new blog with data:', req.body);
    const blog = new Blog(req.body);
    const savedBlog = await blog.save();
    console.log('✅ Blog created successfully:', savedBlog);
    res.status(201).json(savedBlog);
  } catch (error) {
    console.error('❌ Error creating blog:', error);
    res.status(400).json({ message: error.message });
  }
};