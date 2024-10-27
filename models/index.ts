import sequelize from '../lib/db'; // Import your sequelize instance
import JobApplication from '@/models/jobapplication'; // Import your models
import User from './user';

const db: any = {};

// Initialize the JobApplication model
db.JobApplication = JobApplication; // Assign the model to db
db.User = User;

// Export the db object containing models and Sequelize instance
db.sequelize = sequelize;

export default db;
