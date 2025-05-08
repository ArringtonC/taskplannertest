# Task Planner UI Sequence Diagram

## Fixed Data Loading Flow

```mermaid
sequenceDiagram
    participant User
    participant Dashboard
    participant useTasks Hook
    participant useTaskApi Hook
    participant TaskService
    participant Backend API
    participant TaskContext

    User->>Dashboard: Navigates to Dashboard
    Dashboard->>useTasks Hook: Component mounts
    Note over useTasks Hook: useEffect with empty dependency array []
    useTasks Hook->>useTaskApi Hook: fetchTasks()
    useTaskApi Hook->>TaskContext: setLoading(true)
    useTaskApi Hook->>TaskService: getAllTasks()
    TaskService->>Backend API: fetch('/api/tasks')
    
    alt Successful API Response
        Backend API-->>TaskService: Tasks data
        TaskService-->>useTaskApi Hook: Return tasks
        useTaskApi Hook->>TaskContext: clearError()
        useTaskApi Hook->>TaskContext: setTasks(tasks)
        useTaskApi Hook->>TaskContext: setLoading(false)
        useTaskApi Hook-->>useTasks Hook: Return tasks
        useTasks Hook-->>Dashboard: Update with tasks
        Dashboard-->>User: Render task list
    else Network/API Error
        Backend API-->>TaskService: Error response
        TaskService-->>useTaskApi Hook: Throw error
        useTaskApi Hook->>TaskContext: setError(message)
        useTaskApi Hook->>TaskContext: setLoading(false)
        useTaskApi Hook-->>useTasks Hook: Return existing tasks
        useTasks Hook-->>Dashboard: Show error state
        Dashboard-->>User: Render error message with retry option
    end

    User->>Dashboard: Clicks "Retry"
    Dashboard->>useTasks Hook: handleRetry()
    useTasks Hook->>useTaskApi Hook: fetchTasks()
    Note right of useTaskApi Hook: Retry flow follows same path as initial load
```

## Problem: Previous Flow (Flashing Issue)

```mermaid
sequenceDiagram
    participant User
    participant Dashboard
    participant useTasks Hook
    participant useTaskApi Hook
    participant TaskService
    participant Backend API
    participant TaskContext

    User->>Dashboard: Navigates to Dashboard
    Dashboard->>useTasks Hook: Component mounts
    Note over useTasks Hook: useEffect with dependency [refreshTasks]
    useTasks Hook->>useTaskApi Hook: fetchTasks()
    useTaskApi Hook->>TaskContext: setLoading(true)
    useTaskApi Hook->>TaskContext: clearError() 
    Note over useTaskApi Hook: Immediately clearing error on every attempt
    useTaskApi Hook->>TaskService: getAllTasks()
    TaskService->>Backend API: fetch('/api/tasks')
    
    alt Successful API Response
        Backend API-->>TaskService: Tasks data
        TaskService-->>useTaskApi Hook: Return tasks
        useTaskApi Hook->>TaskContext: setTasks(tasks)
        useTaskApi Hook->>TaskContext: setLoading(false)
        useTaskApi Hook-->>useTasks Hook: Return tasks
        useTasks Hook-->>Dashboard: Update with tasks
        Dashboard-->>User: Render task list
    else Network/API Error
        Backend API-->>TaskService: Error response
        TaskService-->>useTaskApi Hook: Throw error
        useTaskApi Hook->>TaskContext: setError(message)
        useTaskApi Hook->>TaskContext: setLoading(false)
        useTaskApi Hook-->>useTasks Hook: Return empty array []
        Note over useTasks Hook: Component re-renders, triggering useEffect again
        useTasks Hook->>useTaskApi Hook: fetchTasks() repeats
        Note over User: UI rapidly flashes between error and loading states
    end
```

## Key Improvements

1. **One-time loading**: Using an empty dependency array `[]` in the `useEffect` hook ensures data is fetched only once when the component mounts.

2. **Persistent error handling**: Only clearing error state on successful responses, not at the start of fetch attempts.

3. **Return existing data on error**: Returning current state instead of empty arrays when errors occur prevents UI from wiping existing data.

4. **Manual retry flow**: Adding a dedicated retry button that users must explicitly click to attempt refetching data.

5. **Better error messages**: Improved network error handling with clear user-friendly messages.

6. **Proper API URL**: Setting the correct API base URL to ensure connections can be established. 