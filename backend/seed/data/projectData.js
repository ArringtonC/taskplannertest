/**
 * Task Planner - Project Seed Data
 * ===============================
 * 
 * This file contains sample project data for seeding the database.
 * 
 * USAGE:
 *   import { projects } from './data/projectData.js';
 * 
 * STRUCTURE:
 *   - projects: Array of project objects with name, description, dates, and members
 * 
 * NOTE: The mock user IDs referenced here should match those in userData.js
 */

// Mock owner id (would be replaced with actual user ID in production)
const mockUserId = '60d0fe4f5311236168a109ca'; // This is a placeholder

export const projects = [
  {
    _id: '60d0fe4f5311236168a109cb', // Used in task data as a mock ID
    name: 'Task Planner Development',
    description: 'Development of the Task Planner web application',
    owner: mockUserId,
    members: [mockUserId],
    status: 'in-progress',
    startDate: new Date('2023-01-01'),
    endDate: new Date('2023-12-31'),
    tags: ['web', 'development', 'react']
  },
  {
    _id: '60d0fe4f5311236168a109cc', // Used in task data as a mock ID
    name: 'Marketing Website',
    description: 'Company marketing website redesign',
    owner: mockUserId,
    members: [mockUserId],
    status: 'planned',
    startDate: new Date('2023-03-01'),
    endDate: new Date('2023-09-30'),
    tags: ['web', 'marketing', 'design']
  },
  {
    name: 'Mobile App',
    description: 'Mobile application for iOS and Android',
    owner: mockUserId,
    members: [mockUserId],
    status: 'planned',
    startDate: new Date('2023-06-01'),
    endDate: new Date('2024-02-28'),
    tags: ['mobile', 'react-native', 'development']
  }
]; 