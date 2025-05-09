import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Task } from "@/types/task";
import { format, addMonths, subMonths } from "date-fns";
import { getTasks, createTask, updateTask } from "../lib/api";
import { toast } from "sonner";
import TaskForm, { TaskFormData } from "@/components/TaskForm";

const MAX_GOALS = 20;

// Map backend task to frontend Task type
function mapBackendTask(task: any) {
  return {
    id: task._id,
    title: task.title,
    status: task.status,
    priority: task.priority,
    complexity: {
      score: typeof task.complexity === 'object' ? task.complexity.score : task.complexity,
      level: typeof task.complexity === 'object' ? task.complexity.level : (task.complexity <= 2 ? 'Simple' : task.complexity <= 5 ? 'Moderate' : 'Complex'),
      emoji: typeof task.complexity === 'object' ? task.complexity.emoji : (task.complexity <= 2 ? '🟢' : task.complexity <= 5 ? '🟡' : '🔴'),
    },
    dueDate: task.dueDate || null,
  };
}

export default function MonthlyMapper() {
  const navigate = useNavigate();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | undefined>(undefined);
  const [addGoalNumber, setAddGoalNumber] = useState<number | null>(null);

  const month = format(currentDate, "MMMM");
  const year = format(currentDate, "yyyy");

  useEffect(() => {
    setLoading(true);
    getTasks()
      .then(res => setTasks(res.data.map(mapBackendTask)))
      .catch(() => toast.error("Failed to load tasks from backend"))
      .finally(() => setLoading(false));
  }, []);

  // Filter tasks by selected month/year
  const filteredTasks = tasks.filter(task => {
    if (!task.dueDate) return false;
    const due = new Date(task.dueDate);
    return due.getMonth() === currentDate.getMonth() && due.getFullYear() === currentDate.getFullYear();
  });

  console.log('All tasks:', tasks);
  console.log('Filtered tasks for', month, year, ':', filteredTasks);

  // Group tasks by their row index (representing goal numbers)
  const getTasksByGoalNumber = () => {
    const groupedTasks: Record<number, Task[]> = {};
    filteredTasks.forEach((task, index) => {
      const goalNumber = (index % MAX_GOALS) + 1;
      if (!groupedTasks[goalNumber]) {
        groupedTasks[goalNumber] = [];
      }
      groupedTasks[goalNumber].push(task);
    });
    return groupedTasks;
  };

  // Tasks with no dueDate for 'No Rush Goals/Personal'
  const noRushTasks = tasks.filter(task => !task.dueDate);

  const tasksByGoal = getTasksByGoalNumber();

  const handlePrevMonth = () => {
    setCurrentDate(subMonths(currentDate, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(addMonths(currentDate, 1));
  };

  // Get task status color
  const getTaskColor = (task: Task | undefined) => {
    if (!task) return "bg-green-400"; // Default green
    if (task.status.toLowerCase() === "overdue") {
      return "bg-red-500 text-white";
    }
    return "bg-green-400"; // Default to green as in the image
  };

  // Add or update a task
  const handleSaveTask = async (formData: TaskFormData) => {
    try {
      setLoading(true);
      if (editingTask) {
        // Update task
        await updateTask(editingTask.id, {
          title: formData.title,
          status: formData.status,
          priority: formData.priority,
          complexity: formData.complexity,
          dueDate: formData.dueDate,
        });
        toast.success("Task updated!");
      } else {
        // Add new task
        await createTask({
          title: formData.title,
          status: formData.status,
          priority: formData.priority,
          complexity: formData.complexity,
          dueDate: formData.dueDate,
        });
        toast.success("Task added!");
      }
      setShowForm(false);
      setEditingTask(undefined);
      setAddGoalNumber(null);
      // Refresh tasks
      getTasks()
        .then(res => setTasks(res.data.map(mapBackendTask)))
        .catch(() => toast.error("Failed to reload tasks"));
    } catch (err) {
      toast.error("Failed to save task");
    } finally {
      setLoading(false);
    }
  };

  // Open add form for a specific goal
  const handleAddTask = (goalNumber: number) => {
    setEditingTask(undefined);
    setAddGoalNumber(goalNumber);
    setShowForm(true);
  };

  // Open edit form for a specific task
  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setAddGoalNumber(null);
    setShowForm(true);
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
            <h1 className="text-4xl font-bold text-white mx-4">Timeline for the Month: {month}</h1>
            <Button 
              variant="outline"
              size="sm"
              onClick={handleNextMonth}
              className="ml-2 bg-transparent border-gray-700 hover:bg-gray-800 text-white"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
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
          {/* Excel-like table */}
          <div className="overflow-x-auto">
            {loading ? (
              <div className="text-center text-gray-400 py-8">Loading tasks...</div>
            ) : filteredTasks.length === 0 ? (
              <div className="text-center text-gray-400 py-8">No tasks for {month} {year}. Try adding one or navigating months.</div>
            ) : (
              <table className="w-full border-collapse">
                <thead>
                  <tr>
                    <th className="border border-gray-700 bg-gray-600 text-white p-2 w-24">Goal #</th>
                    <th className="border border-gray-700 bg-gray-600 text-white p-2 flex-1">{month}</th>
                    <th className="border border-gray-700 bg-gray-600 text-white p-2 w-12">Add</th>
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
                          className={`border border-gray-700 p-2 cursor-pointer ${getTaskColor(task)}`}
                          title={task ? "Click to edit task" : "No task for this goal"}
                          onClick={() => task && handleEditTask(task)}
                        >
                          {task?.title || ""}
                        </td>
                        <td className="border border-gray-700 p-2 text-center">
                          <Button
                            size="icon"
                            variant="outline"
                            className="bg-transparent border-gray-700 hover:bg-gray-800 text-white"
                            title="Add task to this goal"
                            onClick={() => handleAddTask(goalNumber)}
                          >
                            +
                          </Button>
                        </td>
                      </tr>
                    );
                  })}
                  <tr>
                    <td className="border border-gray-700 bg-gray-500 text-white p-2">
                      No Rush Goals/Personal
                    </td>
                    <td className="border border-gray-700 bg-green-400 p-2" colSpan={2}>
                      {noRushTasks.length > 0
                        ? noRushTasks.map(t => t.title).join(", ")
                        : ""}
                    </td>
                  </tr>
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
      {/* TaskForm Modal for Add/Edit */}
      <TaskForm
        isOpen={showForm}
        onClose={() => { setShowForm(false); setEditingTask(undefined); setAddGoalNumber(null); }}
        onSave={async (formData) => {
          // For add, set dueDate to first day of selected month if not set
          let dueDate = formData.dueDate;
          if (!dueDate && addGoalNumber) {
            dueDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).toISOString().slice(0, 10);
          }
          await handleSaveTask({ ...formData, dueDate });
        }}
        editingTask={editingTask}
        allTasks={tasks}
        dialogClassName="max-w-lg"
      />
    </div>
  );
}
