const express = require('express');
const router = express.Router();
const multer = require('multer');
const Mentor = require('../models/Mentor');

// Set up multer for handling file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/mentors') // Make sure this directory exists
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname)
  }
});

const upload = multer({ storage: storage });

// POST endpoint to create a new mentor
router.post('/', upload.single('image'), async (req, res) => {
  try {
    const mentorData = {
      name: req.body.name,
      role: req.body.role,
      company: req.body.company,
      expertise: JSON.parse(req.body.expertise),
      availability: req.body.availability,
      avatar: req.file ? `/uploads/mentors/${req.file.filename}` : 'https://cdn.prod.website-files.com/5ce11396d0cadb67eb2cac0e/621e3dddf8077a0ce7a409ba_Professional%20mentor.png'
    };

    // Create new mentor using mongoose model
    const newMentor = new Mentor(mentorData);
    await newMentor.save();

    res.status(201).json(newMentor);
  } catch (error) {
    console.error('Error creating mentor:', error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({ 
        message: 'Validation Error', 
        errors: Object.values(error.errors).map(err => err.message)
      });
    }
    res.status(500).json({ 
      message: 'Error creating mentor profile', 
      error: error.message 
    });
  }
});

// Get all mentors
router.get('/', async (req, res) => {
  try {
    console.log('Fetching all mentors...');
    const mentors = await Mentor.find();
    console.log(`Found ${mentors.length} mentors`);
    res.json(mentors);
  } catch (error) {
    console.error('Error in GET /mentors:', error);
    res.status(500).json({ 
      message: 'Error fetching mentors', 
      error: error.message 
    });
  }
});

module.exports = router;
