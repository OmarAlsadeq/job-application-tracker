import { Sequelize } from 'sequelize';
import mysql2 from 'mysql2'; // Import mysql2 directly to pass as dialectModule
import JobApplication from '@/models/jobapplication';
import User from '@/models/user';

// Initialize Sequelize with environment variables
const sequelize = new Sequelize(
  process.env.DB_NAME as string,
  process.env.DB_USER as string,
  process.env.DB_PASSWORD as string,
  {
    host: process.env.DB_HOST || 'localhost',
    dialect: 'mysql',
    dialectModule: mysql2, // Pass mysql2 directly to Sequelize as the dialect module
    logging: false, // Disable logging, or set to true for debugging
  }
);

// Initialize models and their relationships
JobApplication.initModel(sequelize); // Ensure JobApplication has initModel
User.initModel(sequelize); // Ensure User has initModel

User.hasMany(JobApplication, { foreignKey: 'userId', as: 'jobApplications' });
JobApplication.belongsTo(User, { foreignKey: 'userId', as: 'user' });

// Export the db object containing models and the Sequelize instance
const db = {
  sequelize,
  Sequelize,
  User,
  JobApplication,
};

export default db;
