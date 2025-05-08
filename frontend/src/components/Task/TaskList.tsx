import React, { useEffect, useState } from 'react';
import { Task } from '../../context/taskState';
import TaskRow from './TaskRow';
import TaskCard from './TaskCard';
import EmptyState from '../EmptyState';
import { PriorityBadge } from '../PriorityBadge';

interface TaskListProps {
  tasks: Task[];
  onEdit?: (task: Task) => void;
  onDelete?: (id: string) => void;
  onAddTask?: () => void;
}

const getComplexityLabel = (complexity: number) => {
  if (complexity <= 2) return 'simple';
  if (complexity <= 5) return 'moderate';
  return 'complex';
};

/**
 * Component that displays a list of tasks in either table or card view
 */
const TaskList: React.FC<TaskListProps> = ({
  tasks,
  onEdit,
  onDelete,
  onAddTask,
}) => {
  // Toggle between 'table' and 'grid' view
  const [viewType, setViewType] = useState<'table' | 'grid'>('table');

  // Debug: Log component props on mount and updates - but not on every render
  useEffect(() => {
    console.log('TaskList component mounted/updated with:', {
      tasksCount: tasks.length,
      viewType,
      hasEditHandler: !!onEdit,
      hasDeleteHandler: !!onDelete,
      hasAddTaskHandler: !!onAddTask,
    });
  }, [tasks.length, viewType, onEdit, onDelete, onAddTask]); // Include all dependencies

  // If there are no tasks, display a message
  if (tasks.length === 0) {
    return (
      <EmptyState
        title="No Tasks Found"
        message="There are no tasks to display. Create a new task to get started."
        actionText={onAddTask ? 'Add Your First Task' : undefined}
        onAction={onAddTask}
      />
    );
  }

  return (
    <div className="bg-blue-900 rounded-lg p-2">
      {/* Toggle Button */}
      {/* Removed Table View and Grid View buttons */}
      {/* Table View with <colgroup> */}
      {viewType === 'table' && (
        <table className="min-w-full table-auto bg-blue-900">
          <thead aria-label="A horizontal header bar on a dark navy background. The column headings (all caps, bold, white font) read: Title, Status, Priority, Complexity, Due Date, Actions.">
            <tr className="bg-blue-900 border-y border-[#353b4b]">
              <th className="px-6 py-4 text-white font-bold uppercase text-left">Title</th>
              <th className="px-6 py-4 text-white font-bold uppercase text-left">Status</th>
              <th className="px-6 py-4 text-white font-bold uppercase text-left">Priority</th>
              <th className="px-6 py-4 text-white font-bold uppercase text-left">Complexity</th>
              <th className="px-6 py-4 text-white font-bold uppercase text-left">Due Date</th>
              <th className="px-6 py-4 text-white font-bold uppercase text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {tasks.map((task) => (
              <TaskRow
                key={task._id}
                task={task}
                onEdit={onEdit}
                onDelete={onDelete}
                tdClassName="px-6 py-4"
              />
            ))}
          </tbody>
        </table>
      )}

      {/* Grid View (CSS Grid) */}
      {viewType === 'grid' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 bg-blue-900 rounded-lg p-2 border border-[#2A3044]">
          {tasks.map((task) => (
            <TaskCard
              key={task._id}
              task={task}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default TaskList;
