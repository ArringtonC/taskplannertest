import React, { useState, useEffect, useRef } from "react";
import { Task } from "@/types/task";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogFooter,
  DialogDescription
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import {
  RadioGroup,
  RadioGroupItem
} from "@/components/ui/radio-group";

export interface TaskFormData {
  title: string;
  status: Task["status"];
  priority: Task["priority"];
  complexity: string; // string: 'simple', 'moderate', or 'complex'
  dueDate?: string;
}

interface TaskFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (task: TaskFormData) => void;
  editingTask?: Task;
  allTasks: Task[];
  dialogClassName?: string;
}

export default function TaskForm({ isOpen, onClose, onSave, editingTask, allTasks, dialogClassName }: TaskFormProps) {
  const [title, setTitle] = useState("");
  const [status, setStatus] = useState("pending");
  const [priority, setPriority] = useState("medium");
  const [complexity, setComplexity] = useState("moderate");
  const [dueDate, setDueDate] = useState("");

  // Validation and loading states
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState(false);

  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (editingTask) {
      setTitle(editingTask.title);
      setStatus(editingTask.status);
      setPriority(editingTask.priority);
      let comp = editingTask.complexity;
      if (typeof comp === 'string') {
        setComplexity(comp);
      } else if (typeof comp === 'number') {
        setComplexity(
          comp <= 2 ? 'simple' : comp <= 5 ? 'moderate' : 'complex'
        );
      } else if (typeof comp === 'object' && comp !== null && 'score' in comp && typeof comp.score === 'number') {
        const score = comp.score;
        setComplexity(
          score <= 2 ? 'simple' : score <= 5 ? 'moderate' : 'complex'
        );
      } else {
        setComplexity('moderate');
      }
      setDueDate(editingTask.dueDate ? editingTask.dueDate.slice(0, 10) : "");
    } else {
      resetForm();
    }
    setErrors({});
    setLoading(false);
  }, [editingTask, isOpen]);

  useEffect(() => {
    if (!title.trim()) return;
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      const duplicate = allTasks.some(
        t =>
          t &&
          typeof t.title === 'string' &&
          t.title.trim().toLowerCase() === title.trim().toLowerCase() &&
          (!editingTask || t.id !== editingTask.id)
      );
      setErrors(prev => ({ ...prev, title: duplicate ? "A task with this title already exists." : "" }));
    }, 300);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [title, allTasks, editingTask]);

  const resetForm = () => {
    setTitle("");
    setStatus("pending");
    setPriority("medium");
    setComplexity("moderate");
    setDueDate("");
  };

  // Validation logic
  const validate = () => {
    const newErrors: { [key: string]: string } = {};
    if (!title.trim()) newErrors.title = "Title is required.";
    const duplicate = allTasks.some(
      t =>
        t &&
        typeof t.title === 'string' &&
        t.title.trim().toLowerCase() === title.trim().toLowerCase() &&
        (!editingTask || t.id !== editingTask.id)
    );
    if (duplicate) newErrors.title = "A task with this title already exists.";
    if (!status) newErrors.status = "Status is required.";
    if (!priority) newErrors.priority = "Priority is required.";
    if (!complexity || !['simple', 'moderate', 'complex'].includes(complexity)) newErrors.complexity = "Complexity must be simple, moderate, or complex.";
    if (dueDate && isNaN(Date.parse(dueDate))) newErrors.dueDate = "Due date is invalid.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const getComplexityLevel = (score: number) => {
    if (score <= 2) return "Simple";
    if (score <= 5) return "Moderate";
    return "Complex";
  };

  const getComplexityEmoji = (score: number) => {
    if (score <= 2) return "🟢";
    if (score <= 5) return "🟡";
    return "🔴";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    const newTask: TaskFormData = {
      title,
      status: status as Task["status"],
      priority: priority as Task["priority"],
      complexity, // string: 'simple', 'moderate', or 'complex'
      dueDate: dueDate || undefined // already yyyy-MM-dd
    };
    if (editingTask) {
      console.log('Submitting edit taskData:', newTask);
    }
    console.log('TaskForm dueDate before submit:', dueDate);
    console.log('TaskForm newTask:', newTask);
    console.log('Submitting newTask payload:', newTask);
    try {
      await onSave(newTask);
      setLoading(false);
      onClose();
    } catch (err) {
      setLoading(false);
      setErrors({ form: "Failed to save task. Please try again." });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className={`bg-[#1a2133] text-white border-none ${dialogClassName ? dialogClassName : 'sm:max-w-md w-full max-w-[95vw] max-h-[85vh] overflow-y-auto'}`}>
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center mb-2">{editingTask ? "Edit Task" : "Create New Task"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6 py-2">
          {/* Title */}
          <div className="space-y-1">
            <Label htmlFor="title">Task Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="bg-[#0f1421] border-gray-700 h-10 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full"
              placeholder="Enter task title"
            />
            {errors.title && <span className="text-red-400 text-sm block mt-1">{errors.title}</span>}
          </div>
          {/* Status */}
          <div className="space-y-1">
            <Label htmlFor="status">Status</Label>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger className="bg-[#0f1421] border-gray-700 h-10 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent className="bg-[#1a2133] border-gray-700">
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="in-progress">In Progress</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
                <SelectItem value="deferred">Deferred</SelectItem>
              </SelectContent>
            </Select>
            {errors.status && <span className="text-red-400 text-sm block mt-1">{errors.status}</span>}
          </div>
          {/* Priority */}
          <div className="space-y-1">
            <Label htmlFor="priority">Priority</Label>
            <Select value={priority} onValueChange={setPriority}>
              <SelectTrigger className="bg-[#0f1421] border-gray-700 h-10 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full">
                <SelectValue placeholder="Select priority" />
              </SelectTrigger>
              <SelectContent className="bg-[#1a2133] border-gray-700">
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
              </SelectContent>
            </Select>
            {errors.priority && <span className="text-red-400 text-sm block mt-1">{errors.priority}</span>}
          </div>
          {/* Complexity */}
          <div className="space-y-1">
            <Label htmlFor="complexity">Complexity</Label>
            <Select value={complexity} onValueChange={setComplexity}>
              <SelectTrigger className="bg-[#0f1421] border-gray-700 h-10 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full">
                <SelectValue placeholder="Select complexity" />
              </SelectTrigger>
              <SelectContent className="bg-[#1a2133] border-gray-700">
                <SelectItem value="simple">Simple</SelectItem>
                <SelectItem value="moderate">Moderate</SelectItem>
                <SelectItem value="complex">Complex</SelectItem>
              </SelectContent>
            </Select>
            {errors.complexity && <span className="text-red-400 text-sm block mt-1">{errors.complexity}</span>}
          </div>
          {/* Due Date */}
          <div className="space-y-1">
            <Label htmlFor="dueDate">Due Date</Label>
            <Input
              id="dueDate"
              type="date"
              placeholder="MM/DD/YYYY"
              value={dueDate ? dueDate.slice(0, 10) : ""}
              onChange={(e) => setDueDate(e.target.value)}
              className="bg-[#0f1421] border-gray-700 h-10 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full"
            />
            {errors.dueDate && <span className="text-red-400 text-sm block mt-1">{errors.dueDate}</span>}
          </div>
          <hr className="my-4 border-gray-700" />
          <DialogFooter>
            <div className="flex flex-col sm:flex-row gap-4 justify-end w-full">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="bg-transparent border-gray-500 hover:bg-gray-800 w-full sm:w-auto"
                disabled={loading}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 w-full sm:w-auto"
                disabled={loading}
              >
                {loading ? "Saving..." : editingTask ? "Update Task" : "Create Task"}
              </Button>
            </div>
          </DialogFooter>
          {errors.form && <div className="text-red-400 text-center mt-2">{errors.form}</div>}
        </form>
      </DialogContent>
    </Dialog>
  );
}
