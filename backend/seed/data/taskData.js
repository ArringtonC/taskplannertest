/**
 * Task Planner - Task Seed Data
 * ============================
 * 
 * This file contains sample task data for seeding the database.
 * 
 * USAGE:
 *   import { tasks, taskWithSubtasks } from './data/taskData.js';
 * 
 * STRUCTURE:
 *   - tasks: Array of regular task objects
 *   - taskWithSubtasks: Example of a parent task with subtasks
 * 
 * NOTE: The mock IDs used here should match those in userData.js and projectData.js
 */

// Generate dates relative to today
const today = new Date();
const tomorrow = new Date(today);
tomorrow.setDate(tomorrow.getDate() + 1);

const nextWeek = new Date(today);
nextWeek.setDate(nextWeek.getDate() + 7);

const nextMonth = new Date(today);
nextMonth.setMonth(nextMonth.getMonth() + 1);

// Mock user IDs (would be replaced with actual IDs in production)
const mockUserId = '60d0fe4f5311236168a109ca'; // This is a placeholder
const mockProject1Id = '60d0fe4f5311236168a109cb'; // This is a placeholder
const mockProject2Id = '60d0fe4f5311236168a109cc'; // This is a placeholder

// Task seed data
export const tasks = [
  {
    title: 'Setup Project Repository',
    description: 'Initialize Git repository and create basic project structure',
    status: 'completed',
    priority: 'high',
    dueDate: new Date(today.setDate(today.getDate() - 14)), // 2 weeks ago
    tags: ['setup', 'git'],
    assignedTo: mockUserId,
    createdBy: mockUserId,
    project: mockProject1Id
  },
  {
    title: 'Design Database Schema',
    description: 'Create MongoDB schema design for tasks, users, and projects',
    status: 'completed',
    priority: 'high',
    dueDate: new Date(today.setDate(today.getDate() - 7)), // 1 week ago
    tags: ['database', 'design'],
    assignedTo: mockUserId,
    createdBy: mockUserId,
    project: mockProject1Id
  },
  {
    title: 'Implement User Authentication',
    description: 'Set up JWT authentication and user registration/login routes',
    status: 'in-progress',
    priority: 'high',
    dueDate: tomorrow,
    tags: ['auth', 'security'],
    assignedTo: mockUserId,
    createdBy: mockUserId,
    project: mockProject1Id
  },
  {
    title: 'Create Task API Endpoints',
    description: 'Implement CRUD operations for tasks',
    status: 'todo',
    priority: 'medium',
    dueDate: nextWeek,
    tags: ['api', 'backend'],
    assignedTo: mockUserId,
    createdBy: mockUserId,
    project: mockProject1Id
  },
  {
    title: 'Design Dashboard UI',
    description: 'Create wireframes and UI components for the task dashboard',
    status: 'in-progress',
    priority: 'medium',
    dueDate: tomorrow,
    tags: ['ui', 'design'],
    assignedTo: mockUserId,
    createdBy: mockUserId,
    project: mockProject1Id
  },
  {
    title: 'Implement Frontend State Management',
    description: 'Set up React Context or Redux for state management',
    status: 'todo',
    priority: 'medium',
    dueDate: nextWeek,
    tags: ['frontend', 'state'],
    assignedTo: mockUserId,
    createdBy: mockUserId,
    project: mockProject1Id
  },
  {
    title: 'Create Task Form Component',
    description: 'Build a form for creating and editing tasks with validation',
    status: 'todo',
    priority: 'low',
    dueDate: nextWeek,
    tags: ['component', 'frontend'],
    assignedTo: mockUserId,
    createdBy: mockUserId,
    project: mockProject1Id
  },
  {
    title: 'Implement Task Filtering and Sorting',
    description: 'Add UI and API support for filtering and sorting tasks',
    status: 'todo',
    priority: 'low',
    dueDate: nextMonth,
    tags: ['feature', 'ui'],
    assignedTo: mockUserId,
    createdBy: mockUserId,
    project: mockProject1Id
  },
  {
    title: 'Add Task Comments Feature',
    description: 'Allow users to comment on tasks and see comment history',
    status: 'todo',
    priority: 'low',
    dueDate: nextMonth,
    tags: ['feature', 'collaboration'],
    assignedTo: mockUserId,
    createdBy: mockUserId,
    project: mockProject2Id
  },
  {
    title: 'Implement Task Labels',
    description: 'Add colored labels to tasks for better organization',
    status: 'todo',
    priority: 'low',
    dueDate: nextMonth,
    tags: ['feature', 'ui'],
    assignedTo: mockUserId,
    createdBy: mockUserId,
    project: mockProject2Id
  },
  {
    title: 'Create Data Visualization Dashboard',
    description: 'Implement charts and graphs for task analytics',
    status: 'todo',
    priority: 'medium',
    dueDate: nextMonth,
    tags: ['analytics', 'ui'],
    assignedTo: mockUserId,
    createdBy: mockUserId,
    project: mockProject2Id
  },
  {
    title: 'Setup Testing Framework',
    description: 'Configure Jest and write initial unit tests',
    status: 'todo',
    priority: 'medium',
    dueDate: nextWeek,
    tags: ['testing', 'dev-ops'],
    assignedTo: mockUserId,
    createdBy: mockUserId,
    project: mockProject2Id
  }
];

// Task with subtasks example
export const taskWithSubtasks = {
  title: 'Launch Version 1.0',
  description: 'Complete all tasks required for the initial release',
  status: 'in-progress',
  priority: 'high',
  dueDate: nextMonth,
  tags: ['milestone', 'release'],
  assignedTo: mockUserId,
  createdBy: mockUserId,
  project: mockProject1Id,
  subtasks: [
    {
      title: 'Finalize Features',
      description: 'Decide which features will be included in v1.0',
      status: 'completed',
      priority: 'high',
      assignedTo: mockUserId,
      createdBy: mockUserId
    },
    {
      title: 'Complete Documentation',
      description: 'Write user and API documentation',
      status: 'in-progress',
      priority: 'medium',
      assignedTo: mockUserId,
      createdBy: mockUserId
    },
    {
      title: 'Perform QA Testing',
      description: 'Run full test suite and fix critical bugs',
      status: 'todo',
      priority: 'high',
      assignedTo: mockUserId,
      createdBy: mockUserId
    },
    {
      title: 'Prepare Release Notes',
      description: 'Document changes, new features, and known issues',
      status: 'todo',
      priority: 'low',
      assignedTo: mockUserId,
      createdBy: mockUserId
    }
  ]
}; 