
import React from "react";
import { Task } from "@/types/task";
import { Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface TaskTableProps {
  tasks: Task[];
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

export default function TaskTable({ tasks, onEdit, onDelete }: TaskTableProps) {
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "pending":
        return "bg-yellow-500";
      case "in-progress":
        return "bg-blue-500";
      case "completed":
        return "bg-green-500";
      default:
        return "bg-gray-500";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case "high":
        return "bg-red-500";
      case "medium":
        return "bg-yellow-500";
      case "low":
        return "bg-green-500";
      default:
        return "bg-gray-500";
    }
  };

  const getDueDateColor = (dueDate: string | null) => {
    if (!dueDate) return "";
    
    const due = new Date(dueDate);
    const today = new Date();
    const diffDays = Math.ceil((due.getTime() - today.getTime()) / (1000 * 3600 * 24));
    
    if (diffDays < 0) return "bg-gray-500"; // Past due
    if (diffDays <= 3) return "bg-red-500 animate-pulse"; // 3 days or less
    if (diffDays <= 7) return "bg-yellow-500"; // 7 days or less
    return "bg-green-500"; // More than 7 days
  };

  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full text-left">
        <thead>
          <tr className="border-b border-gray-700">
            <th className="py-4 px-2 text-gray-200 font-semibold tracking-wide">TITLE</th>
            <th className="py-4 px-2 text-gray-200 font-semibold tracking-wide">STATUS</th>
            <th className="py-4 px-2 text-gray-200 font-semibold tracking-wide">PRIORITY</th>
            <th className="py-4 px-2 text-gray-200 font-semibold tracking-wide">COMPLEXITY</th>
            <th className="py-4 px-2 text-gray-200 font-semibold tracking-wide">DUE DATE</th>
            <th className="py-4 px-2 text-gray-200 font-semibold tracking-wide">ACTIONS</th>
          </tr>
        </thead>
        <tbody>
          {tasks.map((task) => (
            <tr key={task.id} className="border-b border-gray-800">
              <td className="py-4 px-2 text-white">{task.title}</td>
              <td className="py-4 px-2">
                <span className={`inline-block px-2 py-1 rounded-md text-white text-xs ${getStatusColor(task.status)}`}>
                  {task.status}
                </span>
              </td>
              <td className="py-4 px-2">
                <span className={`inline-block px-2 py-1 rounded-md text-white text-xs ${getPriorityColor(task.priority)}`}>
                  {task.priority === "high" ? "🔴 High" : 
                   task.priority === "medium" ? "🟡 Medium" : 
                   task.priority === "low" ? "🟢 Low" : task.priority}
                </span>
              </td>
              <td className="py-4 px-2 text-white">
                {task.complexity?.emoji || (
                  task.complexity.score <= 2 ? "🟢" : 
                  task.complexity.score <= 5 ? "🟡" : "🔴"
                )} {task.complexity.level}
              </td>
              <td className="py-4 px-2 text-white">
                {task.dueDate ? (
                  <span className={`flex items-center gap-2`}>
                    <span className={`inline-block w-3 h-3 rounded-full ${getDueDateColor(task.dueDate)}`}></span>
                    {task.dueDate}
                  </span>
                ) : "Not set"}
              </td>
              <td className="py-4 px-2 flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => onEdit(task.id)}
                  className="bg-transparent border-gray-700 text-white hover:bg-gray-700"
                >
                  <Edit className="h-4 w-4 mr-1" />
                  Edit
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => onDelete(task.id)}
                  className="bg-transparent border-gray-700 text-white hover:bg-gray-700"
                >
                  <Trash2 className="h-4 w-4 mr-1" />
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
