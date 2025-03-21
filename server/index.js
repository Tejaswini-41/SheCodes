import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';  
import authRoutes from './routes/authRoutes.js';
import mentorRoutes from './routes/mentorRoutes.js';
import eventRoutes from './routes/eventRoutes.js';
import blogRoutes from './routes/blogRoutes.js';
import jobRoutes from './routes/jobRoutes.js';
import { startJobScheduler } from './schedulers/jobScheduler.js';

dotenv.config(); 
connectDB();

const app = express();
app.use(cors());
app.use(express.json());  

// Use the routes
app.use('/auth', authRoutes);  
app.use('/api/events', eventRoutes);
app.use('/api/mentors', mentorRoutes);
app.use('/api/blogs', blogRoutes);
app.use('/api/jobs', jobRoutes);

// Start job scheduler if environment is production
if (process.env.NODE_ENV === 'production') {
  startJobScheduler();
}

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

