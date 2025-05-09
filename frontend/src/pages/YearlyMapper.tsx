import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Calendar, ChevronLeft, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Task } from "@/types/task";
import { format, addYears, subYears, parse } from "date-fns";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { getTasks } from "../lib/api";
import { toast } from "sonner";

// Define month names
const monthNames = [
  "January", "February", "March", "April", 
  "May", "June", "July", "August", 
  "September", "October", "November", "December"
];

// Map backend task to frontend Task type (copied from Index.tsx)
function mapBackendTask(task: any) {
  let complexityObj;
  if (typeof task.complexity === 'object' && task.complexity !== null) {
    complexityObj = task.complexity;
  } else if (typeof task.complexity === 'string') {
    let score, level, emoji;
    switch (task.complexity) {
      case 'simple':
        score = 1; level = 'Simple'; emoji = '🟢'; break;
      case 'moderate':
        score = 3; level = 'Moderate'; emoji = '🟡'; break;
      case 'complex':
        score = 5; level = 'Complex'; emoji = '🔴'; break;
      default:
        score = 3; level = 'Moderate'; emoji = '🟡';
    }
    complexityObj = { score, level, emoji };
  } else {
    const score = typeof task.complexity === 'number' ? task.complexity : 3;
    complexityObj = {
      score,
      level: score <= 2 ? 'Simple' : score <= 5 ? 'Moderate' : 'Complex',
      emoji: score <= 2 ? '🟢' : score <= 5 ? '🟡' : '🔴',
    };
  }
  return {
    id: task._id || task.id || `${task.title}-${Math.random()}`,
    title: task.title || '(No Title)',
    status: task.status || 'pending',
    priority: task.priority || 'medium',
    complexity: complexityObj,
    dueDate: task.dueDate || null,
  };
}

export default function YearlyMapper() {
  const navigate = useNavigate();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(false);
  
  const year = format(currentDate, "yyyy");
  
  useEffect(() => {
    setLoading(true);
    getTasks()
      .then(res => setTasks(res.data.map(mapBackendTask)))
      .catch(() => toast.error("Failed to load tasks from backend"))
      .finally(() => setLoading(false));
  }, []);
  
  const handlePrevYear = () => {
    setCurrentDate(subYears(currentDate, 1));
  };
  
  const handleNextYear = () => {
    setCurrentDate(addYears(currentDate, 1));
  };

  // Get task by month (handle ISO, yyyy-MM-dd, and M/d/yyyy)
  const getTasksByMonth = () => {
    const groupedTasks: Record<string, Task[]> = {};
    monthNames.forEach(month => {
      groupedTasks[month] = [];
    });
    tasks.forEach(task => {
      if (task.dueDate) {
        let date: Date | null = null;
        // Try ISO/"yyyy-MM-dd" first
        if (/^\d{4}-\d{2}-\d{2}/.test(task.dueDate)) {
          date = new Date(task.dueDate);
        } else {
          try {
            date = parse(task.dueDate, "M/d/yyyy", new Date());
          } catch {
            date = null;
          }
        }
        if (date && format(date, "yyyy") === year) {
          const monthName = format(date, "MMMM");
          groupedTasks[monthName].push(task);
        }
      }
    });
    return groupedTasks;
  };
  
  const tasksByMonth = getTasksByMonth();
  
  // Get status color for a task
  const getTaskColor = (task: Task) => {
    if (task.status.toLowerCase() === "overdue") {
      return "bg-red-500 text-white";
    }
    return "bg-green-400";
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
              onClick={handlePrevYear}
              className="mr-2 bg-transparent border-gray-700 hover:bg-gray-800 text-white"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <h1 className="text-4xl font-bold text-white mx-4">{year}</h1>
            <Button 
              variant="outline"
              size="sm"
              onClick={handleNextYear}
              className="ml-2 bg-transparent border-gray-700 hover:bg-gray-800 text-white"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => navigate("/monthly-mapper")}
            className="ml-4 bg-transparent border-gray-700 hover:bg-gray-800 text-white"
          >
            <Calendar className="h-4 w-4 mr-2" />
            Monthly View
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate("/analyze-workload")}
            className="ml-4 bg-transparent border-gray-700 hover:bg-gray-800 text-white"
          >
            Analyze Workload
          </Button>
        </div>
        
        <div className="bg-gray-800 border border-gray-700 rounded-lg overflow-hidden">
          <ScrollArea className="h-[70vh]">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-white font-bold" colSpan={3}>
                    {year} Yearly Tasks Overview
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {monthNames.map((month) => (
                  <React.Fragment key={month}>
                    <TableRow className="border-t border-gray-700 bg-gray-600">
                      <TableCell 
                        colSpan={3} 
                        className="py-2 text-lg font-bold text-white"
                        onClick={() => navigate("/monthly-mapper")}
                        style={{ cursor: "pointer" }}
                      >
                        {month}
                      </TableCell>
                    </TableRow>
                    {tasksByMonth[month] && tasksByMonth[month].length > 0 ? (
                      tasksByMonth[month].map((task) => (
                        <TableRow key={task.id} className={getTaskColor(task)}>
                          <TableCell className="w-1/2">{task.title}</TableCell>
                          <TableCell className="w-1/4">
                            {typeof task.complexity === 'object' && task.complexity !== null
                              ? `${task.complexity.emoji} ${task.complexity.level}`
                              : String(task.complexity)}
                          </TableCell>
                          <TableCell className="w-1/4">
                            Priority: {task.priority}
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={3} className="text-center italic text-gray-500">
                          No tasks for {month}
                        </TableCell>
                      </TableRow>
                    )}
                  </React.Fragment>
                ))}
              </TableBody>
            </Table>
          </ScrollArea>
        </div>
      </div>
    </div>
  );
}
