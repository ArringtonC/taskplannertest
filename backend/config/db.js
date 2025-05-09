import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

// Pre-hash the default password
const hashedPassword = bcrypt.hashSync('password123', 10);

// Mock in-memory database for development without MongoDB
const mockDB = {
  users: [
    {
      _id: 'admin123',
      name: 'Admin User',
      email: 'admin@example.com',
      password: hashedPassword,
      role: 'admin',
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ],
  projects: [],
  tasks: [],
  isConnected: true,
  connection: {
    host: 'mock-database'
  }
};

const connectDB = async () => {
  // If we're in test mode or have a special flag, use mock database
  if (process.env.USE_MOCK_DB === 'true' || process.env.NODE_ENV === 'test') {
    console.log('Using mock in-memory database');
    return mockDB;
  }
  
  try {
    // Set a shorter connection timeout for development
    const options = {
      serverSelectionTimeoutMS: process.env.NODE_ENV === 'development' ? 2000 : 30000,
      connectTimeoutMS: process.env.NODE_ENV === 'development' ? 2000 : 30000
    };
    
    const conn = await mongoose.connect(process.env.MONGODB_URI, options);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error(`Error connecting to MongoDB: ${error.message}`);
    
    // In development, fall back to mock database
    if (process.env.NODE_ENV === 'development') {
      console.log('Falling back to mock in-memory database for development');
      return mockDB;
    }
    
    // In production, exit the app
    process.exit(1);
  }
};

export default connectDB;
export { mockDB }; 