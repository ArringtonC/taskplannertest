import {
  API_BASE_URL,
  getHeaders,
  handleApiResponse,
  ApiError,
} from './config';
import { Task, TaskPriority, TaskStatus } from '../context/taskState';

/**
 * Interface for task creation payload
 */
export interface CreateTaskPayload {
  title: string;
  description?: string;
  complexity?: string;
  status?: TaskStatus;
  priority?: TaskPriority;
  dueDate?: string;
  project?: string;
  assignedTo?: string;
  parentTask?: string;
  tags?: string[];
}

/**
 * Interface for task update payload
 */
export interface UpdateTaskPayload extends Partial<CreateTaskPayload> {}

/**
 * Interface for task filters
 */
export interface TaskFilters {
  status?: TaskStatus;
  priority?: TaskPriority;
  dueDate?: string;
  project?: string;
  assignedTo?: string;
  tags?: string[];
}

/**
 * Base response interface
 */
interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
}

/**
 * Handle network errors and provide clear error messages
 */
const handleNetworkError = (error: unknown, operation: string): never => {
  console.error(`Network error during ${operation}:`, error);

  if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
    throw new ApiError(
      `Unable to connect to the server. Please check your network connection or try again later.`,
      0
    );
  }

  if (error instanceof ApiError) {
    throw error;
  }

  throw new ApiError(`An unexpected error occurred during ${operation}`, 0);
};

/**
 * Task API service
 */
export const TaskService = {
  /**
   * Get all tasks with optional filters
   * @param filters Optional query parameters
   * @returns Promise with task array
   */
  getAllTasks: async (filters?: TaskFilters): Promise<Task[]> => {
    let queryParams = '';

    if (filters) {
      const params = new URLSearchParams();

      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined) {
          params.append(key, value.toString());
        }
      });

      queryParams = `?${params.toString()}`;
    }

    const url = `${API_BASE_URL}/tasks${queryParams}`;
    console.log(`Fetching tasks from: ${url}`);

    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: getHeaders(),
      });

      console.log(`API response status: ${response.status}`);
      const result = await handleApiResponse<ApiResponse<Task[]>>(response);
      console.log(`Received ${result.data.length} tasks from API`);
      return result.data;
    } catch (error) {
      return handleNetworkError(error, 'fetching tasks');
    }
  },

  /**
   * Get a single task by ID
   * @param taskId Task ID
   * @param options Optional fetch options (e.g., { signal })
   * @returns Promise with task
   */
  getTaskById: async (taskId: string, options?: RequestInit): Promise<Task> => {
    const response = await fetch(`${API_BASE_URL}/tasks/${taskId}`, {
      method: 'GET',
      headers: getHeaders(),
      ...options,
    });
    const result = await handleApiResponse<ApiResponse<Task>>(response);
    return result.data;
  },

  /**
   * Create a new task
   * @param taskData Task creation data
   * @returns Promise with created task
   */
  createTask: async (taskData: CreateTaskPayload): Promise<Task> => {
    const response = await fetch(`${API_BASE_URL}/tasks`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(taskData),
    });

    const result = await handleApiResponse<ApiResponse<Task>>(response);
    return result.data;
  },

  /**
   * Update an existing task
   * @param taskId Task ID
   * @param taskData Task update data
   * @returns Promise with updated task
   */
  updateTask: async (
    taskId: string,
    taskData: UpdateTaskPayload
  ): Promise<Task> => {
    const response = await fetch(`${API_BASE_URL}/tasks/${taskId}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(taskData),
    });

    const result = await handleApiResponse<ApiResponse<Task>>(response);
    return result.data;
  },

  /**
   * Delete a task
   * @param taskId Task ID
   * @returns Promise with success message
   */
  deleteTask: async (
    taskId: string
  ): Promise<{ success: boolean; message: string }> => {
    const response = await fetch(`${API_BASE_URL}/tasks/${taskId}`, {
      method: 'DELETE',
      headers: getHeaders(),
    });

    return handleApiResponse<{ success: boolean; message: string }>(response);
  },

  /**
   * Update task status
   * @param taskId Task ID
   * @param status New status
   * @returns Promise with updated task
   */
  updateTaskStatus: async (
    taskId: string,
    status: TaskStatus
  ): Promise<Task> => {
    const response = await fetch(`${API_BASE_URL}/tasks/${taskId}/status`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify({ status }),
    });

    const result = await handleApiResponse<ApiResponse<Task>>(response);
    return result.data;
  },

  /**
   * Add a subtask to a task
   * @param parentId Parent task ID
   * @param subtaskData Subtask creation data
   * @returns Promise with created subtask
   */
  addSubtask: async (
    parentId: string,
    subtaskData: CreateTaskPayload
  ): Promise<Task> => {
    const response = await fetch(`${API_BASE_URL}/tasks/${parentId}/subtasks`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(subtaskData),
    });

    const result = await handleApiResponse<ApiResponse<Task>>(response);
    return result.data;
  },

  /**
   * Add a dependency to a task
   * @param taskId Task ID
   * @param dependencyId Dependency task ID
   * @returns Promise with success message
   */
  addDependency: async (
    taskId: string,
    dependencyId: string
  ): Promise<{ success: boolean; message: string }> => {
    const response = await fetch(
      `${API_BASE_URL}/tasks/${taskId}/dependencies`,
      {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ dependencyId }),
      }
    );

    return handleApiResponse<{ success: boolean; message: string }>(response);
  },
};
