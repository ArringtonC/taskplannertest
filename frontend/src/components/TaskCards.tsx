
import React, { useEffect } from "react";
import { Task } from "@/types/task";
import { format, isSameMonth } from "date-fns";

interface TaskCardsProps {
  tasks: Task[];
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

declare global {
  interface Window {
    adsbygoogle: any[];
  }
}

export default function TaskCards({ tasks, onEdit, onDelete }: TaskCardsProps) {
  useEffect(() => {
    // Load Google AdSense script
    const script = document.createElement('script');
    script.src = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-XXXXXXXXXXXXXXXX';
    script.async = true;
    script.crossOrigin = 'anonymous';
    document.head.appendChild(script);

    // Initialize ads when script loads
    script.onload = () => {
      try {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      } catch (error) {
        console.error('Ad loading error:', error);
      }
    };

    return () => {
      // Cleanup
      document.head.removeChild(script);
    };
  }, []);

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed":
        return "bg-green-400";
      case "in-progress":
        return "bg-yellow-400";
      case "pending":
      default:
        return "bg-green-400"; // Default to green like in image
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case "high":
        return "border-l-4 border-red-500";
      case "medium":
        return "border-l-4 border-yellow-500";
      case "low":
        return "border-l-4 border-green-500";
      default:
        return "";
    }
  };

  // Get current date to filter tasks
  const currentDate = new Date();
  
  // Filter tasks for current month
  const currentMonthTasks = tasks.filter(task => {
    if (!task.dueDate) return false;
    const taskDate = new Date(task.dueDate);
    return isSameMonth(taskDate, currentDate);
  });

  // Sort tasks by priority and then by due date
  const sortedTasks = [...currentMonthTasks].sort((a, b) => {
    const priorityOrder = { high: 0, medium: 1, low: 2 };
    const aPriority = priorityOrder[a.priority.toLowerCase()] || 3;
    const bPriority = priorityOrder[b.priority.toLowerCase()] || 3;
    
    if (aPriority !== bPriority) return aPriority - bPriority;
    
    // If priorities are the same, sort by due date
    if (!a.dueDate) return 1;
    if (!b.dueDate) return -1;
    return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
  });

  return (
    <div className="w-full">
      <h2 className="text-xl font-semibold mb-4 text-white">
        Tasks for {format(currentDate, "MMMM yyyy")}
      </h2>
      
      {/* Google AdSense Ad - Top of tasks list */}
      <div className="w-full mb-4 bg-gray-800 p-2 flex justify-center">
        <ins className="adsbygoogle"
          style={{ display: 'block', width: '100%', height: '90px' }}
          data-ad-client="ca-pub-XXXXXXXXXXXXXXXX"
          data-ad-slot="XXXXXXXXXX"
          data-ad-format="auto"
          data-full-width-responsive="true">
        </ins>
        <div className="text-xs text-gray-500">Advertisement</div>
      </div>
      
      {sortedTasks.length === 0 && (
        <p className="text-gray-400 italic">No tasks for the current month</p>
      )}
      
      {sortedTasks.map((task, index) => (
        <React.Fragment key={task.id}>
          {/* Insert an ad after every 3 tasks */}
          {index > 0 && index % 3 === 0 && (
            <div className="w-full my-2 bg-gray-800 p-2 flex justify-center">
              <ins className="adsbygoogle"
                style={{ display: 'block', width: '100%', height: '90px' }}
                data-ad-client="ca-pub-XXXXXXXXXXXXXXXX"
                data-ad-slot="XXXXXXXXXX"
                data-ad-format="auto"
                data-full-width-responsive="true">
              </ins>
              <div className="text-xs text-gray-500">Advertisement</div>
            </div>
          )}
          
          <div 
            className={`w-full mb-1 p-4 ${getStatusColor(task.status)} ${getPriorityColor(task.priority)} hover:opacity-90 cursor-pointer transition-opacity`}
            onClick={() => onEdit(task.id)}
          >
            <div className="flex justify-between items-center">
              <div className="font-medium">{task.title}</div>
              <div className="flex space-x-2">
                {task.complexity?.emoji}
                {task.dueDate && (
                  <span className="text-sm text-gray-700">
                    {task.dueDate}
                  </span>
                )}
              </div>
            </div>
          </div>
        </React.Fragment>
      ))}
      
      {/* Google AdSense Ad - Bottom of tasks list */}
      <div className="w-full mt-4 bg-gray-800 p-2 flex justify-center">
        <ins className="adsbygoogle"
          style={{ display: 'block', width: '100%', height: '90px' }}
          data-ad-client="ca-pub-XXXXXXXXXXXXXXXX"
          data-ad-slot="XXXXXXXXXX"
          data-ad-format="auto"
          data-full-width-responsive="true">
        </ins>
        <div className="text-xs text-gray-500">Advertisement</div>
      </div>
    </div>
  );
}
