import { useCallback } from 'react';
import { useTaskContext } from '../context/TaskContext';
import {
  TaskService,
  CreateTaskPayload,
  UpdateTaskPayload,
  TaskFilters,
} from './taskService';
import { TaskStatus } from '../context/taskState';
import { ApiError } from './config';

/**
 * Custom hook for task API operations with state management
 */
export const useTaskApi = () => {
  const {
    state,
    setTasks,
    addTask,
    updateTask: updateTaskInState,
    deleteTask: deleteTaskInState,
    setLoading,
    setError,
    clearError,
    selectTask,
    clearSelectedTask,
    addSubtask: addSubtaskToState,
    addDependency: addDependencyToState,
  } = useTaskContext();

  /**
   * Get all tasks with optional filters
   */
  const fetchTasks = useCallback(
    async (filters?: TaskFilters) => {
      setLoading(true);

      try {
        const tasks = await TaskService.getAllTasks(filters);
        const normalizedTasks = tasks.map((task: any) => ({ ...task, _id: task._id || task.id }));
        clearError();
        setTasks(normalizedTasks);
        return normalizedTasks;
      } catch (error) {
        const apiError = error as ApiError;
        const errorMessage = apiError.message || 'Failed to fetch tasks';
        console.error('Error fetching tasks:', errorMessage);
        setError(errorMessage);
        return state.tasks;
      } finally {
        setLoading(false);
      }
    },
    [setLoading, clearError, setTasks, setError, state.tasks]
  );

  /**
   * Get a single task by ID
   */
  const fetchTaskById = useCallback(
    async (taskId: string, options?: RequestInit) => {
      setLoading(true);
      try {
        console.log('[API] fetching task id:', taskId);
        const task = await TaskService.getTaskById(taskId, options);
        console.log('[API] response data:', task);
        clearError();
        selectTask(task);
        return task;
      } catch (error) {
        const apiError = error as ApiError;
        const errorMessage =
          apiError.message || `Failed to fetch task ${taskId}`;
        console.error(`Error fetching task ${taskId}:`, errorMessage);
        setError(errorMessage);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [setLoading, clearError, selectTask, setError]
  );

  /**
   * Create a new task
   */
  const createTask = useCallback(
    async (taskData: CreateTaskPayload) => {
      setLoading(true);
      clearError();

      try {
        const newTask = await TaskService.createTask(taskData);
        addTask(newTask);
        return newTask;
      } catch (error) {
        const apiError = error as ApiError;
        setError(apiError.message || 'Failed to create task');
        return null;
      } finally {
        setLoading(false);
      }
    },
    [setLoading, clearError, addTask, setError]
  );

  /**
   * Update an existing task
   */
  const updateTaskById = useCallback(
    async (taskId: string, taskData: UpdateTaskPayload) => {
      setLoading(true);
      clearError();

      try {
        const updatedTask = await TaskService.updateTask(taskId, taskData);
        updateTaskInState(updatedTask);
        return updatedTask;
      } catch (error) {
        const apiError = error as ApiError;
        setError(apiError.message || `Failed to update task ${taskId}`);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [setLoading, clearError, updateTaskInState, setError]
  );

  /**
   * Delete a task
   */
  const deleteTaskById = useCallback(
    async (taskId: string) => {
      setLoading(true);
      clearError();

      try {
        const result = await TaskService.deleteTask(taskId);
        if (result.success) {
          deleteTaskInState(taskId);
          if (state.selectedTask?._id === taskId) {
            clearSelectedTask();
          }
        }
        return result.success;
      } catch (error) {
        const apiError = error as ApiError;
        setError(apiError.message || `Failed to delete task ${taskId}`);
        return false;
      } finally {
        setLoading(false);
      }
    },
    [
      setLoading,
      clearError,
      deleteTaskInState,
      setError,
      state.selectedTask,
      clearSelectedTask,
    ]
  );

  /**
   * Update task status
   */
  const updateTaskStatus = useCallback(
    async (taskId: string, status: TaskStatus) => {
      setLoading(true);
      clearError();

      try {
        const updatedTask = await TaskService.updateTaskStatus(taskId, status);
        updateTaskInState(updatedTask);
        return updatedTask;
      } catch (error) {
        const apiError = error as ApiError;
        setError(
          apiError.message || `Failed to update status for task ${taskId}`
        );
        return null;
      } finally {
        setLoading(false);
      }
    },
    [setLoading, clearError, updateTaskInState, setError]
  );

  /**
   * Add a subtask to a task
   */
  const addSubtask = useCallback(
    async (parentId: string, subtaskData: CreateTaskPayload) => {
      setLoading(true);
      clearError();

      try {
        const newSubtask = await TaskService.addSubtask(parentId, subtaskData);
        addSubtaskToState(parentId, newSubtask);
        return newSubtask;
      } catch (error) {
        const apiError = error as ApiError;
        setError(
          apiError.message || `Failed to add subtask to task ${parentId}`
        );
        return null;
      } finally {
        setLoading(false);
      }
    },
    [setLoading, clearError, addSubtaskToState, setError]
  );

  /**
   * Add a dependency to a task
   */
  const addDependency = useCallback(
    async (taskId: string, dependencyId: string) => {
      setLoading(true);
      clearError();

      try {
        const result = await TaskService.addDependency(taskId, dependencyId);
        if (result.success) {
          addDependencyToState(taskId, dependencyId);
        }
        return result.success;
      } catch (error) {
        const apiError = error as ApiError;
        setError(
          apiError.message || `Failed to add dependency to task ${taskId}`
        );
        return false;
      } finally {
        setLoading(false);
      }
    },
    [setLoading, clearError, addDependencyToState, setError]
  );

  return {
    // State from context
    loading: state.loading,
    error: state.error,
    tasks: state.tasks,
    filteredTasks: state.filteredTasks,
    selectedTask: state.selectedTask,

    // API operations
    fetchTasks,
    fetchTaskById,
    createTask,
    updateTaskById,
    deleteTaskById,
    updateTaskStatus,
    addSubtask,
    addDependency,

    // Direct state actions
    selectTask,
    clearSelectedTask,
    clearError,
    setTasks,
  };
};
