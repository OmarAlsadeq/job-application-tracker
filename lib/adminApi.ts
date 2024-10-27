import db from '@/lib/db'; // Import your database connection and models
import JobApplication from '@/models/jobapplication';
import User from '@/models/user';

// Function to fetch all jobs for the admin
export const fetchAdminJobs = async () => {
  try {
    if (!db) {
      console.error('Database connection is not initialized.');
      throw new Error('Database connection error');
    }

    const jobs = await JobApplication.findAll(); // Adjust based on your model structure
    console.log('Jobs fetched successfully:', jobs.length);
    return jobs;
  } catch (error: any) {
    console.error('Error fetching jobs:', error.message, error.stack);
    throw new Error('Error fetching jobs');
  }
};

// Function to fetch all users for the admin
export const fetchAllUsers = async () => {
  try {
    if (!db) {
      console.error('Database connection is not initialized.');
      throw new Error('Database connection error');
    }

    const users = await User.findAll(); // Adjust based on your model structure
    console.log('Users fetched successfully:', users.length);
    return users;
  } catch (error: any) {
    console.error('Error fetching users:', error.message, error.stack);
    throw new Error('Error fetching users');
  }
};
