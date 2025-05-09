import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import { Task } from "../types/task";
import TaskTable from "@/components/TaskTable";
import TaskCards from "@/components/TaskCards";
import TaskForm from "@/components/TaskForm";
import { toast } from "sonner";
import { getTasks, createTask, updateTask, deleteTask } from "../lib/api";
import type { Task as LocalTask } from "../types/task";
import Papa from "papaparse";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

// Map backend task to frontend Task type
function mapBackendTask(task: any) {
  let complexityObj;
  if (typeof task.complexity === 'object' && task.complexity !== null) {
    complexityObj = task.complexity;
  } else if (typeof task.complexity === 'string') {
    // Map string to object
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
    // fallback for number or missing
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

// Map frontend Task to backend shape
function mapFrontendTask(task: any) {
  return {
    title: task.title,
    status: task.status,
    priority: task.priority,
    complexity: task.complexity,
    dueDate: task.dueDate,
  };
}

// Helper to format dueDate as yyyy-MM-dd
function formatDueDate(date: string | null | undefined) {
  if (!date) return date;
  // If already yyyy-MM-dd, return as is
  if (/^\d{4}-\d{2}-\d{2}$/.test(date)) return date;
  // If ISO string, extract date part
  if (typeof date === 'string' && date.includes('T')) return date.split('T')[0];
  // Otherwise, try to convert
  return new Date(date).toISOString().slice(0, 10);
}

const Index = () => {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [view, setView] = useState<"table" | "cards">("table");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | undefined>(undefined);
  const [loading, setLoading] = useState(false);
  const [importModalOpen, setImportModalOpen] = useState(false);
  const [importText, setImportText] = useState("");

  // Load tasks from backend on mount
  useEffect(() => {
    setLoading(true);
    getTasks()
      .then(res => setTasks(res.data.map(mapBackendTask)))
      .catch(() => toast.error("Failed to load tasks from backend"))
      .finally(() => setLoading(false));
  }, []);

  const handleAddTask = () => {
    console.log('Add Task button clicked');
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

  const handleDeleteTask = async (id: string) => {
    try {
      await deleteTask(id);
      setTasks(tasks.filter(task => task.id !== id));
      toast.success("Task deleted successfully");
    } catch {
      toast.error("Failed to delete task");
    }
  };

  const handleSaveTask = async (taskData: import("@/components/TaskForm").TaskFormData) => {
    console.log('Submitting taskData:', taskData);
    const payload = {
      ...taskData,
      dueDate: formatDueDate(taskData.dueDate),
    };
    if (editingTask) {
      try {
        const updated = await updateTask(editingTask.id, mapFrontendTask(payload));
        setTasks(tasks.map(task => task.id === editingTask.id ? mapBackendTask(updated.data) : task));
        toast.success("Task updated successfully");
      } catch {
        toast.error("Failed to update task");
      }
    } else {
      try {
        const created = await createTask(mapFrontendTask(payload));
        setTasks([...tasks, mapBackendTask(created.data)]);
        toast.success("Task created successfully");
      } catch {
        toast.error("Failed to create task");
      }
    }
    setIsFormOpen(false);
  };

  useEffect(() => {
    console.log('isFormOpen changed:', isFormOpen);
  }, [isFormOpen]);

  useEffect(() => {
    if (isFormOpen) {
      console.log('TaskForm rendered');
    }
  }, [isFormOpen]);

  // Before rendering, filter out tasks with missing or empty title
  const filteredTasks = tasks.filter(task => typeof task.title === 'string' && task.title.trim() !== '');

  // Export tasks as CSV
  const handleExportTasks = () => {
    if (!tasks.length) return;
    const headers = ["Title","Status","Priority","Complexity","Due Date"];
    const rows = tasks.map(task => [
      task.title,
      task.status,
      task.priority,
      task.complexity,
      task.dueDate ? formatDueDate(task.dueDate) : ""
    ]);
    const csvContent = [headers, ...rows]
      .map(row => row.map(field => `"${String(field).replace(/"/g, '""')}"`).join(","))
      .join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "tasks.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Helper to get last day of current month as yyyy-MM-dd
  function getEndOfMonth() {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString().slice(0, 10);
  }

  // Import tasks from textarea
  const handleImportTasks = async () => {
    const lines = importText.split("\n").map(line => line.trim()).filter(line => line.length > 0);
    let successCount = 0;
    let failCount = 0;
    for (const title of lines) {
      try {
        const newTask = {
          title,
          status: "pending",
          priority: "medium",
          complexity: "moderate",
          dueDate: getEndOfMonth(),
        };
        const created = await createTask(newTask);
        setTasks(prev => [...prev, mapBackendTask(created.data)]);
        successCount++;
      } catch {
        failCount++;
      }
    }
    if (successCount > 0) toast.success(`${successCount} tasks imported successfully`);
    if (failCount > 0) toast.error(`${failCount} tasks failed to import`);
    setImportModalOpen(false);
    setImportText("");
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
          {loading ? (
            <div className="text-center text-gray-400">Loading tasks...</div>
          ) : view === "table" ? (
            <TaskTable 
              tasks={filteredTasks} 
              onEdit={handleEditTask} 
              onDelete={handleDeleteTask}
            />
          ) : (
            <TaskCards 
              tasks={filteredTasks} 
              onEdit={handleEditTask} 
              onDelete={handleDeleteTask}
            />
          )}
        </div>
        <div className="flex justify-center gap-4 mt-8">
          <Button 
            variant="outline" 
            onClick={() => navigate("/monthly-mapper")}
            className="bg-transparent border-gray-700 hover:bg-gray-800"
          >
            Timeline for the Month
          </Button>
          <Button
            variant="outline"
            onClick={() => navigate("/yearly-mapper")}
            className="bg-transparent border-gray-700 hover:bg-gray-800"
          >
            Yearly Mapper
          </Button>
          <Button
            variant="outline"
            onClick={() => navigate("/analyze-workload")}
            className="bg-transparent border-gray-700 hover:bg-gray-800"
          >
            Analyze Workload
          </Button>
          <Button
            variant="outline"
            onClick={handleExportTasks}
            className="bg-transparent border-gray-700 hover:bg-gray-800"
          >
            Export Task List
          </Button>
          <Button
            variant="outline"
            onClick={() => setImportModalOpen(true)}
            className="bg-transparent border-gray-700 hover:bg-gray-800"
          >
            Import Tasks
          </Button>
        </div>
        <TaskForm 
          isOpen={isFormOpen}
          onClose={() => {
            console.log('TaskForm onClose called');
            setIsFormOpen(false);
          }}
          onSave={handleSaveTask}
          editingTask={editingTask}
          allTasks={tasks}
        />
      </div>
      <Dialog open={importModalOpen} onOpenChange={setImportModalOpen}>
        <DialogContent className="bg-[#1a2133] text-white border-none max-w-md w-full">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-center mb-2">Import Tasks</DialogTitle>
          </DialogHeader>
          <div className="mb-4">
            <label htmlFor="import-tasks-textarea" className="block mb-2 text-sm font-medium">Paste or type task titles (one per line):</label>
            <textarea
              id="import-tasks-textarea"
              value={importText}
              onChange={e => setImportText(e.target.value)}
              rows={8}
              className="w-full p-2 rounded bg-[#0f1421] border border-gray-700 text-white"
              placeholder="Task 1\nTask 2\nTask 3"
            />
          </div>
          <DialogFooter>
            <Button
              onClick={handleImportTasks}
              className="bg-blue-600 hover:bg-blue-700 w-full"
              disabled={!importText.trim()}
            >
              Import
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Index;
