/**
 * Utility functions for grouping tasks by month
 */
import { Task } from '../context/taskState';

/**
 * Interface for month task grouping
 */
export interface MonthGroup {
  month: number; // 0-11 for Jan-Dec
  year: number;
  tasks: Task[];
  isOverloaded: boolean;
  totalComplexity: number;
  avgComplexity: number;
}

/**
 * Group tasks by month based on due date
 * @param tasks Array of tasks
 * @param overloadThreshold Number of tasks to consider a month overloaded (default: 4)
 * @returns Array of month groups (ordered by month)
 */
export const groupTasksByMonth = (
  tasks: Task[],
  overloadThreshold: number = 4
): MonthGroup[] => {
  // Initialize month groups for the current year
  const currentYear = new Date().getFullYear();
  const monthGroups: MonthGroup[] = Array(12)
    .fill(null)
    .map((_, index) => ({
      month: index,
      year: currentYear,
      tasks: [],
      isOverloaded: false,
      totalComplexity: 0,
      avgComplexity: 0,
    }));

  // Group tasks into their respective months
  tasks.forEach((task) => {
    if (task.dueDate) {
      const dueDate = new Date(task.dueDate);
      const monthIndex = dueDate.getMonth();

      // Add task to the correct month
      if (monthIndex >= 0 && monthIndex < 12) {
        const group = monthGroups[monthIndex];
        group.tasks.push(task);

        // Update complexity metrics
        const complexity = task.complexity || 0;
        group.totalComplexity += complexity;
      }
    }
  });

  // Calculate derived metrics for each month
  monthGroups.forEach((group) => {
    group.isOverloaded = group.tasks.length > overloadThreshold;
    group.avgComplexity =
      group.tasks.length > 0
        ? parseFloat((group.totalComplexity / group.tasks.length).toFixed(1))
        : 0;
  });

  return monthGroups;
};

/**
 * Get month name from month index (0-11)
 * @param monthIndex Month index (0-11)
 * @returns Full month name
 */
export const getMonthName = (monthIndex: number): string => {
  const months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];

  return months[monthIndex] || 'Unknown';
};

/**
 * Sort tasks within a month by various criteria
 * @param tasks Array of tasks
 * @param sortBy Sort criterion (default: 'date')
 * @returns Sorted tasks array
 */
export const sortMonthTasks = (
  tasks: Task[],
  sortBy: 'date' | 'priority' | 'complexity' = 'date'
): Task[] => {
  return [...tasks].sort((a, b) => {
    switch (sortBy) {
      case 'priority':
        // Sort by priority (high -> medium -> low)
        const priorityOrder: Record<string, number> = {
          high: 1,
          medium: 2,
          low: 3,
        };
        return (
          (priorityOrder[a.priority] || 999) -
          (priorityOrder[b.priority] || 999)
        );

      case 'complexity':
        // Sort by complexity (high to low)
        return (b.complexity || 0) - (a.complexity || 0);

      case 'date':
      default:
        // Sort by due date (earliest first)
        const dateA = a.dueDate ? new Date(a.dueDate).getTime() : Infinity;
        const dateB = b.dueDate ? new Date(b.dueDate).getTime() : Infinity;
        return dateA - dateB;
    }
  });
};
