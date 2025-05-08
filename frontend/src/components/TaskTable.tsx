import React from 'react';
import { Button } from "@/components/ui/button";

// Define the Task interface
interface Task {
  _id: string;
  title: string;
  status: string;
  priority: string;
  complexity: string;
  dueDate: string | null;
}

interface TaskTableProps {
  tasks: Task[];
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
}

const TaskTable: React.FC<TaskTableProps> = ({ tasks, onEdit, onDelete }) => {
  // Helper function to get status badge styling
  const getStatusBadge = (status: string) => {
    const statusLower = status.toLowerCase();
    
    if (statusLower === 'pending') {
      return <span className="px-3 py-1 bg-yellow-500 text-foreground rounded-full">Pending</span>;
    } else if (statusLower === 'in-progress' || statusLower === 'in progress') {
      return <span className="px-3 py-1 bg-blue-500 text-foreground rounded-full">In-Progress</span>;
    } else if (statusLower === 'completed') {
      return <span className="px-3 py-1 bg-green-500 text-foreground rounded-full">Completed</span>;
    }
    
    return <span className="px-3 py-1 bg-gray-500 text-foreground rounded-full">{status}</span>;
  };
  
  // Helper function to get priority badge styling
  const getPriorityBadge = (priority: string) => {
    const priorityLower = priority.toLowerCase();
    
    if (priorityLower === 'high') {
      return <span className="px-3 py-1 bg-red-500 text-foreground rounded-full">High</span>;
    } else if (priorityLower === 'medium') {
      return <span className="px-3 py-1 bg-yellow-500 text-foreground rounded-full">Medium</span>;
    } else if (priorityLower === 'low') {
      return <span className="px-3 py-1 bg-green-500 text-foreground rounded-full">Low</span>;
    }
    
    return <span className="px-3 py-1 bg-gray-500 text-foreground rounded-full">{priority}</span>;
  };
  
  // Helper function to get complexity styling with emoji
  const getComplexityDisplay = (complexity: string) => {
    const complexityLower = complexity.toLowerCase();
    
    if (complexityLower === 'complex') {
      return <span className="text-red-500">🔴 Complex</span>;
    } else if (complexityLower === 'moderate') {
      return <span className="text-yellow-500">🟡 Moderate</span>;
    } else if (complexityLower === 'simple') {
      return <span className="text-green-500">🟢 Simple</span>;
    }
    
    return <span>{complexity}</span>;
  };
  
  // Helper function to get due date display
  const getDueDateDisplay = (dueDate: string | null) => {
    if (!dueDate) {
      return <span className="text-gray-400">Not set</span>;
    }
    
    return <span className="text-green-500">{dueDate}</span>;
  };

  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-border">
            <th className="py-2 px-4 text-left">TITLE</th>
            <th className="py-2 px-4 text-left">STATUS</th>
            <th className="py-2 px-4 text-left">PRIORITY</th>
            <th className="py-2 px-4 text-left">COMPLEXITY</th>
            <th className="py-2 px-4 text-left">DUE DATE</th>
            <th className="py-2 px-4 text-right">ACTIONS</th>
          </tr>
        </thead>
        <tbody>
          {tasks.map((task) => (
            <tr key={task._id} className="border-t border-border" data-testid="task-table-row">
              <td className="py-4 px-4">{task.title}</td>
              <td className="py-4 px-4">{getStatusBadge(task.status)}</td>
              <td className="py-4 px-4">{getPriorityBadge(task.priority)}</td>
              <td className="py-4 px-4">{getComplexityDisplay(task.complexity)}</td>
              <td className="py-4 px-4">{getDueDateDisplay(task.dueDate)}</td>
              <td className="py-4 px-4 text-right">
                <div className="flex justify-end space-x-4">
                  <Button 
                    variant="outline"
                    size="sm"
                    className="flex items-center"
                    onClick={() => onEdit(task)}
                  >
                    <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path>
                    </svg>
                    Edit
                  </Button>
                  <Button 
                    variant="outline"
                    size="sm"
                    className="flex items-center"
                    onClick={() => onDelete(task._id)}
                  >
                    <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                    </svg>
                    Delete
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TaskTable; 