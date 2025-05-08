import React, { useEffect } from 'react';
import { Task } from '../../context/taskState';
import { ComplexityBadge } from './ComplexityBadge';
import { StatusBadge } from '../StatusBadge';
import { PriorityBadge } from '../PriorityBadge';
import { DueDateBadge } from './DueDateBadge';
import { Button } from "@/components/ui/button";
import { useNavigate } from 'react-router-dom';

interface TaskCardProps {
  task: Task;
  onEdit?: (task: Task) => void;
  onDelete?: (id: string) => void;
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
 * Component that renders a task as a card
 */
const TaskCard: React.FC<TaskCardProps> = ({ task, onEdit, onDelete }) => {
  const navigate = useNavigate();
  // Only log once when component mounts
  useEffect(() => {
    // Debug log kept only for development troubleshooting
    if (process.env.NODE_ENV === 'development') {
      console.log(`TaskCard mounted for task: ${task.title}`);
    }
    // Empty dependency array means this only runs once on mount
  }, []);

  // Format the due date
  const formattedDueDate = task.dueDate
    ? new Date(task.dueDate).toLocaleDateString()
    : 'Not set';

  return (
    <div className="p-4 bg-gray-800 rounded-lg space-y-2">
      <h3 className="text-lg font-semibold text-foreground">{task.title}</h3>

      <div>
        <StatusBadge status={task.status as any} />
      </div>

      <div className="flex space-x-2">
        <PriorityBadge priority={task.priority as any} />
        <ComplexityBadge complexity={toComplexity(task.complexity || 1)} />
      </div>

      <div>
        <DueDateBadge dueDate={task.dueDate} />
      </div>

      <div className="flex space-x-2">
        {onEdit && (
          <Button variant="default" size="sm" onClick={() => navigate(`/edit-task/${task._id}`)}>
            Edit
          </Button>
        )}
        {onDelete && (
          <Button variant="destructive" size="sm" onClick={() => onDelete(task._id)}>
            Delete
          </Button>
        )}
      </div>
    </div>
  );
};

export default TaskCard;
