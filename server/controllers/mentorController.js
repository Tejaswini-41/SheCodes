import Mentor from '../models/Mentor.js';

// Array of professional mentor/avatar images that are free to use
const mentorAvatars = [
  'https://randomuser.me/api/portraits/women/1.jpg',
  'https://randomuser.me/api/portraits/women/2.jpg',
  'https://randomuser.me/api/portraits/women/10.jpg',
  'https://randomuser.me/api/portraits/women/11.jpg',
  'https://randomuser.me/api/portraits/women/12.jpg'
];

// Get all approved mentors (public endpoint)
export const getMentors = async (req, res) => {
  try {
    const mentors = await Mentor.find({ status: 'approved' });
    res.json(mentors);
  } catch (error) {
    console.error('Error fetching approved mentors:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get pending mentor requests (admin endpoint)
export const getPendingMentorRequests = async (req, res) => {
  try {
    console.log('Fetching pending mentor requests');
    const mentorRequests = await Mentor.find({ status: 'pending' });
    console.log(`Found ${mentorRequests.length} pending mentor requests`);
    res.json(mentorRequests);
  } catch (error) {
    console.error('Error fetching pending mentor requests:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Create new mentor request
export const createMentor = async (req, res) => {
  try {
    console.log('Creating new mentor request with data:', req.body);
    
    // Extract fields from request body
    const { name, email, role, company, expertise, experience, bio, avatar, linkedinUrl } = req.body;
    
    // Check if mentor with this email already exists
    const existingMentor = await Mentor.findOne({ email });
    if (existingMentor) {
      return res.status(400).json({ message: 'A mentor with this email already exists' });
    }
    
    // Create new mentor request (with pending status by default)
    const newMentor = new Mentor({
      name,
      email,
      role,
      company,
      expertise: Array.isArray(expertise) ? expertise : expertise.split(',').map(item => item.trim()),
      experience,
      bio,
      avatar,
      linkedinUrl,
      userId: req.user ? req.user._id : null
    });
    
    await newMentor.save();
    console.log('New mentor request created:', newMentor);
    
    res.status(201).json({ 
      message: 'Mentor request submitted successfully. It will be reviewed by our team.',
      mentor: newMentor 
    });
  } catch (error) {
    console.error('Error creating mentor request:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Approve mentor request
export const approveMentor = async (req, res) => {
  try {
    const { id } = req.params;
    console.log(`Approving mentor with ID: ${id}`);
    
    const updatedMentor = await Mentor.findByIdAndUpdate(
      id,
      { status: 'approved' },
      { new: true }
    );
    
    if (!updatedMentor) {
      return res.status(404).json({ message: 'Mentor request not found' });
    }
    
    console.log('Mentor request approved:', updatedMentor);
    res.json({ message: 'Mentor request approved', mentor: updatedMentor });
  } catch (error) {
    console.error('Error approving mentor request:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Reject/delete mentor request
export const deleteMentor = async (req, res) => {
  try {
    const { id } = req.params;
    console.log(`Deleting/rejecting mentor with ID: ${id}`);
    
    const deletedMentor = await Mentor.findByIdAndDelete(id);
    
    if (!deletedMentor) {
      return res.status(404).json({ message: 'Mentor request not found' });
    }
    
    console.log('Mentor request rejected/deleted');
    res.json({ message: 'Mentor request removed', id });
  } catch (error) {
    console.error('Error deleting mentor request:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Add test mentor requests
export const seedTestMentors = async (req, res) => {
  try {
    const testMentors = [
      {
        name: "Anjali Sharma",
        email: "anjali.sharma@example.com",
        role: "Senior Frontend Engineer",
        company: "TechCorp",
        expertise: ["React", "JavaScript", "UI/UX"],
        experience: 5,
        bio: "I have 5 years of experience in frontend development and love mentoring junior developers.",
        avatar: "https://randomuser.me/api/portraits/women/44.jpg",
        linkedinUrl: "https://linkedin.com/in/anjalisharma",
        status: "pending",
      },
      {
        name: "Priya Patel",
        email: "priya.patel@example.com",
        role: "Product Manager",
        company: "InnovateTech",
        expertise: ["Product Strategy", "User Research", "Agile"],
        experience: 7,
        bio: "Product manager with experience in launching successful tech products.",
        avatar: "https://randomuser.me/api/portraits/women/68.jpg",
        linkedinUrl: "https://linkedin.com/in/priyapatel",
        status: "pending",
      }
    ];
    
    await Mentor.insertMany(testMentors);
    
    console.log(`Added ${testMentors.length} test mentor requests`);
    res.status(201).json({ 
      message: `Successfully added ${testMentors.length} test mentor requests`,
      mentors: testMentors
    });
  } catch (error) {
    console.error('Error adding test mentors:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};