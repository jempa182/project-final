// config/database.js
import mongoose from 'mongoose';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Database configuration
const config = {
  url: process.env.MONGO_URL || "mongodb://localhost/final-project"
};

// Connect to MongoDB
export const connectToDatabase = async () => {
  try {
    if (!process.env.MONGO_URL) {
      console.warn('Warning: MONGO_URL not found in environment variables');
    }
    
    await mongoose.connect(config.url);
    console.log('Successfully connected to MongoDB.');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    process.exit(1); // Exit if we can't connect to database
  }
};

// Export config for use in tests or other places
export const dbConfig = config;