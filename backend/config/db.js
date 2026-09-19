const mongoose = require('mongoose');

let isConnected = false;

const connectDB = async () => {
  // Reuse existing database connection in serverless runtime
  if (mongoose.connection.readyState >= 1) {
    return;
  }

  try {
    const mongoURI = process.env.MONGODB_URI;
    if (!mongoURI) {
      console.error('❌ MONGODB_URI environment variable is missing in .env file.');
      console.error('ℹ️  Please check backend/.env.example and configure your MongoDB Atlas connection string.');
      if (process.env.NODE_ENV !== 'production' && require.main === module) {
        process.exit(1);
      }
      throw new Error('MONGODB_URI environment variable is missing.');
    }

    const conn = await mongoose.connect(mongoURI);
    isConnected = true;
    console.log(`✅ MongoDB Connected successfully to host: ${conn.connection.host}`);
    console.log(`📦 Database Name: ${conn.connection.name}`);
  } catch (error) {
    console.error(`❌ MongoDB Atlas Connection Error: ${error.message}`);
    if (process.env.NODE_ENV !== 'production' && require.main === module) {
      process.exit(1);
    }
    throw error;
  }
};

module.exports = connectDB;
