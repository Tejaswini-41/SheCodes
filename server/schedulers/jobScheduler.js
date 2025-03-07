import cron from 'node-cron';
import JobAPIService from '../services/jobAPIService.js';

export const startJobScheduler = () => {
  console.log('Starting job scheduler');
  
  // Schedule job fetching every day at midnight
  cron.schedule('0 0 * * *', async () => {
    console.log('Running scheduled job fetch: ' + new Date().toISOString());
    try {
      const jobService = new JobAPIService();
      await jobService.fetchJobs();
    } catch (error) {
      console.error('Error in scheduled job fetch:', error);
    }
  });
};