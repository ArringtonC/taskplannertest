#!/bin/bash

# Task Planner Deployment Script
# This script automates the process of building and deploying the Task Planner application

# Exit immediately if a command exits with a non-zero status
set -e

echo "🚀 Starting Task Planner deployment process..."

# Ensure environment files exist
if [ ! -f "./backend/.env" ]; then
  echo "⚠️  Backend .env file not found. Creating from example..."
  cp "./backend/.env.example" "./backend/.env"
  echo "⚠️  Please edit ./backend/.env with your production values"
  echo "🔧 Continuing anyway for demonstration purposes..."
fi

if [ ! -f "./frontend/.env" ]; then
  echo "⚠️  Frontend .env file not found. Creating from example..."
  cp "./frontend/.env.example" "./frontend/.env"
  echo "⚠️  Please edit ./frontend/.env with your production values"
  echo "🔧 Continuing anyway for demonstration purposes..."
fi

# Docker deployment
if [ "$1" = "--docker" ]; then
  echo "🐳 Starting Docker deployment..."
  
  if ! command -v docker &> /dev/null || ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker and/or Docker Compose not installed. Please install Docker first."
    exit 1
  fi
  
  # Build and start with Docker Compose
  docker-compose build
  docker-compose up -d
  
  echo "✅ Docker deployment complete! Application is running at:"
  echo "   - Frontend: http://localhost:80"
  echo "   - Backend API: http://localhost:5000"
  exit 0
fi

# Local deployment
echo "🔨 Building frontend application..."
cd frontend
npm ci
npm run build
cd ..

echo "🔨 Preparing backend application..."
cd backend
npm ci
# Note: No separate build step for Node.js

echo "⚠️ Skipping database seeding due to potential connection issues."
echo "To run the seed script manually, use: cd backend && npm run seed"

echo "🚀 Starting backend server..."
# Start backend with NODE_ENV=production to avoid database seeding
NODE_ENV=production npm start &
BACKEND_PID=$!
cd ..

echo "✅ Deployment complete!"
echo "   - Frontend built at: ./frontend/dist"
echo "   - Backend running at: http://localhost:5000"
echo ""
echo "🔍 To serve the frontend build, use: cd frontend && npx vite preview"
echo "⚠️ To stop the backend server, run: kill $BACKEND_PID" 