import express from 'express';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// @route   GET /api/projects
// @desc    Get all projects for a user
// @access  Private
router.get('/', protect, (req, res) => {
  // This will be implemented in the controller
  res.status(501).json({ message: 'Get all projects - Not implemented yet' });
});

// @route   POST /api/projects
// @desc    Create a new project
// @access  Private
router.post('/', protect, (req, res) => {
  // This will be implemented in the controller
  res.status(501).json({ message: 'Create project - Not implemented yet' });
});

// @route   GET /api/projects/:id
// @desc    Get a single project
// @access  Private
router.get('/:id', protect, (req, res) => {
  // This will be implemented in the controller
  res.status(501).json({ message: 'Get project - Not implemented yet' });
});

// @route   PUT /api/projects/:id
// @desc    Update a project
// @access  Private
router.put('/:id', protect, (req, res) => {
  // This will be implemented in the controller
  res.status(501).json({ message: 'Update project - Not implemented yet' });
});

// @route   DELETE /api/projects/:id
// @desc    Delete a project
// @access  Private
router.delete('/:id', protect, (req, res) => {
  // This will be implemented in the controller
  res.status(501).json({ message: 'Delete project - Not implemented yet' });
});

// @route   POST /api/projects/:id/members
// @desc    Add a member to a project
// @access  Private
router.post('/:id/members', protect, (req, res) => {
  // This will be implemented in the controller
  res.status(501).json({ message: 'Add project member - Not implemented yet' });
});

export default router; 