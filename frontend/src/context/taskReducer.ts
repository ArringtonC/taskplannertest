import { TaskState, TaskAction, TaskActionTypes } from './taskState';

/**
 * Task reducer function
 * @param state Current task state
 * @param action Action to perform
 * @returns Updated task state
 */
export const taskReducer = (
  state: TaskState,
  action: TaskAction
): TaskState => {
  switch (action.type) {
    case TaskActionTypes.SET_TASKS:
      return {
        ...state,
        tasks: action.payload,
        filteredTasks: applyFilters(action.payload, state.filters),
        loading: false,
      };

    case TaskActionTypes.ADD_TASK:
      const newTasks = [...state.tasks, action.payload];
      return {
        ...state,
        tasks: newTasks,
        filteredTasks: applyFilters(newTasks, state.filters),
        loading: false,
      };

    case TaskActionTypes.UPDATE_TASK:
      const updatedTasks = state.tasks.map((task) =>
        task._id === action.payload._id ? action.payload : task
      );
      return {
        ...state,
        tasks: updatedTasks,
        filteredTasks: applyFilters(updatedTasks, state.filters),
        selectedTask:
          state.selectedTask?._id === action.payload._id
            ? action.payload
            : state.selectedTask,
        loading: false,
      };

    case TaskActionTypes.DELETE_TASK:
      const filteredTasks = state.tasks.filter(
        (task) => task._id !== action.payload
      );
      return {
        ...state,
        tasks: filteredTasks,
        filteredTasks: applyFilters(filteredTasks, state.filters),
        selectedTask:
          state.selectedTask?._id === action.payload
            ? null
            : state.selectedTask,
        loading: false,
      };

    case TaskActionTypes.SET_LOADING:
      return {
        ...state,
        loading: action.payload,
      };

    case TaskActionTypes.SET_ERROR:
      return {
        ...state,
        error: action.payload,
        loading: false,
      };

    case TaskActionTypes.CLEAR_ERROR:
      return {
        ...state,
        error: null,
      };

    case TaskActionTypes.SELECT_TASK:
      return {
        ...state,
        selectedTask: action.payload,
      };

    case TaskActionTypes.CLEAR_SELECTED_TASK:
      return {
        ...state,
        selectedTask: null,
      };

    case TaskActionTypes.SET_FILTERS:
      return {
        ...state,
        filters: { ...state.filters, ...action.payload },
        filteredTasks: applyFilters(state.tasks, {
          ...state.filters,
          ...action.payload,
        }),
      };

    case TaskActionTypes.CLEAR_FILTERS:
      return {
        ...state,
        filters: {},
        filteredTasks: state.tasks,
      };

    case TaskActionTypes.ADD_SUBTASK: {
      const { parentId, subtask } = action.payload;
      const updatedTasks = [...state.tasks, subtask];

      // Update the parent task with the new subtask reference
      const updatedTasksWithParent = updatedTasks.map((task) => {
        if (task._id === parentId) {
          const updatedSubtasks = [...(task.subtasks || []), subtask._id];
          return { ...task, subtasks: updatedSubtasks };
        }
        return task;
      });

      return {
        ...state,
        tasks: updatedTasksWithParent,
        filteredTasks: applyFilters(updatedTasksWithParent, state.filters),
        loading: false,
      };
    }

    case TaskActionTypes.ADD_DEPENDENCY: {
      const { taskId, dependencyId } = action.payload;

      // Update the task with the new dependency reference
      const updatedTasks = state.tasks.map((task) => {
        if (task._id === taskId) {
          const updatedDependencies = [
            ...(task.dependencies || []),
            dependencyId,
          ];
          return { ...task, dependencies: updatedDependencies };
        }
        return task;
      });

      return {
        ...state,
        tasks: updatedTasks,
        filteredTasks: applyFilters(updatedTasks, state.filters),
        loading: false,
      };
    }

    default:
      return state;
  }
};

/**
 * Helper function to apply filters to tasks
 * @param tasks Array of tasks
 * @param filters Filter criteria
 * @returns Filtered tasks array
 */
const applyFilters = (
  tasks: TaskState['tasks'],
  filters: TaskState['filters']
): TaskState['tasks'] => {
  return tasks.filter((task) => {
    // Status filter
    if (filters.status && task.status !== filters.status) {
      return false;
    }

    // Priority filter
    if (filters.priority && task.priority !== filters.priority) {
      return false;
    }

    // Due date filter
    if (filters.dueDate && task.dueDate) {
      // Simple date matching - can be extended for more complex date filtering
      const filterDate = new Date(filters.dueDate).toDateString();
      const taskDate = new Date(task.dueDate).toDateString();
      if (filterDate !== taskDate) {
        return false;
      }
    }

    return true;
  });
};
