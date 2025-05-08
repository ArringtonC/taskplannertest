# TaskMapper MVP Tasks

> **Note:** The goal is to achieve 90%-accuracy tasks—focus on actionable, good-enough steps rather than high-precision or perfect decisions. Iterate and improve as needed.

## UI/UX & Frontend

### Start Now
- [ ] Scaffold React app with Tailwind CSS and React Router
- [ ] Design rough wireframes for all pages
- [ ] Dashboard page
  - [ ] List all tasks in table/card view
  - [ ] Add task form/modal (title, complexity, dueDate)
  - [ ] Edit task functionality
  - [ ] Delete task functionality
  - [ ] "Next" button to Monthly Mapper
- [ ] Monthly Mapper page
  - [ ] 12-month calendar grid
  - [ ] Place tasks by due month (using seed data)
  - [ ] Highlight overloaded months (threshold >4 tasks)
  - [ ] "Analyze Size" and "Back" buttons

### Stub/Defer (Phase 2)
- [ ] Complexity Checker page
  - [ ] List tasks by complexity
  - [ ] Split tasks >4 into subtasks
  - [ ] Combine/mark tasks <4 as OK
  - [ ] Form for subtasks (title, complexity, due date)
  - [ ] "Next" and "Back" buttons
- [ ] Re-Planner page
  - [ ] Updated monthly mapping including subtasks
  - [ ] Drag-and-drop tasks among months
  - [ ] Save changes and return to Dashboard

## State Management

### Start Now
- [ ] Set up React Context + useReducer for global task state

## Backend & API

### Start Now
- [ ] Scaffold Node.js/Express backend
- [ ] Define Task model (id, title, complexity 1–8, dueDate, parentId)
- [ ] Implement RESTful CRUD endpoints (Create/Read/Update/Delete)
- [ ] Add validation (complexity 1–8, ISO date format)
- [ ] Connect to MongoDB or PostgreSQL

### Stub/Defer (Phase 2)
- [ ] Split & Combine endpoints (front end can orchestrate via multiple CRUD calls for now)

## Data & Testing

### Start Now
- [ ] Create sample data seed script (~10 tasks across months & complexity levels)
- [ ] Write unit tests for:
  - [ ] Task complexity-splitting logic
  - [ ] Monthly grouping (calendar placement) logic

### Stub/Defer
- [ ] API endpoint tests (wait until model and routes stabilize)

## Documentation

### Start Now
- [ ] Update README with setup & run instructions ("git clone → npm install → npm run dev")

### Stub/Defer
- [ ] Write OpenAPI/Swagger spec for API (auto-generate once endpoints are stable)

---

*This list should be updated as the project evolves. Prioritize progress and iteration over perfection—90% accuracy is the target.* 