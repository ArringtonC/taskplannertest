# Task Planner Frontend Architecture

This document provides an overview of the Task Planner frontend architecture, including component structure, state management, and data flow.

## System Architecture

```mermaid
graph TD
    App[App Component] --> Router[React Router]
    Router --> Pages[Page Components]
    Pages --> Components[UI Components]
    Components --> Hooks[Custom Hooks]
    Hooks --> Context[Context API]
    Context --> API[API Service]
    API -->|HTTP| Backend[Backend API]
    
    %% Component dependencies
    Components --> Utils[Utility Functions]
    Pages --> Utils
    
    %% Style connections
    Components --> Styles[Tailwind CSS]
    Pages --> Styles
```

## Component Structure

```mermaid
graph TD
    App[App.tsx] --> Router[Router]
    Router --> Dashboard[Dashboard.tsx]
    Router --> MonthlyMapper[MonthlyMapper.tsx]
    
    %% Dashboard components
    Dashboard --> TaskList[TaskList.tsx]
    Dashboard --> TaskForm[TaskForm.tsx]
    TaskList --> TaskCard[TaskCard.tsx]
    TaskList --> TaskRow[TaskRow.tsx]
    
    %% Monthly Mapper components
    MonthlyMapper --> MonthCalendar[MonthCalendar.tsx]
    MonthCalendar --> MonthCell[MonthCell.tsx]
    MonthCell --> TaskItem[TaskItem.tsx]
    
    %% Shared components
    Dashboard --> ComplexityIndicator[ComplexityIndicator.tsx]
    MonthlyMapper --> ComplexityIndicator
```

## State Management

```mermaid
graph TD
    App[App Component] --> TaskProvider[TaskProvider Context]
    TaskProvider --> TaskReducer[Task Reducer]
    TaskReducer -->|Dispatch| TaskActions[Task Actions]
    TaskActions -->|API Calls| TaskService[Task API Service]
    TaskService -->|HTTP| Backend[Backend API]
    
    %% Context consumption
    Dashboard[Dashboard] -->|useContext| TaskProvider
    MonthlyMapper[MonthlyMapper] -->|useContext| TaskProvider
    
    %% Custom hooks
    useTasks[useTasks Hook] --> TaskProvider
    Dashboard -->|useTasks| useTasks
    MonthlyMapper -->|useTasks| useTasks
```

## Data Flow

```mermaid
sequenceDiagram
    participant User
    participant Component as React Component
    participant Hook as Custom Hook
    participant Context as Context Provider
    participant Service as API Service
    participant Backend as Backend API

    User->>Component: Interaction (click, input)
    Component->>Hook: Call custom hook method
    Hook->>Context: Dispatch action
    Context->>Service: API method call
    Service->>Backend: HTTP Request
    Backend->>Service: HTTP Response
    Service->>Context: Update state
    Context->>Component: Re-render with new state
    Component->>User: Updated UI
```

## Utility Functions

```mermaid
graph TD
    Utils[Utility Functions] --> GroupByMonth[groupByMonth.ts]
    Utils --> IsOverloaded[isOverloaded.ts]
    Utils --> ComplexityStats[complexityStats.ts]
    Utils --> SplitComplexity[splitComplexity.ts]
    
    %% Function relationships
    GroupByMonth --> IsOverloaded
    GroupByMonth --> ComplexityStats
    ComplexityStats --> SplitComplexity
    
    %% Consumption
    MonthlyMapper[MonthlyMapper.tsx] --> GroupByMonth
    MonthlyMapper --> IsOverloaded
    MonthlyMapper --> ComplexityStats
    Dashboard[Dashboard.tsx] --> SplitComplexity
```

## Task Analysis Flow

```mermaid
flowchart TD
    TaskData[Raw Task Data] --> GroupByMonth[Group Tasks by Month]
    GroupByMonth --> MonthlyGroups[Monthly Task Groups]
    
    MonthlyGroups --> OverloadDetection[Detect Overloaded Months]
    MonthlyGroups --> ComplexityCalc[Calculate Complexity Stats]
    
    OverloadDetection --> UI[UI Visualization]
    ComplexityCalc --> UI
    
    UI --> UserAction[User Action]
    UserAction --> SplitTask[Task Splitting]
    SplitTask --> TaskData
```

## Component Lifecycle

```mermaid
sequenceDiagram
    participant Component
    participant Context
    participant API
    
    Component->>Component: Mount
    Component->>Context: Read initial state
    Component->>API: Fetch data (useEffect)
    API->>Context: Update state with data
    Context->>Component: Re-render with new data
    
    loop User Interaction
        Component->>Context: Dispatch action
        Context->>API: API call if needed
        API->>Context: Update state with response
        Context->>Component: Re-render with updated state
    end
    
    Component->>Component: Unmount (cleanup)
```

## Environment Configuration

The frontend requires the following environment variables:
- `VITE_API_URL` - Backend API URL

## Build and Deployment Flow

```mermaid
flowchart TD
    Source[Source Code] --> Build[Vite Build]
    Build --> Static[Static Assets]
    Static --> Deploy[Deployment]
    Deploy --> CDN[Content Delivery Network]
    CDN --> Browser[User Browser]
    
    %% Environment configuration
    EnvDev[Development .env] --> DevServer[Development Server]
    EnvProd[Production .env] --> Build
```

This architecture document provides a high-level overview of the Task Planner frontend system. For more detailed implementation information, refer to the codebase and inline documentation. 