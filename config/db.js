const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    console.log('Connecting to MongoDB...');
    if (!process.env.MONGO_URI) {
      console.error('MONGO_URI is not defined in .env file');
      throw new Error('MONGO_URI is not defined');
    } else {
      const sanitizedUri = process.env.MONGO_URI.replace(/\/\/[^:]+:[^@]+@/, '//***:***@');
      console.log(`URI: ${sanitizedUri}`);
    }
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error(`Error Connecting to DB: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
