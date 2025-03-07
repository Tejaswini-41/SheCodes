import Mentor from '../models/Mentor.js';

// Array of professional mentor/avatar images that are free to use
const mentorAvatars = [
  'https://randomuser.me/api/portraits/women/1.jpg',
  'https://randomuser.me/api/portraits/women/2.jpg',
  'https://randomuser.me/api/portraits/women/3.jpg',
  'https://randomuser.me/api/portraits/women/4.jpg',
  'https://randomuser.me/api/portraits/women/5.jpg',
  'https://randomuser.me/api/portraits/women/6.jpg',
  'https://randomuser.me/api/portraits/women/7.jpg',
  'https://randomuser.me/api/portraits/women/8.jpg',
  'https://randomuser.me/api/portraits/women/9.jpg',
  'https://randomuser.me/api/portraits/women/10.jpg',
  'https://randomuser.me/api/portraits/women/11.jpg',
  'https://randomuser.me/api/portraits/women/12.jpg'
];

// Get all approved mentors for regular users
export const getMentors = async (req, res) => {
  try {
    const mentors = await Mentor.find({ status: 'approved' });
    res.json(mentors);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all mentors for admin (both approved and pending)
export const getAllMentors = async (req, res) => {
  try {
    const mentors = await Mentor.find({});
    res.json(mentors);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create mentor request
export const createMentor = async (req, res) => {
  try {
    console.log('Received mentor data:', req.body);
    
    const { name, role, company, expertise, availability, avatar, linkedinUrl, status } = req.body;
    
    // Ensure expertise is an array
    const expertiseArray = Array.isArray(expertise) ? expertise : 
      typeof expertise === 'string' ? 
        expertise.split(',').map(item => item.trim()).filter(item => item !== '') :
        [];
    
    console.log('Processed expertise array:', expertiseArray);
    
    // Get a random avatar if one isn't provided
    const randomAvatar = mentorAvatars[Math.floor(Math.random() * mentorAvatars.length)];
    
    const mentor = new Mentor({
      name,
      role,
      company,
      expertise: expertiseArray,
      availability,
      linkedinUrl: linkedinUrl || 'https://www.linkedin.com/in/',
      avatar: avatar || randomAvatar,
      status: 'pending' // Always start as pending
    });

    console.log('Created mentor object:', mentor);
    
    const createdMentor = await mentor.save();
    console.log('✅ Mentor saved to database:', createdMentor);
    res.status(201).json(createdMentor);
  } catch (error) {
    console.error('❌ Error in createMentor:', error);
    res.status(400).json({ message: error.message });
  }
};

// Approve a mentor request
export const approveMentor = async (req, res) => {
  try {
    const mentor = await Mentor.findById(req.params.id);
    
    if (!mentor) {
      return res.status(404).json({ message: 'Mentor not found' });
    }
    
    mentor.status = 'approved';
    const updatedMentor = await mentor.save();
    
    res.json(updatedMentor);
  } catch (error) {
    console.error('❌ Error in approveMentor:', error);
    res.status(500).json({ message: error.message });
  }
};

// Reject/delete a mentor request
export const deleteMentor = async (req, res) => {
  try {
    const mentor = await Mentor.findById(req.params.id);
    
    if (!mentor) {
      return res.status(404).json({ message: 'Mentor not found' });
    }
    
    await Mentor.deleteOne({ _id: req.params.id });
    
    res.json({ message: 'Mentor request removed' });
  } catch (error) {
    console.error('❌ Error in deleteMentor:', error);
    res.status(500).json({ message: error.message });
  }
};