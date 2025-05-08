# Task Planner Backend API

A RESTful API service for managing tasks with priority and complexity tracking. This backend supports the Task Planner frontend application for task management, visualization, and complexity analysis.

## 📋 Project Overview

The Task Planner backend provides a robust API for tracking and managing tasks with various complexity levels and due dates. It supports parent-child task relationships and includes functionality for:

- Creating, reading, updating, and deleting tasks
- Tracking task complexity levels (1-8)
- Filtering tasks by due date
- Managing parent-child task relationships

## 🚀 Getting Started

### Prerequisites

- Node.js (v14.0 or higher)
- npm or yarn
- MongoDB (local installation or MongoDB Atlas account)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/task-planner-backend.git
   cd task-planner-backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   Create a `.env` file in the root directory with the following variables:
   ```
   PORT=5000
   MONGO_URI=mongodb://localhost:27017/taskplanner
   NODE_ENV=development
   CORS_ORIGIN=http://localhost:3000
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

## 📜 Available Scripts

- `npm run dev` - Start the development server with nodemon for hot reloading
- `npm start` - Start the production server
- `npm run seed` - Populate the database with sample task data for development
- `npm test` - Run the test suite
- `npm run lint` - Run linting checks
- `npm run lint:fix` - Fix linting issues automatically

## 🔑 Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| PORT | The port the server will run on | 5000 |
| MONGO_URI | MongoDB connection string | mongodb://localhost:27017/taskplanner |
| NODE_ENV | Environment (development/production) | development |
| CORS_ORIGIN | Allowed origin for CORS | http://localhost:3000 |

## 🔌 API Endpoints

### Tasks

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/tasks | Get all tasks |
| GET | /api/tasks/:id | Get a specific task by ID |
| POST | /api/tasks | Create a new task |
| PUT | /api/tasks/:id | Update an existing task |
| DELETE | /api/tasks/:id | Delete a task |

### Example Requests

#### Create a new task

```bash
curl -X POST http://localhost:5000/api/tasks \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Implement authentication",
    "complexity": 5,
    "dueDate": "2023-12-31T00:00:00.000Z",
    "parentId": null
  }'
```

#### Get all tasks

```bash
curl http://localhost:5000/api/tasks
```

## 🛠️ Technology Stack

- **Node.js** - JavaScript runtime
- **Express** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **dotenv** - Environment variable management
- **cors** - Cross-Origin Resource Sharing middleware
- **express-validator** - Input validation

## 📁 Project Structure

```
backend/
├── config/          # Configuration files (database, etc.)
├── controllers/     # Route controllers
├── middleware/      # Express middleware
├── models/          # Mongoose models
├── routes/          # Express routes
├── seed/            # Seeding scripts and data
├── tests/           # Test files
├── .env             # Environment variables (create this)
├── .gitignore       # Git ignore file
├── app.js           # Express app setup
├── package.json     # Project dependencies
└── README.md        # This file
```

## 🔒 Error Handling

The API uses consistent error responses with the following format:

```json
{
  "success": false,
  "message": "Error message description",
  "errors": [
    {
      "field": "title",
      "message": "Title is required"
    }
  ]
}
```

## 🚀 Deployment

### Docker Deployment

The project includes Docker support for easy deployment:

1. Build the Docker image:
   ```bash
   docker build -t task-planner-backend .
   ```

2. Run the container:
   ```bash
   docker run -p 5000:5000 --env-file .env task-planner-backend
   ```

### Docker Compose (with Frontend)

The root directory contains a `docker-compose.yml` file to run both frontend and backend:

1. Configure environment variables:
   ```bash
   cp .env.example .env
   # Edit .env with your values
   ```

2. Start both services:
   ```bash
   docker-compose up -d
   ```

3. Access the application:
   - Backend API: http://localhost:5000
   - Frontend: http://localhost:80

### Production Considerations

For production deployment:

- Set `NODE_ENV=production` in your environment
- Use a process manager like PM2 for non-Docker deployments
- Configure a reverse proxy (Nginx, Apache) for SSL termination
- Set up proper database authentication and backups
- Implement rate limiting for API endpoints

## 📝 License

This project is licensed under the MIT License 