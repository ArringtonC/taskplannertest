import React, { createContext, useReducer, useContext } from 'react';
import { taskReducer } from './taskReducer';
import {
  TaskState,
  initialTaskState,
  TaskAction,
  TaskActionTypes,
  Task,
} from './taskState';

// Create context
interface TaskContextProps {
  state: TaskState;
  dispatch: React.Dispatch<TaskAction>;
  // Helper action functions
  setTasks: (tasks: Task[]) => void;
  addTask: (task: Task) => void;
  updateTask: (task: Task) => void;
  deleteTask: (taskId: string) => void;
  selectTask: (task: Task) => void;
  clearSelectedTask: () => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string) => void;
  clearError: () => void;
  setFilters: (filters: Partial<TaskState['filters']>) => void;
  clearFilters: () => void;
  addSubtask: (parentId: string, subtask: Task) => void;
  addDependency: (taskId: string, dependencyId: string) => void;
}

const TaskContext = createContext<TaskContextProps | undefined>(undefined);

// Provider component
interface TaskProviderProps {
  children: React.ReactNode;
}

export const TaskProvider: React.FC<TaskProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(taskReducer, initialTaskState);

  // Helper functions for dispatching actions
  const setTasks = (tasks: Task[]) => {
    dispatch({
      type: TaskActionTypes.SET_TASKS,
      payload: tasks,
    });
  };

  const addTask = (task: Task) => {
    dispatch({
      type: TaskActionTypes.ADD_TASK,
      payload: task,
    });
  };

  const updateTask = (task: Task) => {
    dispatch({
      type: TaskActionTypes.UPDATE_TASK,
      payload: task,
    });
  };

  const deleteTask = (taskId: string) => {
    dispatch({
      type: TaskActionTypes.DELETE_TASK,
      payload: taskId,
    });
  };

  const selectTask = (task: Task) => {
    dispatch({
      type: TaskActionTypes.SELECT_TASK,
      payload: task,
    });
  };

  const clearSelectedTask = () => {
    dispatch({
      type: TaskActionTypes.CLEAR_SELECTED_TASK,
    });
  };

  const setLoading = (loading: boolean) => {
    dispatch({
      type: TaskActionTypes.SET_LOADING,
      payload: loading,
    });
  };

  const setError = (error: string) => {
    dispatch({
      type: TaskActionTypes.SET_ERROR,
      payload: error,
    });
  };

  const clearError = () => {
    dispatch({
      type: TaskActionTypes.CLEAR_ERROR,
    });
  };

  const setFilters = (filters: Partial<TaskState['filters']>) => {
    dispatch({
      type: TaskActionTypes.SET_FILTERS,
      payload: filters,
    });
  };

  const clearFilters = () => {
    dispatch({
      type: TaskActionTypes.CLEAR_FILTERS,
    });
  };

  const addSubtask = (parentId: string, subtask: Task) => {
    dispatch({
      type: TaskActionTypes.ADD_SUBTASK,
      payload: { parentId, subtask },
    });
  };

  const addDependency = (taskId: string, dependencyId: string) => {
    dispatch({
      type: TaskActionTypes.ADD_DEPENDENCY,
      payload: { taskId, dependencyId },
    });
  };

  return (
    <TaskContext.Provider
      value={{
        state,
        dispatch,
        setTasks,
        addTask,
        updateTask,
        deleteTask,
        selectTask,
        clearSelectedTask,
        setLoading,
        setError,
        clearError,
        setFilters,
        clearFilters,
        addSubtask,
        addDependency,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
};

// Custom hook for using the task context
export const useTaskContext = (): TaskContextProps => {
  const context = useContext(TaskContext);
  if (context === undefined) {
    throw new Error('useTaskContext must be used within a TaskProvider');
  }
  return context;
};
