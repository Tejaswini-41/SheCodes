import mongoose from 'mongoose';

const blogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  author: {
    type: String,
    required: true
  },
  authorImg: {
    type: String,
    default: '/Images/blog.png'
  },
  category: {
    type: String,
    required: true,
    enum: ['success-stories', 'tech', 'career', 'leadership', 'wellness']
  },
  image: {
    type: String,
    default: '/Images/blog.png' 
  },
  excerpt: {
    type: String,
    required: true
  },
  readTime: {
    type: String,
    default: '5 min read'
  }
}, {
  timestamps: true
});

const Blog = mongoose.model('Blog', blogSchema);
export default Blog;