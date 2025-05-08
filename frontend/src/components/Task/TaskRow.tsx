import React from 'react';
import { Task } from '../../context/taskState';
import { StatusBadge } from '../StatusBadge';
import { PriorityBadge } from '../PriorityBadge';
import { ComplexityBadge } from './ComplexityBadge';
import { DueDateBadge } from './DueDateBadge';
import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface TaskRowProps {
  task: Task;
  onEdit?: (task: Task) => void;
  onDelete?: (id: string) => void;
  showAssignedTo?: boolean;
  showProject?: boolean;
  showTags?: boolean;
  tdClassName?: string;
}

/**
 * Component that renders a task as a table row
 */
const TaskRow: React.FC<TaskRowProps> = ({
  task,
  onEdit,
  onDelete,
  showAssignedTo,
  showProject,
  showTags,
  tdClassName = "px-6 py-5",
}) => {
  const navigate = useNavigate();
  return (
    <tr className="border-b border-[#353b4b]" key={task._id}>
      {/* Debug log for task object */}
      {(() => { console.log('TaskRow rendering task:', task); return null; })()}
      <td className={tdClassName}>{task.title}</td>
      <td className={tdClassName}>
        <StatusBadge status={task.status as any} />
      </td>
      <td className={tdClassName}>
        <PriorityBadge priority={task.priority as any} />
      </td>
      <td className={tdClassName}>
        <ComplexityBadge complexity={task.complexity as any} />
      </td>
      <td className={tdClassName}>
        <DueDateBadge dueDate={task.dueDate} />
      </td>
      {showAssignedTo && (
        <td className={tdClassName}>{task.assignedTo || 'N/A'}</td>
      )}
      {showProject && (
        <td className={tdClassName}>{task.project || 'N/A'}</td>
      )}
      {showTags && (
        <td className={tdClassName}>{task.tags && task.tags.length > 0 ? task.tags.join(', ') : 'N/A'}</td>
      )}
      <td className={tdClassName + " space-x-2"}
        aria-label="This is a dark‑themed interface panel titled ACTIONS. Beneath the title are four identical rows; each row contains two adjacent outline‑style buttons: Edit — with a small pencil icon on the left. Delete — with a small trash‑can icon on the left. Each row is separated by a faint horizontal divider, and the buttons have rounded corners and a subtle border to stand out against the dark background."
      >
        {onEdit && (
          <Button
            variant="ghost"
            size="sm"
            className="inline-flex items-center border border-[#353b4b] rounded-md text-white hover:bg-[#23293a] focus:outline-none focus:ring-2 focus:ring-blue-500"
            onClick={() => navigate(`/edit-task/${task._id}`)}
          >
            <Pencil size={16} className="mr-2" />
            Edit
          </Button>
        )}
        {onDelete && (
          <Button
            variant="ghost"
            size="sm"
            className="inline-flex items-center border border-[#353b4b] rounded-md text-white hover:bg-[#23293a] focus:outline-none focus:ring-2 focus:ring-red-500"
            onClick={() => onDelete(task._id)}
          >
            <Trash2 size={16} className="mr-2" />
            Delete
          </Button>
        )}
      </td>
    </tr>
  );
};

export default TaskRow;
