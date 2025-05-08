import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { mockDB } from '../config/db.js';

// Helper to check if we're using mock DB
const isUsingMockDB = () => {
  return process.env.USE_MOCK_DB === 'true' || 
         (process.env.NODE_ENV === 'development' && !User.db?.db);
};

// Mock operations for mock DB
const mockOperations = {
  findById: (id) => {
    const user = mockDB.users.find(user => user._id.toString() === id.toString());
    if (user) {
      // Clone the user to avoid modifying the mock DB object
      return { ...user };
    }
    return null;
  }
};

export const protect = async (req, res, next) => {
  let token;

  // Check if token exists in headers
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // Get token from header
      token = req.headers.authorization.split(' ')[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Get user from the token (exclude password)
      if (isUsingMockDB()) {
        console.log('Using mock DB in auth middleware');
        const user = mockOperations.findById(decoded.id);
        if (user) {
          // Create a copy without the password
          const { password, ...userWithoutPassword } = user;
          
          // Store the user in request for downstream middleware/routes
          req.user = userWithoutPassword;
          
          // Log the user ID format so we can track it
          console.log(`User authenticated with ID: ${req.user._id} (type: ${typeof req.user._id})`);
        } else {
          return res.status(401).json({
            success: false,
            message: 'User not found with this token',
          });
        }
      } else {
        // Regular MongoDB flow
        req.user = await User.findById(decoded.id).select('-password');
      }

      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'User not found with this token',
        });
      }

      next();
    } catch (error) {
      console.error(error);
      res.status(401).json({
        success: false,
        message: 'Not authorized, token failed',
      });
    }
  } else if (!token) {
    res.status(401).json({
      success: false,
      message: 'Not authorized, no token',
    });
  }
};

// Middleware for admin-only routes
export const admin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({
      success: false,
      message: 'Not authorized as an admin',
    });
  }
}; 