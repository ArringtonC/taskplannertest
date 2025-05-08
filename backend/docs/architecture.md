# Task Planner Backend Architecture

This document provides an overview of the Task Planner backend architecture, including component structure and data flow.

## System Architecture

```mermaid
graph TD
    Client[Frontend Client] -->|HTTP Requests| Server[Express Server]
    Server --> Router[API Routes]
    Router --> TaskController[Task Controllers]
    TaskController --> Middleware[Validation Middleware]
    TaskController --> Models[Mongoose Models]
    Models --> MongoDB[(MongoDB Database)]
    
    %% Authentication flow
    Router --> AuthMiddleware[Auth Middleware]
    AuthMiddleware --> TaskController
    
    %% Error handling
    TaskController --> ErrorHandler[Error Handling Middleware]
    ErrorHandler --> Server
    
    %% Seed data
    SeedScript[Seed Script] --> Models
```

## Component Details

### API Routes
- **Purpose**: Define the API endpoints and route requests to appropriate controllers
- **File Location**: `/routes/taskRoutes.js`

### Controllers
- **Purpose**: Handle business logic, process requests, and return responses
- **File Location**: `/controllers/taskController.js`
- **Key Functions**: 
  - `getAllTasks`
  - `getTaskById` 
  - `createTask`
  - `updateTask`
  - `deleteTask`

### Models
- **Purpose**: Define data schemas and database interaction
- **File Location**: `/models/Task.js`
- **Schema**: 
  - `title` - String (required)
  - `complexity` - Number (1-8)
  - `dueDate` - Date
  - `parentId` - ObjectId reference

### Middleware
- **Purpose**: Handle validation, authentication, and error processing
- **File Locations**: 
  - `/middleware/validation.js`
  - `/middleware/auth.js`
  - `/middleware/errorHandler.js`

## Data Flow

```mermaid
sequenceDiagram
    participant Client as Frontend Client
    participant Server as Express Server
    participant Auth as Auth Middleware
    participant Controller as Task Controller
    participant Model as Task Model
    participant DB as MongoDB

    Client->>Server: HTTP Request
    Server->>Auth: Validate Authentication
    Auth->>Controller: Process Request
    Controller->>Model: Data Operation
    Model->>DB: Execute Query
    DB->>Model: Return Results
    Model->>Controller: Return Data
    Controller->>Server: Format Response
    Server->>Client: HTTP Response
```

## Database Design

```mermaid
erDiagram
    TASK {
        ObjectId id PK
        String title
        Number complexity
        Date dueDate
        ObjectId parentId FK
        ObjectId createdBy FK
        String status
        Date createdAt
        Date updatedAt
    }
    USER {
        ObjectId id PK
        String name
        String email
        String password
    }
    
    TASK ||--o{ TASK : "parent_of"
    USER ||--o{ TASK : "creates"
```

## Environment Configuration

The backend requires the following environment variables:
- `PORT` - Server port (default: 5000)
- `MONGO_URI` - MongoDB connection string
- `NODE_ENV` - Environment (development, production)
- `CORS_ORIGIN` - CORS allowed origin

## Deployment Architecture

```mermaid
flowchart TD
    Client[Browser] -->|HTTPS| LoadBalancer[Load Balancer]
    LoadBalancer -->|HTTP| ServerInstance1[Server Instance 1]
    LoadBalancer -->|HTTP| ServerInstance2[Server Instance 2]
    ServerInstance1 -->|Connection| MongoDB[(MongoDB Atlas)]
    ServerInstance2 -->|Connection| MongoDB
```

This architecture document provides a high-level overview of the Task Planner backend system. For more detailed implementation information, refer to the codebase and inline documentation. 