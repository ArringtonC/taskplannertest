import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTasks } from '../hooks';
import { Task } from '../context/taskState';
import TaskList from '../components/Task/TaskList';
import Modal from '../components/Modal';
import TaskForm from '../components/TaskForm';
import ConfirmDialog from '../components/ConfirmDialog';
import { calculateAverageComplexity } from '../utils/complexityStats';
import { PlusIcon } from "lucide-react";
import Button from '../components/Button';
import PageLayout from '../components/PageLayout';
import EmptyState from '../components/EmptyState';
import { toast } from 'sonner';
import type { TaskFormData } from '../components/TaskForm';

/**
 * Dashboard page component
 * Shows task management interface with list/card toggle view
 */
const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const {
    tasks,
    loading,
    error,
    deleteTask,
    refreshTasks,
    getTaskCountsByStatus,
    clearError,
  } = useTasks();

  // Always display the real tasks from the API
  const displayTasks = tasks;

  // View type state (table or card)
  const [viewType, setViewType] = useState<'table' | 'card'>('table');

  // Modal states
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  // Selected task for edit/delete
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  // Get task statistics
  const taskCounts = getTaskCountsByStatus();

  // Calculate complexity average
  const averageComplexity = calculateAverageComplexity(tasks);

  // Search and filter state
  const [searchText, setSearchText] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [priorityFilter, setPriorityFilter] = useState<string>("");

  // Filtered tasks based on search and filters
  const filteredTasks = displayTasks.filter((task) => {
    const matchesSearch =
      task.title.toLowerCase().includes(searchText.toLowerCase()) ||
      (task.description?.toLowerCase().includes(searchText.toLowerCase()) ?? false);
    const matchesStatus = statusFilter ? task.status === statusFilter : true;
    const matchesPriority = priorityFilter ? task.priority === priorityFilter : true;
    return matchesSearch && matchesStatus && matchesPriority;
  });

  // Modal handlers
  const handleAddTask = () => {
    setEditingTask(null);
    setIsFormOpen(true);
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setIsFormOpen(true);
  };

  const closeForm = () => {
    setEditingTask(null);
    setIsFormOpen(false);
  };

  // Delete task handlers
  const handleDeleteTask = (id: string) => {
    const task = tasks.find(t => t._id === id) || null;
    setSelectedTask(task);
    setIsDeleteDialogOpen(true);
  };

  const closeDeleteDialog = () => {
    setSelectedTask(null);
    setIsDeleteDialogOpen(false);
  };

  const confirmDeleteTask = async () => {
    if (selectedTask) {
      try {
        await deleteTask(selectedTask._id);
        await refreshTasks();
        closeDeleteDialog();
      } catch (error) {
        console.error('Error deleting task:', error);
      }
    }
  };

  // Handle retry when tasks fail to load
  const handleRetry = () => {
    refreshTasks().catch((error) =>
      console.error('Error retrying task fetch:', error)
    );
  };

  // Save handler
  const handleSaveTask = async (data: TaskFormData) => {
    try {
      if (editingTask) {
        // Update
        // You may want to call an API or update state here
        toast.success('Task updated successfully');
      } else {
        // Add
        // You may want to call an API or update state here
        toast.success('Task created successfully');
      }
      closeForm();
      await refreshTasks();
    } catch (error) {
      toast.error('Error saving task');
    }
  };

  // Render dashboard actions
  const dashboardActions = (
    <div className="flex justify-center mb-6">
      <div className="inline-flex rounded-md bg-gray-800 p-1">
        <Button
          variant={viewType === "table" ? "primary" : "ghost"}
          className={
            viewType === "table"
              ? "bg-gray-700"
              : "bg-transparent text-gray-300"
          }
          onClick={() => setViewType("table")}
        >
          Table
        </Button>
        <Button
          variant={viewType === "card" ? "primary" : "ghost"}
          className={
            viewType === "card"
              ? "bg-gray-700"
              : "bg-transparent text-gray-300"
          }
          onClick={() => setViewType("card")}
        >
          Cards
        </Button>
        <Button
          className="bg-blue-600 hover:bg-blue-700 text-white ml-2"
          onClick={() => navigate('/add-task')}
        >
          <PlusIcon className="h-4 w-4 mr-1" />
          Add Task
        </Button>
      </div>
    </div>
  );

  // Render footer actions
  const footerActions = (
    <div className="flex space-x-2">
      <Button
        variant="primary"
        onClick={() => {
          navigate('/dependencies');
        }}
      >
        View Dependency Graph
      </Button>

      <Button
        variant="secondary"
        onClick={() => {
          navigate('/monthly');
        }}
      >
        Monthly Mapper
      </Button>
    </div>
  );

  return (
    <PageLayout
      title="Task Planner Dashboard"
      subtitle={`${displayTasks.length} ${displayTasks.length === 1 ? 'task' : 'tasks'} total`}
      actions={dashboardActions}
      footerActions={footerActions}
    >
      {/* Tab bar separator */}
      <hr className="mb-4 border-gray-300" />

      {/* Loading state */}
      {loading && !error && (
        <div className="flex justify-center items-center p-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      )}

      {/* Error state */}
      {error && (
        <EmptyState
          title="Error Loading Tasks"
          message={`There was an error loading your tasks: ${error}`}
          actionText="Try Again"
          onAction={handleRetry}
          icon={
            <svg
              className="w-16 h-16 text-red-500 mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          }
        />
      )}

      {/* Empty state */}
      {!loading && !error && displayTasks.length === 0 && (
        <EmptyState
          title="No Tasks Found"
          message="There are no tasks to display. Create a new task to get started!"
          actionText="Add Your First Task"
          onAction={() => {
            navigate('/add-task');
          }}
        />
      )}

      {/* Search and filter bar */}
      <div className="flex flex-col md:flex-row md:items-center md:space-x-4 mb-4 gap-2">
        <label htmlFor="search" className="sr-only">Search Tasks</label>
        <input
          id="search"
          type="text"
          placeholder="Search tasks..."
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          className="w-full md:w-1/3 px-3 py-2 rounded-md border border-gray-600 bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          aria-label="Search tasks"
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="w-full md:w-40 px-3 py-2 rounded-md border border-gray-600 bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          aria-label="Filter by status"
        >
          <option value="">All Statuses</option>
          <option value="pending">Pending</option>
          <option value="in-progress">In Progress</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
          <option value="deferred">Deferred</option>
        </select>
        <select
          value={priorityFilter}
          onChange={(e) => setPriorityFilter(e.target.value)}
          className="w-full md:w-40 px-3 py-2 rounded-md border border-gray-600 bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          aria-label="Filter by priority"
        >
          <option value="">All Priorities</option>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
      </div>

      {/* Task list */}
      {!loading && !error && filteredTasks.length > 0 && (
        <TaskList
          tasks={filteredTasks}
          onEdit={handleEditTask}
          onDelete={handleDeleteTask}
          onAddTask={handleAddTask}
        />
      )}

      {/* Empty state for filtered results */}
      {!loading && !error && filteredTasks.length === 0 && displayTasks.length > 0 && (
        <EmptyState
          title="No Tasks Match Your Filters"
          message="Try adjusting your search or filter criteria."
        />
      )}

      {/* Add/Edit Task Modal */}
      <TaskForm
        isOpen={isFormOpen}
        onClose={closeForm}
        onSave={handleSaveTask}
        editingTask={editingTask || undefined}
      />

      {/* Delete Confirmation Dialog */}
      {selectedTask && (
        <ConfirmDialog
          isOpen={isDeleteDialogOpen}
          onClose={closeDeleteDialog}
          onConfirm={confirmDeleteTask}
          title="Delete Task"
          message={`Are you sure you want to delete "${selectedTask.title}"? This action cannot be undone.`}
          confirmText="Delete"
          cancelText="Cancel"
        />
      )}
    </PageLayout>
  );
};

export default Dashboard;
