import React, { useState } from 'react';
import { Task } from '../context/taskState';
import { ComplexityBadge } from './Task/ComplexityBadge';
import { PriorityBadge } from './PriorityBadge';
import { sortMonthTasks } from '../utils/groupByMonth';

interface MonthCellProps {
  monthName: string;
  tasks: Task[];
  isOverloaded?: boolean;
  avgComplexity?: number;
  totalComplexity?: number;
}

// Helper to map a number to the closest valid Complexity (1-5)
function toComplexity(val: number): 1 | 2 | 3 | 4 | 5 {
  if (val <= 1) return 1;
  if (val <= 2) return 2;
  if (val <= 3) return 3;
  if (val <= 4) return 4;
  return 5;
}

/**
 * A component that displays a single month with its tasks
 */
const MonthCell: React.FC<MonthCellProps> = ({
  monthName,
  tasks,
  isOverloaded = false,
  avgComplexity = 0,
  totalComplexity = 0,
}) => {
  // State for sorting tasks
  const [sortBy, setSortBy] = useState<'date' | 'priority' | 'complexity'>(
    'date'
  );

  // Sort tasks based on selected criterion
  const sortedTasks = sortMonthTasks(tasks, sortBy);

  // Calculate display metrics
  const highPriorityCount = tasks.filter((t) => t.priority === 'high').length;
  const hasHighPriority = highPriorityCount > 0;

  return (
    <div
      className={`bg-white rounded-lg shadow-sm overflow-hidden h-full transition-all hover:shadow-md 
      ${isOverloaded ? 'border-l-4 border-orange-500' : ''}
      ${hasHighPriority ? 'border-t-2 border-t-red-500' : ''}`}
    >
      {/* Month header */}
      <div
        className={`px-4 py-3 border-b ${isOverloaded ? 'bg-orange-50' : hasHighPriority ? 'bg-red-50' : 'bg-gray-50'}`}
      >
        <div className="flex justify-between items-center">
          <h3 className="font-medium text-gray-800">{monthName}</h3>

          {/* Sort control */}
          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="text-xs bg-white border border-gray-200 rounded-md py-1 px-2 appearance-none cursor-pointer focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="date">Due Date</option>
              <option value="priority">Priority</option>
              <option value="complexity">Complexity</option>
            </select>
          </div>
        </div>

        <div className="mt-1 flex flex-wrap gap-2 items-center">
          {/* Task count badge */}
          <span className="text-xs text-gray-500 font-medium bg-gray-100 px-2 py-0.5 rounded-full">
            {tasks.length} task{tasks.length !== 1 ? 's' : ''}
          </span>

          {/* Status indicators */}
          {isOverloaded && (
            <span className="text-xs font-medium text-orange-600 bg-orange-100 px-2 py-0.5 rounded-full">
              Overloaded
            </span>
          )}

          {hasHighPriority && (
            <span className="text-xs font-medium text-red-600 bg-red-100 px-2 py-0.5 rounded-full">
              {highPriorityCount} high priority
            </span>
          )}
        </div>

        {/* Complexity metrics */}
        {tasks.length > 0 && (
          <div className="flex items-center gap-2 mt-2 text-xs text-gray-600">
            <div title="Average Complexity" className="flex items-center">
              <span className="mr-1">Avg:</span>
              <ComplexityBadge
                complexity={toComplexity(avgComplexity)}
              />
            </div>
            <div title="Total Complexity" className="flex items-center">
              <span className="mr-1">Total:</span>
              <span className="font-semibold">{totalComplexity}</span>
            </div>
          </div>
        )}
      </div>

      {/* Task list */}
      <div className="p-3">
        {tasks.length === 0 ? (
          <div className="flex flex-col items-center justify-center text-sm text-gray-400 text-center py-4">
            <svg
              className="w-6 h-6 mb-2 text-gray-300"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <p>No tasks</p>
          </div>
        ) : (
          <ul className="space-y-2 max-h-48 overflow-y-auto">
            {sortedTasks.slice(0, 5).map((task) => (
              <li
                key={task._id}
                className="text-sm p-2.5 rounded border border-gray-100 bg-gray-50 hover:bg-gray-100 transition-colors"
              >
                <div className="font-medium text-gray-800 truncate">
                  {task.title}
                </div>
                <div className="flex justify-between items-center mt-1.5">
                  <div className="flex items-center gap-1.5">
                    {/* Priority badge */}
                    <PriorityBadge priority={task.priority as any} />

                    {/* Complexity badge */}
                    <ComplexityBadge
                      complexity={toComplexity(task.complexity || 1)}
                    />
                  </div>

                  {/* Due date */}
                  <span className="text-xs text-gray-500 font-medium">
                    {task.dueDate ? new Date(task.dueDate).getDate() : '?'}
                  </span>
                </div>
              </li>
            ))}

            {/* Show indicator for more tasks */}
            {tasks.length > 5 && (
              <li className="text-center text-xs font-medium bg-gray-50 text-gray-500 py-1.5 rounded border border-gray-100">
                +{tasks.length - 5} more tasks
              </li>
            )}
          </ul>
        )}
      </div>
    </div>
  );
};

export default MonthCell;
