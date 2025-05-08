import Task from '../models/Task.js';
import mongoose from 'mongoose';
import { mockDB } from '../config/db.js';

// Helper to check if we're using mock DB - more reliable detection
const isUsingMockDB = () => {
  return process.env.USE_MOCK_DB === 'true' || 
         (process.env.NODE_ENV === 'development' && !mongoose.connection.readyState);
};

// Mock operations for Task collection
const mockTaskOperations = {
  findTasks: (filter) => {
    console.log('Using mock task operations with filter:', filter);
    // Mock tasks array or empty array if not initialized
    const tasks = mockDB.tasks || [];
    
    return tasks.filter(task => {
      // Match createdBy as string comparison
      if (filter.createdBy && task.createdBy !== filter.createdBy) {
        return false;
      }
      
      // Match status if specified
      if (filter.status && task.status !== filter.status) {
        return false;
      }
      
      // Match priority if specified
      if (filter.priority && task.priority !== filter.priority) {
        return false;
      }
      
      return true;
    });
  },
  
  findTaskById: (id, userId) => {
    console.log(`Looking for task with ID: ${id} owned by user: ${userId}`);
    const tasks = mockDB.tasks || [];
    return tasks.find(task => task._id === id && task.createdBy === userId);
  },
  
  createTask: (taskData, userId) => {
    const newTask = {
      _id: `task_${Date.now()}`, // Generate a unique ID
      ...taskData,
      createdBy: userId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    // Initialize tasks array if it doesn't exist
    if (!mockDB.tasks) {
      mockDB.tasks = [];
    }
    
    // Add the new task
    mockDB.tasks.push(newTask);
    return newTask;
  },
  
  updateTask: (id, userId, updateData) => {
    const tasks = mockDB.tasks || [];
    const taskIndex = tasks.findIndex(task => task._id === id && task.createdBy === userId);
    
    if (taskIndex === -1) return null;
    
    // Update task with new data
    mockDB.tasks[taskIndex] = {
      ...mockDB.tasks[taskIndex],
      ...updateData,
      updatedAt: new Date().toISOString()
    };
    
    return mockDB.tasks[taskIndex];
  },
  
  deleteTask: (id, userId) => {
    const tasks = mockDB.tasks || [];
    const taskIndex = tasks.findIndex(task => task._id === id && task.createdBy === userId);
    
    if (taskIndex === -1) return null;
    
    // Remove task from array
    const deletedTask = mockDB.tasks[taskIndex];
    mockDB.tasks.splice(taskIndex, 1);
    
    return deletedTask;
  }
};

/**
 * Helper to safely handle both string IDs and ObjectIds for user reference
 * This is needed for compatibility with the mock database
 */
const createUserIdFilter = (userId) => {
  // Check if we're dealing with a string that doesn't look like a valid ObjectId
  if (typeof userId === 'string' && userId.length !== 24) {
    // For mock DB with non-ObjectId strings, we use a string comparison
    return userId;
  }
  
  // Otherwise, use the standard MongoDB ObjectId comparison
  try {
    return mongoose.Types.ObjectId(userId);
  } catch (error) {
    // If conversion fails, just use the original value
    return userId;
  }
};

function isValidObjectId(id) {
  return mongoose.Types.ObjectId.isValid(id) && (String(new mongoose.Types.ObjectId(id)) === id);
}

/**
 * @desc    Get all tasks
 * @route   GET /api/tasks
 * @access  Private
 */
export const getAllTasks = async (req, res) => {
  try {
    // Extract query parameters for filtering
    const { status, priority, dueDate } = req.query;
    console.log('isUsingMockDB result:', isUsingMockDB());
    
    // Check if we're using mock DB
    if (isUsingMockDB()) {
      console.log('Using mock DB in task controller (getAllTasks)');
      console.log('User ID from request:', req.user._id);
      
      // Build filter for mock DB (using string ID)
      const filter = { 
        createdBy: req.user._id,
        ...(status && { status }),
        ...(priority && { priority })
      };
      
      // Use mock operations to filter tasks
      const tasks = mockTaskOperations.findTasks(filter);
      console.log(`Found ${tasks.length} tasks in mock DB`);
      
      // Return consistent response format
      return res.json({
        success: true,
        count: tasks.length,
        data: tasks.map(task => ({
          _id: task._id,
          title: task.title,
          description: task.description,
          priority: task.priority,
          complexity: task.complexity,
          dueDate: task.dueDate,
          status: task.status,
          tags: task.tags,
          assignedTo: task.assignedTo,
          createdBy: task.createdBy,
          project: task.project,
          parentTask: task.parentTask,
          subtasks: task.subtasks,
          dependencies: task.dependencies,
          createdAt: task.createdAt,
          updatedAt: task.updatedAt
        }))
      });
    } else {
      // For real MongoDB - build filter with proper ObjectId
      const filter = { 
        createdBy: new mongoose.Types.ObjectId(req.user._id) 
      };
      
      // Add optional filters if provided
      if (status) filter.status = status;
      if (priority) filter.priority = priority;
      
      // Handle date filtering
      if (dueDate) {
        if (dueDate.includes(',')) {
          const [start, end] = dueDate.split(',');
          filter.dueDate = { 
            $gte: new Date(start),
            $lte: new Date(end)
          };
        } else {
          const date = new Date(dueDate);
          const nextDay = new Date(date);
          nextDay.setDate(date.getDate() + 1);
          
          filter.dueDate = { 
            $gte: date,
            $lt: nextDay
          };
        }
      }
      
      console.log('Fetching tasks with MongoDB filter:', JSON.stringify(filter));
      
      // Fetch tasks with populated references
      const tasks = await Task.find(filter)
        .populate('assignedTo', 'name email')
        .populate('project', 'name')
        .sort({ createdAt: -1 });
      
      console.log(`Found ${tasks.length} tasks in MongoDB`);
      
      // Return consistent response format
      return res.json({
        success: true,
        count: tasks.length,
        data: tasks.map(task => ({
          _id: task._id,
          title: task.title,
          description: task.description,
          priority: task.priority,
          complexity: task.complexity,
          dueDate: task.dueDate,
          status: task.status,
          tags: task.tags,
          assignedTo: task.assignedTo,
          createdBy: task.createdBy,
          project: task.project,
          parentTask: task.parentTask,
          subtasks: task.subtasks,
          dependencies: task.dependencies,
          createdAt: task.createdAt,
          updatedAt: task.updatedAt
        }))
      });
    }
  } catch (error) {
    // Log error for server-side debugging
    console.error('Error fetching tasks:', error);
    
    // Return user-friendly error response
    res.status(500).json({
      success: false,
      message: 'Failed to fetch tasks',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * @desc    Get task by ID
 * @route   GET /api/tasks/:id
 * @access  Private
 */
export const getTaskById = async (req, res) => {
  try {
    // Check if we're using mock DB
    if (isUsingMockDB()) {
      console.log('Using mock DB in getTaskById');
      
      // Find task in mock DB
      const id = req.params.id;
      const _id = isValidObjectId(id) ? new mongoose.Types.ObjectId(id) : id;
      const task = mockTaskOperations.findTaskById(_id, req.user._id);
      
      if (!task) {
        return res.status(404).json({
          success: false,
          message: 'Task not found'
        });
      }
      
      return res.json({
        success: true,
        data: task
      });
    } else {
      // For real MongoDB - use proper ObjectId conversion
      const id = req.params.id;
      const _id = isValidObjectId(id) ? new mongoose.Types.ObjectId(id) : id;
      const task = await Task.findOne({
        _id,
        createdBy: new mongoose.Types.ObjectId(req.user._id)
      })
        .populate('assignedTo', 'name email')
        .populate('project', 'name')
        .populate('subtasks')
        .populate('dependencies');
      
      if (!task) {
        return res.status(404).json({
          success: false,
          message: 'Task not found'
        });
      }
      
      res.json({
        success: true,
        data: task
      });
    }
  } catch (error) {
    console.error('Error fetching task:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch task',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * @desc    Create a new task
 * @route   POST /api/tasks
 * @access  Private
 */
export const createTask = async (req, res) => {
  try {
    console.log('[createTask] Request body:', req.body, 'User ID:', req.user._id);
    // Check if we're using mock DB
    if (isUsingMockDB()) {
      console.log('Using mock DB in createTask');
      // Create a new task using mock operations
      const newTask = mockTaskOperations.createTask(req.body, req.user._id);
      console.log('[createTask] New task created (mock):', newTask);
      console.log('[createTask] mockDB.tasks after create:', mockDB.tasks);
      return res.status(201).json({
        success: true,
        message: 'Task created successfully',
        data: newTask
      });
    } else {
      // For real MongoDB
      const task = new Task({
        ...req.body,
        createdBy: req.user._id
      });
      await task.save();
      console.log('[createTask] New task created (MongoDB):', task);
      // Return success response with the created task data
      res.status(201).json({
        success: true,
        message: 'Task created successfully',
        data: task
      });
    }
  } catch (error) {
    // Log error for debugging
    console.error('Error creating task:', error);
    
    // Specialized handling for validation errors
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(val => val.message);
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: messages
      });
    }
    
    // Generic error response for other types of errors
    res.status(500).json({
      success: false,
      message: 'Failed to create task',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * @desc    Update task
 * @route   PUT /api/tasks/:id
 * @access  Private
 */
export const updateTask = async (req, res) => {
  try {
    // Check if we're using mock DB
    if (isUsingMockDB()) {
      console.log('Using mock DB in updateTask');
      
      // Update task in mock DB
      const updatedTask = mockTaskOperations.updateTask(
        req.params.id, 
        req.user._id, 
        req.body
      );
      
      if (!updatedTask) {
        return res.status(404).json({
          success: false,
          message: 'Task not found'
        });
      }
      
      return res.json({
        success: true,
        message: 'Task updated successfully',
        data: updatedTask
      });
    } else {
      // For real MongoDB
      const task = await Task.findOneAndUpdate(
        { 
          _id: req.params.id, 
          createdBy: new mongoose.Types.ObjectId(req.user._id) 
        },
        req.body,
        { new: true, runValidators: true }
      );
      
      if (!task) {
        return res.status(404).json({
          success: false,
          message: 'Task not found'
        });
      }
      
      res.json({
        success: true,
        message: 'Task updated successfully',
        data: task
      });
    }
  } catch (error) {
    console.error('Error updating task:', error);
    
    // Handle validation errors
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(val => val.message);
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: messages
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Failed to update task',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * @desc    Delete task
 * @route   DELETE /api/tasks/:id
 * @access  Private
 */
export const deleteTask = async (req, res) => {
  try {
    console.log('[deleteTask] Task ID:', req.params.id, 'User ID:', req.user._id);
    // Check if we're using mock DB
    if (isUsingMockDB()) {
      console.log('Using mock DB in deleteTask');
      // Delete task from mock DB
      const deletedTask = mockTaskOperations.deleteTask(req.params.id, req.user._id);
      console.log('[deleteTask] Deleted task (mock):', deletedTask);
      console.log('[deleteTask] mockDB.tasks after delete:', mockDB.tasks);
      if (!deletedTask) {
        return res.status(404).json({
          success: false,
          message: 'Task not found'
        });
      }
      return res.json({
        success: true,
        message: 'Task deleted successfully',
        data: {}
      });
    } else {
      // For real MongoDB
      const id = req.params.id;
      const _id = isValidObjectId(id) ? new mongoose.Types.ObjectId(id) : id;
      const task = await Task.findOneAndDelete({
        _id,
        createdBy: new mongoose.Types.ObjectId(req.user._id)
      });
      console.log('[deleteTask] Deleted task (MongoDB):', task);
      if (!task) {
        return res.status(404).json({
          success: false,
          message: 'Task not found'
        });
      }
      res.json({
        success: true,
        message: 'Task deleted successfully',
        data: {}
      });
    }
  } catch (error) {
    console.error('Error deleting task:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete task',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * @desc    Update task status
 * @route   PUT /api/tasks/:id/status
 * @access  Private
 */
export const updateTaskStatus = async (req, res) => {
  try {
    const { status } = req.body;
    
    if (!status) {
      return res.status(400).json({
        success: false,
        message: 'Status field is required'
      });
    }
    
    // Check if we're using mock DB
    if (isUsingMockDB()) {
      console.log('Using mock DB in updateTaskStatus');
      
      // Update task status in mock DB
      const updatedTask = mockTaskOperations.updateTask(
        req.params.id, 
        req.user._id, 
        { status }
      );
      
      if (!updatedTask) {
        return res.status(404).json({
          success: false,
          message: 'Task not found'
        });
      }
      
      return res.json({
        success: true,
        message: 'Task status updated successfully',
        data: updatedTask
      });
    } else {
      // For real MongoDB
      const id = req.params.id;
      const _id = isValidObjectId(id) ? new mongoose.Types.ObjectId(id) : id;
      const task = await Task.findOneAndUpdate(
        { 
          _id, 
          createdBy: new mongoose.Types.ObjectId(req.user._id) 
        },
        { status },
        { new: true, runValidators: true }
      );
      
      if (!task) {
        return res.status(404).json({
          success: false,
          message: 'Task not found'
        });
      }
      
      res.json({
        success: true,
        message: 'Task status updated successfully',
        data: task
      });
    }
  } catch (error) {
    console.error('Error updating task status:', error);
    
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(val => val.message);
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: messages
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Failed to update task status',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * @desc    Add subtask to a task
 * @route   POST /api/tasks/:id/subtasks
 * @access  Private
 */
export const addSubtask = async (req, res) => {
  try {
    // First check if parent task exists and belongs to the user
    const parentTask = await Task.findOne({
      _id: req.params.id,
      createdBy: createUserIdFilter(req.user._id)
    });
    
    if (!parentTask) {
      return res.status(404).json({
        success: false,
        message: 'Parent task not found'
      });
    }
    
    // Create the subtask
    const subtask = new Task({
      ...req.body,
      createdBy: req.user._id,
      parentTask: req.params.id
    });
    
    // Save to database
    await subtask.save();
    
    // Update parent task with subtask reference
    if (!parentTask.subtasks) {
      parentTask.subtasks = [];
    }
    
    parentTask.subtasks.push(subtask._id);
    await parentTask.save();
    
    res.status(201).json({
      success: true,
      message: 'Subtask added successfully',
      data: subtask
    });
  } catch (error) {
    console.error('Error adding subtask:', error);
    
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(val => val.message);
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: messages
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Failed to add subtask',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * @desc    Add dependency to a task
 * @route   POST /api/tasks/:id/dependencies
 * @access  Private
 */
export const addDependency = async (req, res) => {
  try {
    const { dependencyId } = req.body;
    
    if (!dependencyId) {
      return res.status(400).json({
        success: false,
        message: 'Dependency ID is required'
      });
    }
    
    // Get main task
    const task = await Task.findOne({
      _id: req.params.id,
      createdBy: createUserIdFilter(req.user._id)
    });
    
    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }
    
    // Verify dependency task exists and belongs to the user
    const dependencyTask = await Task.findOne({
      _id: dependencyId,
      createdBy: createUserIdFilter(req.user._id)
    });
    
    if (!dependencyTask) {
      return res.status(404).json({
        success: false,
        message: 'Dependency task not found'
      });
    }
    
    // Prevent circular dependencies
    if (dependencyTask.dependencies && dependencyTask.dependencies.includes(task._id)) {
      return res.status(400).json({
        success: false,
        message: 'Circular dependency detected'
      });
    }
    
    // Add dependency if not already exists
    if (!task.dependencies) {
      task.dependencies = [];
    }
    
    // Check if dependency already exists
    if (task.dependencies.includes(dependencyId)) {
      return res.status(400).json({
        success: false,
        message: 'Dependency already exists'
      });
    }
    
    task.dependencies.push(dependencyId);
    await task.save();
    
    res.json({
      success: true,
      message: 'Dependency added successfully',
      data: task
    });
  } catch (error) {
    console.error('Error adding dependency:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to add dependency',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * @desc    Get count of tasks
 * @route   GET /api/tasks/count
 * @access  Private
 */
export const getTasksCount = async (req, res) => {
  try {
    const { status, priority, dueDate } = req.query;
    let filter;
    if (isUsingMockDB()) {
      filter = { createdBy: req.user._id };
      if (status) filter.status = status;
      if (priority) filter.priority = priority;
      // No date filtering for mock DB
      const tasks = mockTaskOperations.findTasks(filter);
      return res.json({ success: true, count: tasks.length });
    } else {
      filter = { createdBy: mongoose.Types.ObjectId(req.user._id) };
      if (status) filter.status = status;
      if (priority) filter.priority = priority;
      if (dueDate) {
        if (dueDate.includes(',')) {
          const [start, end] = dueDate.split(',');
          filter.dueDate = { $gte: new Date(start), $lte: new Date(end) };
        } else {
          const date = new Date(dueDate);
          const nextDay = new Date(date);
          nextDay.setDate(date.getDate() + 1);
          filter.dueDate = { $gte: date, $lt: nextDay };
        }
      }
      const count = await Task.countDocuments(filter);
      return res.json({ success: true, count });
    }
  } catch (error) {
    console.error('Error fetching task count:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch task count',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
}; 