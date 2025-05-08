# Task Planner Integration Test Plan

This document outlines the manual tests to verify the complete flow from UI interaction to database update and back.

## Prerequisites

1. Backend server running on http://localhost:3001
2. Frontend development server running on http://localhost:5173
3. MongoDB instance running on localhost (default port)

## Test Cases

### 1. Task Listing Flow

**Steps:**
1. Navigate to Dashboard page (http://localhost:5173/)
2. Observe the initial loading spinner
3. Verify tasks are displayed after loading completes

**Expected Results:**
- Loading spinner appears briefly
- Tasks are displayed in either table or card view
- Task count statistics are updated correctly

### 2. Task Creation Flow

**Steps:**
1. Click "Add Task" button
2. Fill out form with test data:
   - Title: "Test Integration Task"
   - Description: "This is a test task created during integration testing"
   - Priority: "Medium"
   - Status: "Pending"
   - Due Date: Select a date next month
3. Click "Create Task" button

**Expected Results:**
- Loading indicator displays during API call
- New task appears in task list after form submission
- Task count statistics update correctly
- Backend database contains the new task with correct data

### 3. Task Update Flow

**Steps:**
1. Find the task created in Test Case 2
2. Click the edit (pencil) icon
3. Modify title to "Updated Integration Task"
4. Change priority to "High"
5. Click "Update Task" button

**Expected Results:**
- Loading indicator displays during API call
- Task in list updates with new information
- Backend database reflects the changes

### 4. Task Delete Flow

**Steps:**
1. Find the task updated in Test Case 3
2. Click the delete (trash) icon
3. Confirm deletion in the dialog

**Expected Results:**
- Confirmation dialog appears
- Loading indicator displays during API call
- Task is removed from the list
- Task count statistics update correctly
- Backend database no longer contains the task

### 5. Monthly Mapper View Flow

**Steps:**
1. Click "Next: Monthly Mapper" button in Dashboard footer
2. Observe the loading of the Monthly Mapper page
3. Create a new task with a due date in a specific month
4. Navigate back to the Dashboard and then back to the Monthly Mapper

**Expected Results:**
- Monthly grid displays correctly
- Tasks are grouped by their due date month
- Overloaded months (>4 tasks) show the orange indicator
- The new task appears in the correct month cell

### 6. Error Handling Flow

**Steps:**
1. Temporarily stop the backend server
2. Try to create a new task
3. Try to fetch tasks by refreshing the page
4. Restart the backend server
5. Refresh the page

**Expected Results:**
- Appropriate error messages display when actions fail
- UI remains responsive and doesn't crash
- After server restart, application recovers and displays tasks

## Additional Verification

1. Check browser console for any unexpected errors
2. Verify CORS is properly configured by examining Network tab in browser DevTools
3. Confirm all API calls use the correct API_BASE_URL from environment variables
4. Verify JWT token handling if authentication is implemented

## Test Results

Document any issues found during testing in this section.

### Issues Found

| Issue | Description | Status |
|-------|-------------|--------|
|       |             |        |
|       |             |        |
|       |             |        | 