
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import { Task } from "@/types/task";
import TaskTable from "@/components/TaskTable";
import TaskCards from "@/components/TaskCards";
import TaskForm from "@/components/TaskForm";
import { toast } from "sonner";

// Initial sample data with updated complexity
const initialTasks: Task[] = [
  {
    id: "1",
    title: "Sample Task 1",
    status: "pending",
    priority: "medium",
    complexity: { 
      score: 3, 
      level: "Moderate",
      emoji: "🟡" 
    },
    dueDate: "5/30/2025"
  },
  {
    id: "2",
    title: "Sample Task 2",
    status: "in-progress",
    priority: "high",
    complexity: { 
      score: 5, 
      level: "Moderate",
      emoji: "🟡" 
    },
    dueDate: "6/14/2025"
  },
  {
    id: "3",
    title: "task 3 its lit",
    status: "pending",
    priority: "medium",
    complexity: { 
      score: 3, 
      level: "Moderate",
      emoji: "🟡" 
    },
    dueDate: null
  },
  {
    id: "4",
    title: "task 4 new task",
    status: "pending",
    priority: "medium",
    complexity: { 
      score: 7, 
      level: "Complex",
      emoji: "🔴" 
    },
    dueDate: "7/30/2025"
  }
];

const Index = () => {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [view, setView] = useState<"table" | "cards">("table");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | undefined>(undefined);

  const handleAddTask = () => {
    setEditingTask(undefined);
    setIsFormOpen(true);
  };

  const handleEditTask = (id: string) => {
    const task = tasks.find(t => t.id === id);
    if (task) {
      setEditingTask(task);
      setIsFormOpen(true);
    }
  };

  const handleDeleteTask = (id: string) => {
    setTasks(tasks.filter(task => task.id !== id));
    toast.success("Task deleted successfully");
  };

  const handleSaveTask = (taskData: Omit<Task, "id">) => {
    if (editingTask) {
      setTasks(tasks.map(task => 
        task.id === editingTask.id ? { ...taskData, id: task.id } : task
      ));
      toast.success("Task updated successfully");
    } else {
      const newTask: Task = {
        ...taskData,
        id: Date.now().toString()
      };
      setTasks([...tasks, newTask]);
      toast.success("Task created successfully");
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col">
      <div className="max-w-7xl w-full mx-auto px-4 py-8">
        <h1 className="text-5xl font-bold text-center mb-6">Task Planner Dashboard</h1>
        
        <div className="text-center mb-8">
          <p className="text-xl text-gray-300">{tasks.length} tasks total</p>
        </div>
        
        <div className="flex justify-center mb-6">
          <div className="inline-flex rounded-md bg-gray-800 p-1">
            <Button
              variant={view === "table" ? "default" : "ghost"}
              className={view === "table" ? "bg-gray-700" : "bg-transparent text-gray-300"}
              onClick={() => setView("table")}
            >
              Table
            </Button>
            <Button
              variant={view === "cards" ? "default" : "ghost"}
              className={view === "cards" ? "bg-gray-700" : "bg-transparent text-gray-300"}
              onClick={() => setView("cards")}
            >
              Cards
            </Button>
            <Button
              onClick={handleAddTask}
              className="bg-blue-600 hover:bg-blue-700 text-white ml-2"
            >
              <PlusIcon className="h-4 w-4 mr-1" />
              Add Task
            </Button>
          </div>
        </div>
        
        <div className="border-t border-b border-gray-700 py-6">
          {view === "table" ? (
            <TaskTable 
              tasks={tasks} 
              onEdit={handleEditTask} 
              onDelete={handleDeleteTask}
            />
          ) : (
            <TaskCards 
              tasks={tasks} 
              onEdit={handleEditTask} 
              onDelete={handleDeleteTask}
            />
          )}
        </div>
        
        <div className="flex justify-center gap-4 mt-8">
          <Button 
            variant="outline" 
            onClick={() => navigate("/dependency-graph")}
            className="bg-transparent border-gray-700 hover:bg-gray-800"
          >
            View Dependency Graph
          </Button>
          <Button 
            variant="outline" 
            onClick={() => navigate("/monthly-mapper")}
            className="bg-transparent border-gray-700 hover:bg-gray-800"
          >
            Monthly Mapper
          </Button>
          <Button
            variant="outline"
            className="bg-transparent border-gray-700 hover:bg-gray-800"
          >
            Analyze Workload
          </Button>
          <Button
            variant="outline"
            className="bg-transparent border-gray-700 hover:bg-gray-800"
          >
            Export Task List
          </Button>
        </div>
        
        <TaskForm 
          isOpen={isFormOpen}
          onClose={() => setIsFormOpen(false)}
          onSave={handleSaveTask}
          editingTask={editingTask}
        />
      </div>
    </div>
  );
};

export default Index;
