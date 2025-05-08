
import React, { useState, useEffect } from "react";
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

interface TaskFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (task: Omit<Task, "id">) => void;
  editingTask?: Task;
}

export default function TaskForm({ isOpen, onClose, onSave, editingTask }: TaskFormProps) {
  const [title, setTitle] = useState("");
  const [status, setStatus] = useState("pending");
  const [priority, setPriority] = useState("medium");
  const [complexityScore, setComplexityScore] = useState("3");
  const [dueDate, setDueDate] = useState("");

  useEffect(() => {
    if (editingTask) {
      setTitle(editingTask.title);
      setStatus(editingTask.status);
      setPriority(editingTask.priority);
      setComplexityScore(editingTask.complexity.score.toString());
      setDueDate(editingTask.dueDate || "");
    } else {
      resetForm();
    }
  }, [editingTask, isOpen]);

  const resetForm = () => {
    setTitle("");
    setStatus("pending");
    setPriority("medium");
    setComplexityScore("3");
    setDueDate("");
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const scoreNum = parseInt(complexityScore, 10);
    const level = getComplexityLevel(scoreNum);
    const emoji = getComplexityEmoji(scoreNum);
    
    const newTask: Omit<Task, "id"> = {
      title,
      status,
      priority,
      complexity: {
        score: scoreNum,
        level,
        emoji
      },
      dueDate: dueDate || null
    };
    
    onSave(newTask);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-gray-800 text-white border-gray-700">
        <DialogHeader>
          <DialogTitle>{editingTask ? "Edit Task" : "Create New Task"}</DialogTitle>
          <DialogDescription className="text-gray-400">
            Fill in the details for your task below.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Task title"
                className="bg-gray-700 border-gray-600"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="status">Status</Label>
              <Select value={status} onValueChange={(value) => setStatus(value)}>
                <SelectTrigger className="bg-gray-700 border-gray-600">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent className="bg-gray-700 border-gray-600">
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="in-progress">In Progress</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="priority">Priority</Label>
              <RadioGroup 
                value={priority} 
                onValueChange={setPriority}
                className="flex space-x-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="low" id="priority-low" />
                  <Label htmlFor="priority-low" className="flex items-center">
                    <span className="inline-block w-3 h-3 rounded-full bg-green-500 mr-2"></span>
                    🟢 Low
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="medium" id="priority-medium" />
                  <Label htmlFor="priority-medium" className="flex items-center">
                    <span className="inline-block w-3 h-3 rounded-full bg-yellow-500 mr-2"></span>
                    🟡 Medium
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="high" id="priority-high" />
                  <Label htmlFor="priority-high" className="flex items-center">
                    <span className="inline-block w-3 h-3 rounded-full bg-red-500 mr-2"></span>
                    🔴 High
                  </Label>
                </div>
              </RadioGroup>
            </div>
            <div className="grid gap-2">
              <Label>Complexity</Label>
              <RadioGroup 
                value={complexityScore} 
                onValueChange={setComplexityScore} 
                className="grid grid-cols-3 gap-2"
              >
                <div className="flex flex-col items-center p-2 border border-gray-600 rounded-md cursor-pointer hover:bg-gray-700 transition-colors">
                  <RadioGroupItem value="1" id="complexity-1" className="sr-only" />
                  <Label htmlFor="complexity-1" className="flex flex-col items-center cursor-pointer">
                    <span className="text-2xl">🟢</span>
                    <span>Simple</span>
                  </Label>
                </div>
                <div className="flex flex-col items-center p-2 border border-gray-600 rounded-md cursor-pointer hover:bg-gray-700 transition-colors">
                  <RadioGroupItem value="4" id="complexity-4" className="sr-only" />
                  <Label htmlFor="complexity-4" className="flex flex-col items-center cursor-pointer">
                    <span className="text-2xl">🟡</span>
                    <span>Moderate</span>
                  </Label>
                </div>
                <div className="flex flex-col items-center p-2 border border-gray-600 rounded-md cursor-pointer hover:bg-gray-700 transition-colors">
                  <RadioGroupItem value="7" id="complexity-7" className="sr-only" />
                  <Label htmlFor="complexity-7" className="flex flex-col items-center cursor-pointer">
                    <span className="text-2xl">🔴</span>
                    <span>Complex</span>
                  </Label>
                </div>
              </RadioGroup>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="dueDate">Due Date</Label>
              <Input
                id="dueDate"
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="bg-gray-700 border-gray-600"
              />
            </div>
          </div>
          <DialogFooter>
            <Button 
              type="button" 
              variant="outline" 
              onClick={onClose}
              className="bg-transparent border-gray-600 hover:bg-gray-700"
            >
              Cancel
            </Button>
            <Button 
              type="submit"
              className="bg-blue-600 hover:bg-blue-700"
            >
              {editingTask ? "Update Task" : "Create Task"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
