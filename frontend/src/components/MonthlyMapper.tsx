import React, { useState, useMemo } from 'react';
import { addMonths, subMonths, format, isSameMonth, isBefore, parseISO, getYear, getMonth } from 'date-fns';
import { ArrowLeft, ChevronLeft, ChevronRight } from 'lucide-react';
import { Task } from '../context/taskState';
import { Button } from "@/components/ui/button";

/**
 * Props for MonthlyMapper
 */
export interface MonthlyMapperProps {
  /** List of all tasks to display */
  tasks: Task[];
  /** Maximum number of goals to show (default: 20) */
  maxGoals?: number;
  /** Optional callback for back navigation */
  onBack?: () => void;
  /** Optional initial date for the calendar (for testing or custom start) */
  initialDate?: Date;
}

/**
 * Custom hook to group tasks by goal number for a given month.
 * @param tasks List of tasks
 * @param maxGoals Maximum number of goals
 * @returns Record<goalNumber, Task[]> and "No Rush" bucket
 */
function useTasksByGoal(tasks: Task[], maxGoals: number = 20) {
  // Group tasks by goal number (1-based)
  const grouped: Record<number, Task[]> = {};
  let noRush: Task[] = [];
  for (let i = 1; i <= maxGoals; i++) grouped[i] = [];
  for (const task of tasks) {
    // Assume goal number is encoded in a tag: "goal-<n>"
    const goalTag = task.tags?.find(t => /^goal-\d+$/.test(t));
    if (goalTag) {
      const n = parseInt(goalTag.replace('goal-', ''), 10);
      if (n >= 1 && n <= maxGoals) grouped[n].push(task);
      else noRush.push(task);
    } else {
      noRush.push(task);
    }
  }
  return { grouped, noRush };
}

/**
 * MonthNavigator: Controls for navigating months
 */
interface MonthNavigatorProps {
  currentDate: Date;
  onPrev: () => void;
  onNext: () => void;
}
/**
 * Month navigation controls with accessible buttons
 */
const MonthNavigator: React.FC<MonthNavigatorProps> = ({ currentDate, onPrev, onNext }) => (
  <nav className="flex items-center justify-center mb-4" aria-label="Month navigation">
    <button
      aria-label="Previous month"
      className="p-2 rounded-full hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
      onClick={onPrev}
      tabIndex={0}
      type="button"
    >
      <ChevronLeft className="h-5 w-5 text-gray-200" />
    </button>
    <span className="mx-4 text-lg font-semibold text-white" aria-live="polite">
      {format(currentDate, 'MMMM yyyy')}
    </span>
    <button
      aria-label="Next month"
      className="p-2 rounded-full hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
      onClick={onNext}
      tabIndex={0}
      type="button"
    >
      <ChevronRight className="h-5 w-5 text-gray-200" />
    </button>
  </nav>
);

/**
 * TaskRow: A single row in the table
 */
interface TaskRowProps {
  goalNumber: number | 'no-rush';
  tasks: Task[];
  month: number;
  year: number;
}
/**
 * Renders a row for a goal (or No Rush) with colored cells for each task
 */
const TaskRow: React.FC<TaskRowProps> = ({ goalNumber, tasks, month, year }) => {
  // Filter tasks for the current month
  const monthTasks = tasks.filter(task => {
    if (!task.dueDate) return false;
    const due = parseISO(task.dueDate);
    return getYear(due) === year && getMonth(due) === month;
  });
  // Overdue: dueDate < now and not completed
  const now = new Date();
  return (
    <tr>
      <th
        scope="row"
        className="px-4 py-2 text-left text-sm font-medium text-gray-200 bg-gray-800"
      >
        {goalNumber === 'no-rush' ? 'No Rush Goals/Personal' : `Goal #${goalNumber}`}
      </th>
      <td className="px-4 py-2">
        <div className="flex flex-wrap gap-2">
          {monthTasks.length === 0 && (
            <span className="text-gray-400 italic">No tasks</span>
          )}
          {monthTasks.map(task => {
            const due = task.dueDate ? parseISO(task.dueDate) : null;
            const overdue = due && isBefore(due, now) && task.status !== 'completed';
            const statusColor = overdue
              ? 'bg-red-600 text-white'
              : task.status === 'completed'
                ? 'bg-green-700 text-white'
                : 'bg-green-900 text-green-200';
            return (
              <span
                key={task._id}
                className={`px-2 py-1 rounded ${statusColor} text-xs font-semibold`}
                title={task.title}
                tabIndex={0}
                aria-label={`${task.title}, status: ${task.status}${overdue ? ', overdue' : ''}`}
              >
                {task.title}
              </span>
            );
          })}
        </div>
      </td>
    </tr>
  );
};

/**
 * TaskTable: Excel-style table for all goals and "No Rush"
 */
interface TaskTableProps {
  grouped: Record<number, Task[]>;
  noRush: Task[];
  month: number;
  year: number;
  maxGoals: number;
}
/**
 * Renders the main table with all goals and "No Rush" row
 */
const TaskTable: React.FC<TaskTableProps> = ({ grouped, noRush, month, year, maxGoals }) => (
  <div className="overflow-x-auto rounded-lg border border-gray-700 bg-gray-900">
    <table className="min-w-full divide-y divide-gray-700" role="table" aria-label="Monthly goals and tasks">
      <thead className="bg-gray-800">
        <tr>
          <th scope="col" className="px-4 py-2 text-left text-xs font-bold text-gray-300 uppercase tracking-wider">
            Goal #
          </th>
          <th scope="col" className="px-4 py-2 text-left text-xs font-bold text-gray-300 uppercase tracking-wider">
            Tasks for Month
          </th>
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-800">
        {Array.from({ length: maxGoals }, (_, i) => (
          <TaskRow
            key={i + 1}
            goalNumber={i + 1}
            tasks={grouped[i + 1]}
            month={month}
            year={year}
          />
        ))}
        <TaskRow
          key="no-rush"
          goalNumber="no-rush"
          tasks={noRush}
          month={month}
          year={year}
        />
      </tbody>
    </table>
  </div>
);

/**
 * MonthlyMapper: Main component
 */
export const MonthlyMapper: React.FC<MonthlyMapperProps> = ({ tasks, maxGoals = 20, onBack, initialDate }) => {
  const [currentDate, setCurrentDate] = useState(() => {
    if (initialDate) return new Date(initialDate.getFullYear(), initialDate.getMonth(), 1);
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1);
  });

  // Handlers for month navigation
  const handlePrevMonth = () => setCurrentDate(d => subMonths(d, 1));
  const handleNextMonth = () => setCurrentDate(d => addMonths(d, 1));

  // Derive month/year
  const month = currentDate.getMonth();
  const year = currentDate.getFullYear();

  // Group tasks by goal
  const { grouped, noRush } = useMemo(() => useTasksByGoal(tasks, maxGoals), [tasks, maxGoals]);

  return (
    <section className="max-w-5xl mx-auto p-4">
      <div className="flex items-center mb-6">
        <button
          onClick={onBack}
          className="flex items-center text-gray-300 hover:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 mr-4"
          aria-label="Back to Dashboard"
          type="button"
        >
          <ArrowLeft className="h-5 w-5 mr-1" />
          Back to Dashboard
        </button>
        <h1 className="text-2xl font-bold text-white flex-1 text-center" tabIndex={0} aria-label="Monthly Mapper Heading">
          Monthly Mapper
        </h1>
      </div>
      <MonthNavigator currentDate={currentDate} onPrev={handlePrevMonth} onNext={handleNextMonth} />
      <TaskTable grouped={grouped} noRush={noRush} month={month} year={year} maxGoals={maxGoals} />
    </section>
  );
};

/**
 * README: Usage Example
 *
 * ```tsx
 * import { MonthlyMapper } from './components/MonthlyMapper';
 * import { Task } from './context/taskState';
 *
 * // Example usage in a page/component:
 * const tasks: Task[] = [...];
 *
 * <MonthlyMapper tasks={tasks} maxGoals={20} onBack={() => navigate('/dashboard')} initialDate={new Date(2024, 4, 1)} />
 * ```
 *
 * - `tasks`: Array of Task objects (see Task interface in context/taskState.ts)
 * - `maxGoals`: (optional) Maximum number of goals to display (default 20)
 * - `onBack`: (optional) Callback for the back button
 * - `initialDate`: (optional) Initial date for the calendar (useful for tests)
 *
 * The component is fully accessible, responsive, and styled for a dark theme with Tailwind CSS.
 *
 * ## Task Grouping
 * Tasks are grouped by goal number using a `goal-<n>` tag (e.g., `goal-1`, `goal-2`). Tasks without a goal tag are placed in the "No Rush Goals/Personal" row.
 *
 * ## Testing
 * - Unit test date navigation and grouping logic
 * - Snapshot test the rendered table
 */ 