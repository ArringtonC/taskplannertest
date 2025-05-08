/**
 * Task Planner - User Seed Data
 * ============================
 * 
 * This file contains sample user data for seeding the database.
 * 
 * USAGE:
 *   import { users } from './data/userData.js';
 * 
 * STRUCTURE:
 *   - users: Array of user objects with name, email, password, and role
 * 
 * NOTE: Passwords will be hashed during the seeding process
 */

export const users = [
  {
    _id: '60d0fe4f5311236168a109ca', // Used in task data as a mock ID
    name: 'Admin User',
    email: 'admin@example.com',
    password: 'password123', // This will be hashed during seeding
    role: 'admin'
  },
  {
    name: 'Test User',
    email: 'test@example.com',
    password: 'password123', // This will be hashed during seeding
    role: 'user'
  },
  {
    name: 'Developer One',
    email: 'dev1@example.com',
    password: 'password123', // This will be hashed during seeding
    role: 'user'
  },
  {
    name: 'Developer Two',
    email: 'dev2@example.com',
    password: 'password123', // This will be hashed during seeding
    role: 'user'
  },
  {
    name: 'Project Manager',
    email: 'pm@example.com',
    password: 'password123', // This will be hashed during seeding
    role: 'manager'
  }
]; 