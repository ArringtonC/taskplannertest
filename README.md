# Task Planner Application

A full-stack application for task management with complexity tracking and monthly distribution visualization.

## 📋 Project Overview

Task Planner is a comprehensive task management system designed to help users visualize task distribution, analyze complexity, and prevent overload. The application consists of a React/TypeScript frontend and a Node.js/Express backend with MongoDB.

## 🚀 Quick Start

### Prerequisites

- Node.js (v14.0 or higher)
- npm or yarn
- MongoDB (local installation or MongoDB Atlas account)
- Docker and Docker Compose (optional, for containerized deployment)

### Installation & Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/task-planner.git
   cd task-planner
   ```

2. Set up environment variables:
   ```bash
   # Backend
   cp backend/.env.example backend/.env
   # Edit backend/.env with your values
   
   # Frontend
   cp frontend/.env.example frontend/.env
   # Edit frontend/.env with your values
   ```

3. Install dependencies and start development servers:
   ```bash
   # Backend
   cd backend
   npm install
   npm run dev
   
   # Frontend (in a new terminal)
   cd frontend
   npm install
   npm run dev
   ```

4. Access the application:
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000

## 📦 Key Features

- Interactive dashboard with table/card views of tasks
- Monthly Mapper calendar showing task distribution
- Complexity tracking and analysis
- Task breakdown capabilities
- Full CRUD operations for task management

## 🔄 Folder Structure

```
task-planner/
├── backend/           # Node.js/Express backend
├── frontend/          # React/TypeScript frontend
├── docker-compose.yml # Docker configuration
├── deploy.sh          # Deployment script
└── README.md          # This file
```

## 📊 Architecture

The application follows a modern web architecture:

- **Frontend**: React with TypeScript, Vite, Tailwind CSS
- **Backend**: Node.js, Express, MongoDB
- **State Management**: React Context API
- **Styling**: Tailwind CSS (utility-first CSS)
- **API Communication**: RESTful API pattern

## 🚀 Deployment

### Using the Deployment Script

The repository includes a deployment script that automates the build and deployment process:

```bash
# Make the script executable
chmod +x deploy.sh

# For local deployment
./deploy.sh

# For Docker deployment
./deploy.sh --docker
```

### Manual Deployment

#### Docker Compose (Recommended)

1. Build and start containers:
   ```bash
   docker-compose up -d
   ```

2. Access the application:
   - Frontend: http://localhost:80
   - Backend API: http://localhost:5000

#### Separate Deployment

Refer to the individual README files in the frontend and backend directories for detailed deployment instructions:

- [Frontend Deployment Guide](./frontend/README.md#deployment)
- [Backend Deployment Guide](./backend/README.md#deployment)

## Multi-Environment Deployment

### Backend (Docker Compose)

To start the backend in a specific environment:

```
docker-compose --env-file backend/.env.development up -d --build
# or
docker-compose --env-file backend/.env.staging up -d --build
# or
docker-compose --env-file backend/.env.production up -d --build
```

### Frontend (Vite)

To build the frontend for a specific environment:

```
cd frontend
npm run build -- --mode development
npm run build -- --mode staging
npm run build -- --mode production
```

- The correct `.env.[mode]` file will be used automatically by Vite.

### CI/CD Pipeline
- In your CI/CD config, copy the correct `.env` file before building or deploying.
- For frontend, use the `--mode` flag as shown above.

---

For more details, see the comments in `docker-compose.yml` and the `.env.*` files in both `backend/` and `frontend/`.

## 📝 License

This project is licensed under the MIT License

## Task Planner Dashboard

The Task Planner Dashboard provides a modern, responsive interface for managing your tasks. It supports full CRUD (Create, Read, Update, Delete) operations, as well as search and filter functionality for efficient task management.

### Features
- **Add, Edit, and Delete Tasks:** Use the "Add Task" button or edit/delete actions on each task.
- **Search:** Quickly find tasks by typing keywords in the search bar.
- **Filter:** Filter tasks by status (Pending, In Progress, Completed, Cancelled, Deferred) and priority (Low, Medium, High).
- **Responsive UI:** Works well on desktop and mobile devices.
- **Accessible:** All controls are keyboard and screen reader accessible.

### Usage
1. **Add a Task:** Click the "Add Task" button and fill out the form.
2. **Edit a Task:** Click the edit icon on a task to modify its details.
3. **Delete a Task:** Click the delete icon and confirm deletion.
4. **Search/Filter:** Use the search bar and dropdowns above the task list to narrow down visible tasks.

For more details on the backend API and advanced features, see the documentation in the `frontend/src/api/` and `frontend/src/hooks/` directories.