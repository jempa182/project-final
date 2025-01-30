// config/database.js
import mongoose from 'mongoose';

// Database configuration
const config = {
  // Added comment to remind about moving to .env
  url: process.env.MONGODB_URL || "mongodb+srv://jempa182:NjzFCota9q0e9Oy8@cluster0.1aoha.mongodb.net/project-mongodb?retryWrites=true&w=majority&appName=Cluster0"
};

// Connect to MongoDB
export const connectToDatabase = async () => {
  try {
    await mongoose.connect(config.url, config.options);
    console.log('Successfully connected to MongoDB.');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    process.exit(1); // Exit if we can't connect to database
  }
};

// Export config for use in tests or other places
export const dbConfig = config;