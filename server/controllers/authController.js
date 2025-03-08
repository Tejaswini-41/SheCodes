import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import Event from '../models/Event.js';
import Mentor from '../models/Mentor.js';

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

// Register new user
export const register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user
    const user = new User({
      name,
      email,
      password: hashedPassword,
      role: role || 'user' // Default to 'user' if no role provided
    });

    await user.save();

    // Generate JWT token
    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '30d' }
    );

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Login user
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '30d' }
    );

    // Update last login time
    user.lastActive = Date.now();
    await user.save();

    // Return user data without password
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get user profile
// @route   GET /auth/profile
// @access  Private
export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get user statistics for admin dashboard
// @route   GET /auth/stats
// @access  Admin
export const getUserStats = async (req, res) => {
  try {
    // Count all users
    const totalUsers = await User.countDocuments();
    
    // Count users who have logged in within the last 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 2);
    
    // This requires a lastLogin field in your User model
    // If you don't have it, you can use createdAt as a fallback
    const activeUsers = await User.countDocuments({
      $or: [
        { lastLogin: { $gte: thirtyDaysAgo } },
        { createdAt: { $gte: thirtyDaysAgo } }
      ]
    });
    
    // Get count of users by role
    const usersByRole = await User.aggregate([
      { $group: { _id: '$role', count: { $sum: 1 } } }
    ]);

    const roleStats = {};
    usersByRole.forEach(item => {
      roleStats[item._id] = item.count;
    });
    
    res.json({
      totalUsers,
      activeUsers,
      roleStats
    });
  } catch (error) {
    console.error('Error getting user stats:', error);
    res.status(500).json({ message: error.message });
  }
};

// Fixed getStats function
export const getStats = async (req, res) => {
  try {
    console.log('Getting admin stats');
    
    // Get counts from all collections
    const totalUsers = await User.countDocuments();
    const totalEvents = await Event.countDocuments();
    const totalMentors = await Mentor.countDocuments({ status: 'approved' });
    const pendingMentors = await Mentor.countDocuments({ status: 'pending' });
    
    // Default values for optional models
    let totalJobs = 0;
    let totalBlogs = 0;
    
    // Get active users (logged in within last 30 days)
    const activeUsers = await User.countDocuments({
      lastActive: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) }
    });
    
    // Get role statistics
    const adminCount = await User.countDocuments({ role: 'admin' });
    const userCount = await User.countDocuments({ role: 'user' });
    
    // Build complete stats object
    const stats = {
      totalUsers,
      activeUsers,
      totalEvents,
      totalMentors,
      pendingMentors,
      totalJobs,
      totalBlogs,
      roleStats: {
        admin: adminCount,
        user: userCount
      }
    };
    
    console.log('Admin stats generated:', stats);
    
    return res.status(200).json(stats);
  } catch (error) {
    console.error('Error generating admin stats:', error);
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Add this function to your controller
export const updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update fields if provided
    if (req.body.name) user.name = req.body.name;
    if (req.body.email) user.email = req.body.email;
    if (req.body.password) {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(req.body.password, salt);
    }

    // Save updated user
    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      role: updatedUser.role
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};