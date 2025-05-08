import express from 'express';
import { protect } from '../middleware/auth.js';
import {
  getAllTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
  updateTaskStatus,
  addSubtask,
  addDependency,
  getTasksCount
} from '../controllers/taskController.js';
import {
  validateCreateTask,
  validateUpdateTask,
  validateUpdateStatus,
  validateAddSubtask,
  validateAddDependency
} from '../middleware/validation.js';

const router = express.Router();

// @route   GET /api/tasks
// @desc    Get all tasks (with optional filtering)
// @access  Private
router.get('/', protect, getAllTasks);

// @route   GET /api/tasks/count
// @desc    Get count of tasks
// @access  Private
router.get('/count', protect, getTasksCount);

// @route   POST /api/tasks
// @desc    Create a new task
// @access  Private
router.post('/', protect, validateCreateTask, createTask);

// @route   GET /api/tasks/:id
// @desc    Get a single task
// @access  Private
router.get('/:id', protect, getTaskById);

// @route   PUT /api/tasks/:id
// @desc    Update a task
// @access  Private
router.put('/:id', protect, validateUpdateTask, updateTask);

// @route   DELETE /api/tasks/:id
// @desc    Delete a task
// @access  Private
router.delete('/:id', protect, deleteTask);

// @route   PUT /api/tasks/:id/status
// @desc    Update a task status
// @access  Private
router.put('/:id/status', protect, validateUpdateStatus, updateTaskStatus);

// @route   POST /api/tasks/:id/subtasks
// @desc    Add a subtask to a task
// @access  Private
router.post('/:id/subtasks', protect, validateAddSubtask, addSubtask);

// @route   POST /api/tasks/:id/dependencies
// @desc    Add a dependency to a task
// @access  Private
router.post('/:id/dependencies', protect, validateAddDependency, addDependency);

export default router; 