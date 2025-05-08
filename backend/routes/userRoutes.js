import express from 'express';
import { protect, admin } from '../middleware/auth.js';
import { registerUser, loginUser, getUserProfile } from '../controllers/userController.js';

const router = express.Router();

// @route   POST /api/users/register
// @desc    Register a new user
// @access  Public
router.post('/register', registerUser);

// @route   POST /api/users/login
// @desc    Login user / get token
// @access  Public
router.post('/login', loginUser);

// @route   GET /api/users/profile
// @desc    Get user profile
// @access  Private
router.get('/profile', protect, getUserProfile);

// @route   PUT /api/users/profile
// @desc    Update user profile
// @access  Private
router.put('/profile', protect, (req, res) => {
  // This will be implemented in the controller
  res.status(501).json({ message: 'Update user profile - Not implemented yet' });
});

// @route   GET /api/users
// @desc    Get all users
// @access  Private/Admin
router.get('/', protect, admin, (req, res) => {
  // This will be implemented in the controller
  res.status(501).json({ message: 'Get all users - Not implemented yet' });
});

export default router; 