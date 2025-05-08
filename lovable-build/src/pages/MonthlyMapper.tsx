
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Task } from "@/types/task";
import { format, addMonths, subMonths } from "date-fns";

// Sample tasks for demonstration
const initialTasks: Task[] = [
  {
    id: "1",
    title: "Get car tag",
    status: "pending",
    priority: "medium",
    complexity: { score: 2, level: "Simple", emoji: "🟢" },
    dueDate: "3/1/2025"
  },
  {
    id: "2",
    title: "Read chapter 1 of Japanese book",
    status: "pending",
    priority: "medium",
    complexity: { score: 3, level: "Moderate", emoji: "🟡" },
    dueDate: "3/2/2025"
  },
  {
    id: "3",
    title: "Read 5th book of the Bible obadaih and create Bible reading plan",
    status: "pending",
    priority: "medium",
    complexity: { score: 4, level: "Moderate", emoji: "🟡" },
    dueDate: "3/3/2025"
  },
  {
    id: "4",
    title: "Update Resume to linkedin",
    status: "pending",
    priority: "high",
    complexity: { score: 3, level: "Moderate", emoji: "🟡" },
    dueDate: "3/4/2025"
  },
  {
    id: "5",
    title: "See how much money it would cost for covered call strategy",
    status: "pending",
    priority: "medium",
    complexity: { score: 5, level: "Moderate", emoji: "🟡" },
    dueDate: "3/5/2025"
  },
  {
    id: "6",
    title: "Apply for another job",
    status: "pending",
    priority: "high",
    complexity: { score: 4, level: "Moderate", emoji: "🟡" },
    dueDate: "3/6/2025"
  },
  {
    id: "7",
    title: "Get social security card",
    status: "pending",
    priority: "medium",
    complexity: { score: 3, level: "Moderate", emoji: "🟡" },
    dueDate: "3/7/2025"
  },
  {
    id: "8",
    title: "Update plan for stock bot and break it apart",
    status: "pending",
    priority: "medium",
    complexity: { score: 6, level: "Complex", emoji: "🔴" },
    dueDate: "3/8/2025"
  },
  {
    id: "9",
    title: "Get Tires",
    status: "pending",
    priority: "low",
    complexity: { score: 2, level: "Simple", emoji: "🟢" },
    dueDate: "3/9/2025"
  },
  {
    id: "10",
    title: "Finish March tasks for bot",
    status: "pending",
    priority: "medium",
    complexity: { score: 5, level: "Moderate", emoji: "🟡" },
    dueDate: "3/10/2025"
  },
  {
    id: "17",
    title: "Read Chapter 2 of my japanese book",
    status: "overdue",
    priority: "high",
    complexity: { score: 3, level: "Moderate", emoji: "🟡" },
    dueDate: "3/17/2025"
  },
  {
    id: "18",
    title: "Help dad update his house by cleaning downstairs",
    status: "pending",
    priority: "medium",
    complexity: { score: 3, level: "Moderate", emoji: "🟡" },
    dueDate: "3/18/2025"
  }
];

const MAX_GOALS = 20;

export default function MonthlyMapper() {
  const navigate = useNavigate();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  
  const month = format(currentDate, "MMMM");
  const year = format(currentDate, "yyyy");
  
  const handlePrevMonth = () => {
    setCurrentDate(subMonths(currentDate, 1));
  };
  
  const handleNextMonth = () => {
    setCurrentDate(addMonths(currentDate, 1));
  };

  // Group tasks by their row index (representing goal numbers)
  const getTasksByGoalNumber = () => {
    const groupedTasks: Record<number, Task[]> = {};
    
    tasks.forEach((task, index) => {
      const goalNumber = (index % MAX_GOALS) + 1;
      if (!groupedTasks[goalNumber]) {
        groupedTasks[goalNumber] = [];
      }
      groupedTasks[goalNumber].push(task);
    });
    
    return groupedTasks;
  };
  
  const tasksByGoal = getTasksByGoalNumber();

  // Get task status color
  const getTaskColor = (task: Task | undefined) => {
    if (!task) return "bg-green-400"; // Default green
    
    if (task.status.toLowerCase() === "overdue") {
      return "bg-red-500 text-white";
    }
    
    return "bg-green-400"; // Default to green as in the image
  };
  
  return (
    <div className="min-h-screen bg-gray-900 text-black p-4">
      <div className="max-w-full mx-auto">
        <div className="mb-6 flex items-center">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => navigate("/")}
            className="mr-4 bg-transparent border-gray-700 hover:bg-gray-800 text-white"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
          <div className="flex-1 flex justify-center items-center">
            <Button 
              variant="outline"
              size="sm"
              onClick={handlePrevMonth}
              className="mr-2 bg-transparent border-gray-700 hover:bg-gray-800 text-white"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <h1 className="text-4xl font-bold text-white mx-4">{month}</h1>
            <Button 
              variant="outline"
              size="sm"
              onClick={handleNextMonth}
              className="ml-2 bg-transparent border-gray-700 hover:bg-gray-800 text-white"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        <div className="bg-gray-800 border border-gray-700 rounded-lg overflow-hidden">
          {/* Excel-like table */}
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  <th className="border border-gray-700 bg-gray-600 text-white p-2 w-24">Goal #</th>
                  <th className="border border-gray-700 bg-gray-600 text-white p-2 flex-1">{month}</th>
                </tr>
              </thead>
              <tbody>
                {Array.from({ length: MAX_GOALS }).map((_, index) => {
                  const goalNumber = index + 1;
                  const task = tasksByGoal[goalNumber]?.[0];
                  
                  return (
                    <tr key={goalNumber}>
                      <td className="border border-gray-700 bg-gray-500 text-white p-2">
                        Goals {goalNumber}
                      </td>
                      <td 
                        className={`border border-gray-700 p-2 ${getTaskColor(task)}`}
                      >
                        {task?.title || ""}
                      </td>
                    </tr>
                  );
                })}
                <tr>
                  <td className="border border-gray-700 bg-gray-500 text-white p-2">
                    No Rush Goals/Personal
                  </td>
                  <td className="border border-gray-700 bg-green-400 p-2">
                    Help dad update his house by cleaning downstairs
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
