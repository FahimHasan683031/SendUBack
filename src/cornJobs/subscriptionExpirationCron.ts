// src/cornJobs/subscriptionExpirationCron.ts
import cron from 'node-cron';


const subscriptionCron = cron.schedule('0 0 * * *', async () => {
  console.log('⏰ Running subscription expiration check...');
  console.log('Running at:', new Date().toISOString());
});

// Start the job
subscriptionCron.start();


export default subscriptionCron;
