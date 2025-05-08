/**
 * Task state types and initial state
 */

// Task status type
export type TaskStatus =
  | 'pending'
  | 'in-progress'
  | 'completed'
  | 'cancelled'
  | 'deferred';

// Task priority type
export type TaskPriority = 'low' | 'medium' | 'high';

// Task interface
export interface Task {
  _id: string;
  title: string;
  description?: string;
  complexity: number;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate?: string;
  createdBy: string;
  assignedTo?: string;
  project?: string;
  parentTask?: string;
  subtasks?: string[];
  dependencies?: string[];
  tags?: string[];
  createdAt: string;
  updatedAt: string;
}

// Task state interface
export interface TaskState {
  tasks: Task[];
  loading: boolean;
  error: string | null;
  selectedTask: Task | null;
  filteredTasks: Task[];
  filters: {
    status?: TaskStatus;
    priority?: TaskPriority;
    dueDate?: string;
  };
}

// Initial task state
export const initialTaskState: TaskState = {
  tasks: [],
  loading: false,
  error: null,
  selectedTask: null,
  filteredTasks: [],
  filters: {},
};

/**
 * Task action types
 */
export enum TaskActionTypes {
  SET_TASKS = 'SET_TASKS',
  ADD_TASK = 'ADD_TASK',
  UPDATE_TASK = 'UPDATE_TASK',
  DELETE_TASK = 'DELETE_TASK',
  SET_LOADING = 'SET_LOADING',
  SET_ERROR = 'SET_ERROR',
  CLEAR_ERROR = 'CLEAR_ERROR',
  SELECT_TASK = 'SELECT_TASK',
  CLEAR_SELECTED_TASK = 'CLEAR_SELECTED_TASK',
  SET_FILTERS = 'SET_FILTERS',
  CLEAR_FILTERS = 'CLEAR_FILTERS',
  ADD_SUBTASK = 'ADD_SUBTASK',
  ADD_DEPENDENCY = 'ADD_DEPENDENCY',
}

/**
 * Task action interfaces
 */
export interface SetTasksAction {
  type: TaskActionTypes.SET_TASKS;
  payload: Task[];
}

export interface AddTaskAction {
  type: TaskActionTypes.ADD_TASK;
  payload: Task;
}

export interface UpdateTaskAction {
  type: TaskActionTypes.UPDATE_TASK;
  payload: Task;
}

export interface DeleteTaskAction {
  type: TaskActionTypes.DELETE_TASK;
  payload: string; // Task ID
}

export interface SetLoadingAction {
  type: TaskActionTypes.SET_LOADING;
  payload: boolean;
}

export interface SetErrorAction {
  type: TaskActionTypes.SET_ERROR;
  payload: string;
}

export interface ClearErrorAction {
  type: TaskActionTypes.CLEAR_ERROR;
}

export interface SelectTaskAction {
  type: TaskActionTypes.SELECT_TASK;
  payload: Task;
}

export interface ClearSelectedTaskAction {
  type: TaskActionTypes.CLEAR_SELECTED_TASK;
}

export interface SetFiltersAction {
  type: TaskActionTypes.SET_FILTERS;
  payload: {
    status?: TaskStatus;
    priority?: TaskPriority;
    dueDate?: string;
  };
}

export interface ClearFiltersAction {
  type: TaskActionTypes.CLEAR_FILTERS;
}

export interface AddSubtaskAction {
  type: TaskActionTypes.ADD_SUBTASK;
  payload: {
    parentId: string;
    subtask: Task;
  };
}

export interface AddDependencyAction {
  type: TaskActionTypes.ADD_DEPENDENCY;
  payload: {
    taskId: string;
    dependencyId: string;
  };
}

// Union type of all possible task actions
export type TaskAction =
  | SetTasksAction
  | AddTaskAction
  | UpdateTaskAction
  | DeleteTaskAction
  | SetLoadingAction
  | SetErrorAction
  | ClearErrorAction
  | SelectTaskAction
  | ClearSelectedTaskAction
  | SetFiltersAction
  | ClearFiltersAction
  | AddSubtaskAction
  | AddDependencyAction;
