/**
 * Task Seeder Script
 * 
 * This script generates and inserts sample task data into the database.
 * It can be run independently from the command line.
 */

import dotenv from 'dotenv';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import connectDB from '../config/db.js';
import Task from '../models/Task.js';
import User from '../models/User.js';
import Project from '../models/Project.js';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import path from 'path';

// Import seed data
import { tasks, taskWithSubtasks } from './data/taskData.js';
import { users } from './data/userData.js';
import { projects } from './data/projectData.js';

// Get directory path for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '../.env') });

// Flag to track if this is directly executed or imported
const isDirectlyExecuted = process.argv[1] === fileURLToPath(import.meta.url);

/**
 * Connect to the database and initialize seeding
 */
const initializeSeeding = async () => {
  console.log('🌱 Task seeder initializing...');
  
  try {
    // Connect to the database
    const conn = await connectDB();
    
    if (conn.isConnected || mongoose.connection.readyState === 1) {
      console.log('📊 Database connection established');
      return true;
    } else {
      console.error('❌ Failed to connect to the database');
      return false;
    }
  } catch (error) {
    console.error(`❌ Database connection error: ${error.message}`);
    return false;
  }
};

/**
 * Clear existing data from the database
 */
const clearDatabase = async () => {
  if (process.env.NODE_ENV === 'production') {
    console.error('❌ Refusing to clear database in production environment');
    return false;
  }
  
  try {
    console.log('🧹 Clearing existing data...');
    
    await Task.deleteMany({});
    console.log('✓ Tasks collection cleared');
    
    await User.deleteMany({});
    console.log('✓ Users collection cleared');
    
    await Project.deleteMany({});
    console.log('✓ Projects collection cleared');
    
    return true;
  } catch (error) {
    console.error(`❌ Error clearing database: ${error.message}`);
    return false;
  }
};

/**
 * Seed users data
 */
const seedUsers = async () => {
  try {
    console.log('👤 Seeding users data...');
    
    // Hash passwords before inserting
    const hashedUsers = await Promise.all(
      users.map(async (user) => {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(user.password, salt);
        return { ...user, password: hashedPassword };
      })
    );
    
    const createdUsers = await User.insertMany(hashedUsers);
    console.log(`✓ ${createdUsers.length} users created`);
    
    // Return the admin user ID to use in other seeding functions
    return createdUsers.find(user => user.role === 'admin')._id;
  } catch (error) {
    console.error(`❌ Error seeding users: ${error.message}`);
    throw error;
  }
};

/**
 * Seed projects data
 */
const seedProjects = async (adminUserId) => {
  try {
    console.log('📁 Seeding projects data...');
    
    // Update owner and member IDs with real user ID
    const projectsWithValidIds = projects.map(project => ({
      ...project,
      owner: adminUserId,
      members: [adminUserId]
    }));
    
    const createdProjects = await Project.insertMany(projectsWithValidIds);
    console.log(`✓ ${createdProjects.length} projects created`);
    
    // Return the projects to use in task seeding
    return createdProjects;
  } catch (error) {
    console.error(`❌ Error seeding projects: ${error.message}`);
    throw error;
  }
};

/**
 * Seed tasks data
 */
const seedTasks = async (adminUserId, projects) => {
  try {
    console.log('📝 Seeding tasks data...');
    
    // Get project IDs for reference
    const taskPlannerProject = projects.find(p => p.name === 'Task Planner Development');
    const marketingProject = projects.find(p => p.name === 'Marketing Website');
    
    // Update tasks with real user and project IDs
    const tasksWithValidIds = tasks.map(task => {
      // Determine which project to use
      const projectId = task.project === '60d0fe4f5311236168a109cb' 
        ? taskPlannerProject._id 
        : marketingProject._id;
      
      return {
        ...task,
        assignedTo: adminUserId,
        createdBy: adminUserId,
        project: projectId
      };
    });
    
    // Update the task with subtasks
    const parentTaskData = {
      ...taskWithSubtasks,
      assignedTo: adminUserId,
      createdBy: adminUserId,
      project: taskPlannerProject._id
    };
    
    // First create the parent task
    const parentTask = await Task.create(parentTaskData);
    console.log(`✓ Parent task created: ${parentTask.title}`);
    
    // Then create the subtasks with reference to parent
    const subtasksData = parentTaskData.subtasks.map(subtask => ({
      ...subtask,
      assignedTo: adminUserId,
      createdBy: adminUserId,
      parentTask: parentTask._id
    }));
    
    const createdSubtasks = await Task.insertMany(subtasksData);
    console.log(`✓ ${createdSubtasks.length} subtasks created`);
    
    // Update parent task with subtask references
    parentTask.subtasks = createdSubtasks.map(subtask => subtask._id);
    await parentTask.save();
    
    // Create regular tasks
    const createdTasks = await Task.insertMany(tasksWithValidIds);
    console.log(`✓ ${createdTasks.length} regular tasks created`);
    
    return {
      regularTasks: createdTasks.length,
      parentTasks: 1,
      subtasks: createdSubtasks.length
    };
  } catch (error) {
    console.error(`❌ Error seeding tasks: ${error.message}`);
    throw error;
  }
};

/**
 * Main seeding function to be called directly or imported
 */
export const seedDatabase = async () => {
  // Initialize database connection
  const connected = await initializeSeeding();
  if (!connected) {
    console.error('❌ Seeding aborted due to database connection failure');
    process.exit(1);
  }
  
  try {
    console.log('🚀 Starting database seeding process...');
    
    // Clear existing data
    const cleared = await clearDatabase();
    if (!cleared) {
      throw new Error('Failed to clear existing data');
    }
    
    // Seed users first to get valid IDs
    const adminUserId = await seedUsers();
    
    // Seed projects next
    const createdProjects = await seedProjects(adminUserId);
    
    // Finally seed tasks with valid user and project references
    const taskResults = await seedTasks(adminUserId, createdProjects);
    
    console.log('✅ Database seeding completed successfully!');
    console.log('📊 Summary:');
    console.log(`   - Users: ${users.length}`);
    console.log(`   - Projects: ${projects.length}`);
    console.log(`   - Regular Tasks: ${taskResults.regularTasks}`);
    console.log(`   - Parent Tasks: ${taskResults.parentTasks}`);
    console.log(`   - Subtasks: ${taskResults.subtasks}`);
    
    // Only close the connection if directly executed
    if (isDirectlyExecuted) {
      console.log('👋 Closing database connection...');
      await mongoose.connection.close();
    }
    
    return true;
  } catch (error) {
    console.error(`❌ Error during seeding: ${error.message}`);
    
    // Only close the connection if directly executed
    if (isDirectlyExecuted) {
      await mongoose.connection.close();
    }
    
    if (isDirectlyExecuted) {
      process.exit(1);
    }
    return false;
  }
};

// Execute the seeding function when the script is run directly
if (isDirectlyExecuted) {
  seedDatabase()
    .then(() => {
      console.log('✅ Seed script execution completed');
      process.exit(0);
    })
    .catch((error) => {
      console.error(`❌ Seed script execution failed: ${error.message}`);
      process.exit(1);
    });
} 