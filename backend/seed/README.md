# Task Planner Seed Data Scripts

This directory contains scripts and data for seeding the Task Planner database with test data.

## Available Seed Data

- **Users**: Admin, regular users, and test accounts
- **Projects**: Sample projects with metadata
- **Tasks**: Various tasks with different statuses, priorities, and due dates
- **Subtasks**: Demonstrates parent-child task relationships

## Usage Instructions

### Prerequisites

Before running the seed scripts, ensure:

1. MongoDB is running and accessible
2. Environment variables are properly configured in `.env`
3. You are **not** running this in a production environment (seeding will be blocked)

### Running the Seed Script

The easiest way to run the seed script is using the npm script:

```bash
# From the backend directory
npm run seed
```

This will:
1. Clear existing data from the database (in development/test environments only)
2. Create sample users with hashed passwords
3. Create sample projects
4. Create sample tasks and subtasks with proper relationships

### Custom Importing

You can also import the seed functions in your own scripts:

```javascript
import { seedDatabase } from './seed/seedTasks.js';

// Run the complete seeding process
await seedDatabase();

// Or execute specific parts manually
import User from './models/User.js';
import connectDB from './config/db.js';
import { users } from './seed/data/userData.js';

await connectDB();
await User.insertMany(users);
```

## Modifying Seed Data

To modify the sample data, edit the corresponding files in the `data` directory:

- `userData.js` - Sample users
- `projectData.js` - Sample projects
- `taskData.js` - Sample tasks and subtasks

## Warning

⚠️ **IMPORTANT**: The seed script will delete all existing data in the database before inserting new data. 
It will refuse to run in a production environment, but always double-check your NODE_ENV setting.

## Troubleshooting

If you encounter any issues while running the seed scripts:

1. Ensure MongoDB is running and accessible
2. Check the connection string in your `.env` file
3. Make sure all required models are properly defined
4. For reference ID errors, check that the mock IDs in the data files match

## Adding New Seed Data Types

To add new types of seed data:

1. Create a new data file in the `data` directory
2. Import the data in `seedTasks.js`
3. Add a new seeding function in `seedTasks.js`
4. Update the `seedDatabase` function to include your new data type 