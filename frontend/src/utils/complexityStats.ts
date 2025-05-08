/**
 * Utility functions for calculating task complexity statistics
 */
import { Task } from '../context/taskState';

/**
 * Calculate average complexity for an array of tasks
 * @param tasks Array of tasks
 * @returns Average complexity score (1-8) or 0 if no tasks
 */
export const calculateAverageComplexity = (tasks: Task[]): number => {
  if (!tasks.length) return 0;

  const sum = tasks.reduce((total, task) => total + (task.complexity || 0), 0);
  return parseFloat((sum / tasks.length).toFixed(1));
};

/**
 * Calculate total complexity for an array of tasks
 * @param tasks Array of tasks
 * @returns Sum of all task complexity scores
 */
export const calculateTotalComplexity = (tasks: Task[]): number => {
  return tasks.reduce((total, task) => total + (task.complexity || 0), 0);
};

/**
 * Get a descriptive label for a complexity score
 * @param complexity Complexity score (1-8)
 * @returns Text label describing the complexity level
 */
export const getComplexityLabel = (complexity: number): string => {
  if (complexity <= 2) return 'Simple';
  if (complexity <= 4) return 'Moderate';
  if (complexity <= 6) return 'Complex';
  return 'Very Complex';
};

/**
 * Get appropriate color class for a complexity score
 * @param complexity Complexity score (1-8)
 * @returns CSS class for styling
 */
export const getComplexityColorClass = (complexity: number): string => {
  if (complexity <= 2)
    return 'bg-green-100 text-green-800 dark:bg-green-600 dark:text-white';
  if (complexity <= 4)
    return 'bg-blue-100 text-blue-800 dark:bg-blue-600 dark:text-white';
  if (complexity <= 6)
    return 'bg-orange-100 text-orange-800 dark:bg-orange-600 dark:text-white';
  return 'bg-red-100 text-red-800 dark:bg-red-600 dark:text-white';
};

/**
 * Calculate the distribution of tasks by complexity levels
 * @param tasks Array of tasks
 * @returns Object with count for each complexity level
 */
export const getComplexityDistribution = (
  tasks: Task[]
): {
  simple: number;
  moderate: number;
  complex: number;
  veryComplex: number;
} => {
  const distribution = {
    simple: 0,
    moderate: 0,
    complex: 0,
    veryComplex: 0,
  };

  tasks.forEach((task) => {
    const complexity = task.complexity || 0;

    if (complexity <= 2) distribution.simple++;
    else if (complexity <= 4) distribution.moderate++;
    else if (complexity <= 6) distribution.complex++;
    else distribution.veryComplex++;
  });

  return distribution;
};

/**
 * Calculate the total complexity by status
 * @param tasks Array of tasks
 * @returns Object with complexity totals by status
 */
export const getComplexityByStatus = (
  tasks: Task[]
): Record<string, number> => {
  const result: Record<string, number> = {};

  tasks.forEach((task) => {
    const status = task.status;
    const complexity = task.complexity || 0;

    if (!result[status]) {
      result[status] = 0;
    }

    result[status] += complexity;
  });

  return result;
};
