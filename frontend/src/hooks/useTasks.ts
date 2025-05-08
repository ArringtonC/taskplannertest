import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTaskApi } from '../api/useTaskApi';
import { TaskFilters } from '../api/taskService';
import { TaskStatus, TaskPriority, Task } from '../context/taskState';
import { useAuth } from '../context/AuthContext';

/**
 * Interface for creating a new task
 */
interface NewTask {
  title: string;
  description?: string;
  complexity?: string;
  status?: TaskStatus;
  priority?: TaskPriority;
  dueDate?: string;
}

// Sample test data for offline development
const SAMPLE_TASKS: Task[] = [
  {
    _id: 'sample1',
    title: 'Sample Task 1',
    description: 'This is a sample task for testing',
    status: 'pending' as const,
    priority: 'medium' as const,
    complexity: 3,
    dueDate: '2025-06-01',
    dependencies: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    createdBy: 'test-user',
  },
  {
    _id: 'sample2',
    title: 'Sample Task 2',
    description: 'Another sample task for testing',
    status: 'in-progress' as const,
    priority: 'high' as const,
    complexity: 5,
    dueDate: '2025-06-15',
    dependencies: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    createdBy: 'test-user',
  },
];

/**
 * Helper to map string complexity to number for Task type
 */
function mapComplexityStringToNumber(complexity?: string): number {
  switch (complexity) {
    case 'simple': return 1;
    case 'moderate': return 3;
    case 'complex': return 5;
    default: return 3;
  }
}

/**
 * Helper to map number complexity to string for API
 */
function mapComplexityNumberToString(complexity?: number): string {
  if (complexity === 1) return 'simple';
  if (complexity === 3) return 'moderate';
  if (complexity === 5) return 'complex';
  return 'moderate';
}

/**
 * A custom hook that provides a simplified interface for task operations.
 * It combines the task context and API service functionality.
 */
export const useTasks = () => {
  const navigate = useNavigate();
  const { token, logout } = useAuth();

  // Global flag for using test data instead of API
  // Default to false to use real API data
  const [useTestData, setUseTestData] = useState(false);

  const {
    loading,
    error,
    tasks,
    filteredTasks,
    selectedTask,
    fetchTasks: apiFetchTasks,
    fetchTaskById: apiFetchTaskById,
    createTask: apiCreateTask,
    updateTaskById: apiUpdateTaskById,
    deleteTaskById: apiDeleteTaskById,
    updateTaskStatus: apiUpdateTaskStatus,
    addSubtask: apiAddSubtask,
    addDependency: apiAddDependency,
    selectTask,
    clearSelectedTask,
    clearError,
    setTasks,
  } = useTaskApi();

  /**
   * Handle authentication errors
   */
  const handleAuthError = useCallback(
    (errorMessage: string) => {
      if (
        errorMessage.includes('No token') ||
        errorMessage.includes('Not authorized') ||
        errorMessage.includes('Unauthorized') ||
        errorMessage.includes('jwt expired')
      ) {
        console.log(
          'Authentication error detected, logging out:',
          errorMessage
        );
        logout();
        navigate('/login');
        return true;
      }
      return false;
    },
    [logout, navigate]
  );

  // Set sample tasks on load if using test data
  useEffect(() => {
    if (useTestData) {
      console.log('Using sample test data instead of API');
      setTasks(SAMPLE_TASKS);
      clearError();
    }
  }, [useTestData, setTasks, clearError]);

  // Only one effect, runs once per hook mount
  useEffect(() => {
    refreshTasks();
  }, []);

  /**
   * Toggle between test data and API data
   */
  const toggleTestData = useCallback(() => {
    setUseTestData((prev) => !prev);
    clearError();

    // If switching to test data, set sample tasks
    if (!useTestData) {
      setTasks(SAMPLE_TASKS);
    } else {
      // If switching to API, fetch tasks
      apiFetchTasks().catch((err) => {
        console.error('Error fetching tasks after toggle:', err);
        // Switch back to test data on error
        setUseTestData(true);
        setTasks(SAMPLE_TASKS);
      });
    }
  }, [useTestData, apiFetchTasks, setTasks, clearError]);

  /**
   * Safely fetch tasks with test data fallback
   */
  const fetchTasks = useCallback(
    async (filters?: TaskFilters): Promise<Task[]> => {
      // Always try API first unless explicitly using test data
      if (useTestData) {
        return Promise.resolve(SAMPLE_TASKS);
      }

      try {
        const apiTasks = await apiFetchTasks(filters);
        return apiTasks;
      } catch (error) {
        console.error('Error fetching tasks:', error);

        // Get error message
        const errorMessage =
          error instanceof Error
            ? error.message
            : typeof error === 'object' && error !== null && 'message' in error
              ? String(error.message)
              : String(error);

        // Handle auth errors
        if (handleAuthError(errorMessage)) {
          return [];
        }

        // Only fall back to test data for connection errors
        if (errorMessage.includes('connect')) {
          console.log('Falling back to test data due to connection error');
          setUseTestData(true);
          setTasks(SAMPLE_TASKS);
          return SAMPLE_TASKS;
        }

        // For other errors, propagate them up
        throw error;
      }
    },
    [useTestData, apiFetchTasks, setTasks, setUseTestData, handleAuthError]
  );

  /**
   * Add a new task
   * @param newTask The task data to create
   */
  const addTask = useCallback(
    async (newTask: NewTask) => {
      if (useTestData) {
        // Create a mock task with a unique ID
        const mockTask: Task = {
          _id: `sample${Date.now()}`,
          title: newTask.title,
          description: newTask.description || '',
          status: newTask.status || 'pending',
          priority: newTask.priority || 'medium',
          complexity: mapComplexityStringToNumber(newTask.complexity),
          dueDate: newTask.dueDate || '',
          dependencies: [],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          createdBy: 'test-user',
        };

        // Add to sample tasks
        const updatedTasks = [...tasks, mockTask];
        setTasks(updatedTasks);
        console.log('Task added (test data):', mockTask);
        return mockTask;
      }

      try {
        const task = await apiCreateTask(newTask);
        console.log('Task created:', task);
        // After adding, re-fetch the latest tasks
        const updatedTasks = await fetchTasks();
        setTasks(updatedTasks);
        console.log('Tasks after addTask:', updatedTasks);
        return task;
      } catch (error) {
        console.error('Error creating task:', error);
        throw error;
      }
    },
    [useTestData, tasks, setTasks, apiCreateTask, fetchTasks]
  );

  /**
   * Update a task by ID
   */
  const updateTask = useCallback(
    async (taskId: string, updates: Partial<Task>) => {
      if (useTestData) {
        const updatedTasks = tasks.map((t) => {
          if (t._id === taskId) {
            let merged = { ...t, ...updates, updatedAt: new Date().toISOString() };
            if (typeof updates.complexity === 'string') {
              merged.complexity = mapComplexityStringToNumber(updates.complexity);
            }
            return merged;
          }
          return t;
        });
        setTasks(updatedTasks);
        console.log('Task updated (test data):', taskId, updates);
        return updatedTasks.find((t) => t._id === taskId);
      }
      try {
        // If updates.complexity is a number, map to string for API
        let apiUpdates: any = { ...updates };
        if (typeof updates.complexity === 'number') {
          apiUpdates.complexity = mapComplexityNumberToString(updates.complexity);
        }
        const updated = await apiUpdateTaskById(taskId, apiUpdates);
        console.log('Task updated:', updated);
        const refreshed = await fetchTasks();
        setTasks(refreshed);
        console.log('Tasks after updateTask:', refreshed);
        return updated;
      } catch (error) {
        console.error('Error updating task:', error);
        throw error;
      }
    },
    [useTestData, tasks, setTasks, apiUpdateTaskById, fetchTasks]
  );

  /**
   * Delete a task by ID
   */
  const deleteTask = useCallback(
    async (taskId: string) => {
      console.log('deleteTask called with:', taskId);
      if (useTestData) {
        const updatedTasks = tasks.filter((t) => t._id !== taskId);
        setTasks(updatedTasks);
        console.log('Task deleted (test data):', taskId);
        return true;
      }
      try {
        await apiDeleteTaskById(taskId);
        console.log('Task deleted:', taskId);
        const refreshed = await fetchTasks();
        setTasks(refreshed);
        console.log('Tasks after deleteTask:', refreshed);
        return true;
      } catch (error) {
        console.error('Error deleting task:', error);
        throw error;
      }
    },
    [useTestData, tasks, setTasks, apiDeleteTaskById, fetchTasks]
  );

  /**
   * Get tasks grouped by status
   */
  const getTaskCountsByStatus = useCallback(() => {
    const counts = {
      total: tasks.length,
      pending: 0,
      'in-progress': 0,
      completed: 0,
      cancelled: 0,
      deferred: 0,
    };

    tasks.forEach((task) => {
      if (task.status in counts) {
        counts[task.status as keyof typeof counts]++;
      }
    });

    return counts;
  }, [tasks]);

  /**
   * Get tasks filtered by status
   * @param status Status to filter by
   */
  const getTasksByStatus = useCallback(
    (status: TaskStatus) => {
      return tasks.filter((task) => task.status === status);
    },
    [tasks]
  );

  /**
   * Get tasks filtered by priority
   * @param priority Priority to filter by
   */
  const getTasksByPriority = useCallback(
    (priority: TaskPriority) => {
      return tasks.filter((task) => task.priority === priority);
    },
    [tasks]
  );

  /**
   * Get all subtasks for a given parent task
   * @param parentId Parent task ID
   */
  const getSubtasksForTask = useCallback(
    (parentId: string) => {
      return tasks.filter((task) => task.parentTask === parentId);
    },
    [tasks]
  );

  /**
   * Reload tasks with optional filters
   * @param filters Optional task filters
   */
  const refreshTasks = useCallback(
    (filters?: TaskFilters) => {
      if (loading) {
        // Don't make new requests if already loading
        return Promise.resolve(tasks);
      }
      return fetchTasks(filters);
    },
    [fetchTasks, loading, tasks]
  );

  /**
   * Check if a task has subtasks
   * @param taskId Task ID to check
   */
  const hasSubtasks = useCallback(
    (taskId: string) => {
      const task = tasks.find((t) => t._id === taskId);
      return task?.subtasks && task.subtasks.length > 0;
    },
    [tasks]
  );

  /**
   * Get all dependencies for a task
   * @param taskId Task ID
   */
  const getDependenciesForTask = useCallback(
    (taskId: string) => {
      const task = tasks.find((t) => t._id === taskId);
      if (!task?.dependencies || task.dependencies.length === 0) {
        return [];
      }

      return tasks.filter((t) => task.dependencies?.includes(t._id));
    },
    [tasks]
  );

  /**
   * Check if a task is blocked by dependencies
   * @param taskId Task ID to check
   */
  const isTaskBlocked = useCallback(
    (taskId: string) => {
      const task = tasks.find((t) => t._id === taskId);
      if (!task?.dependencies || task.dependencies.length === 0) {
        return false;
      }

      const dependencies = tasks.filter((t) =>
        task.dependencies?.includes(t._id)
      );
      return dependencies.some((dep) => dep.status !== 'completed');
    },
    [tasks]
  );

  const handleDeleteTask = (id: string) => {
    if (!id) {
      console.error('handleDeleteTask called with invalid id:', id);
      return;
    }
    console.log('Immediate delete for task id:', id);
    void (async () => {
      await deleteTask(id);
      const refreshed = await refreshTasks();
      console.log('[handleDeleteTask] Tasks after delete:', refreshed);
    })();
  };

  return {
    loading,
    error,
    tasks,
    filteredTasks,
    selectedTask,
    useTestData,
    toggleTestData,
    fetchTasks,
    fetchTaskById: apiFetchTaskById,
    addTask,
    updateTask,
    deleteTask,
    updateTaskStatus: apiUpdateTaskStatus,
    addSubtask: apiAddSubtask,
    addDependency: apiAddDependency,
    selectTask,
    clearSelectedTask,
    clearError,
    getTaskCountsByStatus,
    getTasksByStatus,
    getTasksByPriority,
    getSubtasksForTask,
    hasSubtasks,
    getDependenciesForTask,
    isTaskBlocked,
    refreshTasks,
    handleDeleteTask,
  };
};
