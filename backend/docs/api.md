# Task Planner API Documentation

This document provides detailed information about the Task Planner API endpoints.

## Base URL

`http://localhost:5000/api`

## Authentication

Most endpoints require authentication using JWT tokens:

1. Register a user with `/api/users/register`
2. Login with `/api/users/login` to receive a token
3. Include the token in the Authorization header for protected routes:
   `Authorization: Bearer <your_token_here>`

## Error Responses

All API errors return with a consistent format:

```json
{
  "success": false,
  "message": "Description of the error",
  "errors": ["Optional array of specific error messages"]
}
```

Common HTTP status codes:
- 200: Success
- 201: Resource created
- 400: Bad request (validation error)
- 401: Unauthorized (invalid/missing token)
- 403: Forbidden (insufficient permissions)
- 404: Resource not found
- 409: Conflict (e.g., duplicate resource)
- 500: Server error

## Task Endpoints

### Get All Tasks

Retrieves all tasks for the authenticated user, with support for filtering.

- **URL**: `/api/tasks`
- **Method**: `GET`
- **Auth Required**: Yes
- **Query Parameters**:
  - `status`: Filter by status (e.g., 'pending', 'completed')
  - `priority`: Filter by priority (e.g., 'high', 'medium', 'low')
  - `dueDate`: Filter by date or date range ('YYYY-MM-DD' or 'YYYY-MM-DD,YYYY-MM-DD')

#### Success Response

- **Code**: 200
- **Content**:
  ```json
  {
    "success": true,
    "count": 2,
    "data": [
      {
        "_id": "60d21b4667d0d8992e610c85",
        "title": "Complete project proposal",
        "description": "Write up the proposal for the new client project",
        "status": "in-progress",
        "priority": "high",
        "dueDate": "2023-07-30T00:00:00.000Z",
        "createdBy": {
          "_id": "60d21b4667d0d8992e610c80",
          "name": "John Doe"
        },
        "createdAt": "2023-07-01T15:30:45.123Z",
        "updatedAt": "2023-07-15T09:45:22.456Z"
      },
      {
        "_id": "60d21b4667d0d8992e610c86",
        "title": "Client meeting",
        "description": "Preparation for the client meeting",
        "status": "pending",
        "priority": "medium",
        "dueDate": "2023-08-05T00:00:00.000Z",
        "createdBy": {
          "_id": "60d21b4667d0d8992e610c80",
          "name": "John Doe"
        },
        "createdAt": "2023-07-10T11:20:15.789Z",
        "updatedAt": "2023-07-10T11:20:15.789Z"
      }
    ]
  }
  ```

### Get Single Task

Retrieves a specific task by ID.

- **URL**: `/api/tasks/:id`
- **Method**: `GET`
- **Auth Required**: Yes
- **URL Parameters**: 
  - `id`: Task ID

#### Success Response

- **Code**: 200
- **Content**:
  ```json
  {
    "success": true,
    "data": {
      "_id": "60d21b4667d0d8992e610c85",
      "title": "Complete project proposal",
      "description": "Write up the proposal for the new client project",
      "status": "in-progress",
      "priority": "high",
      "dueDate": "2023-07-30T00:00:00.000Z",
      "createdBy": {
        "_id": "60d21b4667d0d8992e610c80",
        "name": "John Doe"
      },
      "subtasks": [
        {
          "_id": "60d21b4667d0d8992e610c90",
          "title": "Research competitors",
          "status": "completed"
        }
      ],
      "dependencies": [
        {
          "_id": "60d21b4667d0d8992e610c91",
          "title": "Client requirements gathering",
          "status": "completed"
        }
      ],
      "createdAt": "2023-07-01T15:30:45.123Z",
      "updatedAt": "2023-07-15T09:45:22.456Z"
    }
  }
  ```

#### Error Response

- **Code**: 404
- **Content**:
  ```json
  {
    "success": false,
    "message": "Task not found"
  }
  ```

### Create Task

Creates a new task.

- **URL**: `/api/tasks`
- **Method**: `POST`
- **Auth Required**: Yes
- **Data Constraints**:
  ```json
  {
    "title": "[required] String between 3-100 characters",
    "description": "[optional] String",
    "status": "[optional] String: 'pending', 'in-progress', 'completed', 'cancelled', 'deferred'",
    "priority": "[optional] String: 'low', 'medium', 'high'",
    "dueDate": "[optional] Date in ISO format (YYYY-MM-DD)",
    "project": "[optional] Valid project ID",
    "assignedTo": "[optional] Valid user ID",
    "tags": "[optional] Array of strings"
  }
  ```

#### Success Response

- **Code**: 201
- **Content**:
  ```json
  {
    "success": true,
    "message": "Task created successfully",
    "data": {
      "_id": "60d21b4667d0d8992e610c85",
      "title": "Complete project proposal",
      "description": "Write up the proposal for the new client project",
      "status": "pending",
      "priority": "high",
      "dueDate": "2023-07-30T00:00:00.000Z",
      "createdBy": "60d21b4667d0d8992e610c80",
      "createdAt": "2023-07-01T15:30:45.123Z",
      "updatedAt": "2023-07-01T15:30:45.123Z"
    }
  }
  ```

#### Error Response

- **Code**: 400
- **Content**:
  ```json
  {
    "success": false,
    "message": "Validation failed",
    "errors": [
      {
        "field": "title",
        "message": "Title is required"
      }
    ]
  }
  ```

### Update Task

Updates an existing task.

- **URL**: `/api/tasks/:id`
- **Method**: `PUT`
- **Auth Required**: Yes
- **URL Parameters**: 
  - `id`: Task ID
- **Data Constraints**: Same as create task, all fields optional

#### Success Response

- **Code**: 200
- **Content**:
  ```json
  {
    "success": true,
    "message": "Task updated successfully",
    "data": {
      "_id": "60d21b4667d0d8992e610c85",
      "title": "Complete revised project proposal",
      "description": "Write up the proposal for the new client project with additional requirements",
      "status": "in-progress",
      "priority": "high",
      "dueDate": "2023-08-05T00:00:00.000Z",
      "createdBy": "60d21b4667d0d8992e610c80",
      "createdAt": "2023-07-01T15:30:45.123Z",
      "updatedAt": "2023-07-15T09:45:22.456Z"
    }
  }
  ```

### Delete Task

Deletes a specific task.

- **URL**: `/api/tasks/:id`
- **Method**: `DELETE`
- **Auth Required**: Yes
- **URL Parameters**: 
  - `id`: Task ID

#### Success Response

- **Code**: 200
- **Content**:
  ```json
  {
    "success": true,
    "message": "Task deleted successfully",
    "data": {}
  }
  ```

### Update Task Status

Updates only the status of a task.

- **URL**: `/api/tasks/:id/status`
- **Method**: `PUT`
- **Auth Required**: Yes
- **URL Parameters**: 
  - `id`: Task ID
- **Data Constraints**:
  ```json
  {
    "status": "[required] String: 'pending', 'in-progress', 'completed', 'cancelled', 'deferred'"
  }
  ```

#### Success Response

- **Code**: 200
- **Content**:
  ```json
  {
    "success": true,
    "message": "Task status updated to completed",
    "data": {
      "_id": "60d21b4667d0d8992e610c85",
      "title": "Complete project proposal",
      "status": "completed",
      "updatedAt": "2023-07-20T14:25:10.789Z"
    }
  }
  ```

### Add Subtask

Adds a subtask to an existing task.

- **URL**: `/api/tasks/:id/subtasks`
- **Method**: `POST`
- **Auth Required**: Yes
- **URL Parameters**: 
  - `id`: Parent task ID
- **Data Constraints**: Similar to create task

#### Success Response

- **Code**: 201
- **Content**:
  ```json
  {
    "success": true,
    "message": "Subtask added successfully",
    "data": {
      "_id": "60d21b4667d0d8992e610c90",
      "title": "Research competitors",
      "description": "Analyze competitor products and services",
      "status": "pending",
      "priority": "medium",
      "parentTask": "60d21b4667d0d8992e610c85",
      "createdBy": "60d21b4667d0d8992e610c80",
      "createdAt": "2023-07-05T10:15:30.456Z",
      "updatedAt": "2023-07-05T10:15:30.456Z"
    }
  }
  ```

### Add Dependency

Adds a dependency relationship between tasks.

- **URL**: `/api/tasks/:id/dependencies`
- **Method**: `POST`
- **Auth Required**: Yes
- **URL Parameters**: 
  - `id`: Task ID
- **Data Constraints**:
  ```json
  {
    "dependencyId": "[required] Valid task ID"
  }
  ```

#### Success Response

- **Code**: 200
- **Content**:
  ```json
  {
    "success": true,
    "message": "Dependency added successfully",
    "data": {
      "_id": "60d21b4667d0d8992e610c85",
      "title": "Complete project proposal",
      "dependencies": ["60d21b4667d0d8992e610c91"],
      "updatedAt": "2023-07-12T16:40:22.123Z"
    }
  }
  ```

#### Error Response

- **Code**: 400
- **Content**:
  ```json
  {
    "success": false,
    "message": "Cannot add circular dependency"
  }
  ``` 