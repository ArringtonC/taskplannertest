import React, { useState } from "react";
import { Button } from "@/components/ui/button";

const sampleTasks = [
  {
    id: 1,
    title: "Sample Task 1",
    status: "pending",
    priority: "Medium",
    complexity: "Moderate",
    dueDate: "5/30/2025",
  },
  {
    id: 2,
    title: "Sample Task 2",
    status: "in-progress",
    priority: "High",
    complexity: "Moderate",
    dueDate: "6/14/2025",
  },
  {
    id: 3,
    title: "task 3 its lit",
    status: "pending",
    priority: "Medium",
    complexity: "Moderate",
    dueDate: null,
  },
  {
    id: 4,
    title: "task 4 new task",
    status: "pending",
    priority: "Medium",
    complexity: "Complex",
    dueDate: "7/30/2025",
  },
];

const statusBadge = (status: string) => {
  if (status.toLowerCase() === "pending")
    return (
      <span className="inline-flex items-center px-3 py-1 rounded bg-yellow-500/20 text-yellow-400 font-medium text-base capitalize">
        <span className="w-2.5 h-2.5 rounded-full bg-yellow-400 mr-2"></span>
        pending
      </span>
    );
  if (status.toLowerCase() === "in-progress")
    return (
      <span className="inline-flex items-center px-3 py-1 rounded bg-blue-500/20 text-blue-400 font-medium text-base capitalize">
        <span className="w-2.5 h-2.5 rounded-full bg-blue-400 mr-2"></span>
        in-progress
      </span>
    );
  return (
    <span className="inline-flex items-center px-3 py-1 rounded bg-gray-500/20 text-gray-400 font-medium text-base capitalize">
      <span className="w-2.5 h-2.5 rounded-full bg-gray-400 mr-2"></span>
      {status}
    </span>
  );
};

const priorityBadge = (priority: string) => {
  let dot = "bg-yellow-400";
  let bg = "bg-yellow-500/20";
  let text = "text-yellow-400";
  if (priority === "High") {
    dot = "bg-red-500";
    bg = "bg-red-500/20";
    text = "text-red-400";
  } else if (priority === "Low") {
    dot = "bg-green-500";
    bg = "bg-green-500/20";
    text = "text-green-400";
  }
  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded ${bg} ${text} font-medium text-base`}
    >
      <span className={`w-2.5 h-2.5 rounded-full mr-2 ${dot}`}></span>
      {priority}
    </span>
  );
};

const complexityDot = (complexity: string) => {
  let color = "bg-yellow-400";
  if (complexity === "Complex") color = "bg-red-500";
  else if (complexity === "Simple") color = "bg-green-500";
  return (
    <span className={`w-2.5 h-2.5 rounded-full mr-2 ${color} inline-block`}></span>
  );
};

const dueDateCell = (dueDate: string | null) =>
  dueDate && dueDate !== "Not set" ? (
    <span className="inline-flex items-center">
      <span className="w-2 h-2 rounded-full bg-green-500 mr-2"></span>
      {dueDate}
    </span>
  ) : (
    <span className="text-gray-400">Not set</span>
  );

const ActionButtons = () => (
  <div className="flex gap-2 justify-center">
    <Button
      variant="outline"
      size="sm"
      className="flex items-center gap-2 px-4 py-2 border border-gray-700 rounded-md hover:bg-gray-800 transition-colors focus:outline-none"
      tabIndex={0}
    >
      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path>
      </svg>
      Edit
    </Button>
    <Button
      variant="outline"
      size="sm"
      className="flex items-center gap-2 px-4 py-2 border border-gray-700 rounded-md hover:bg-gray-800 transition-colors focus:outline-none"
      tabIndex={0}
    >
      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
      </svg>
      Delete
    </Button>
  </div>
);

const TaskPlanner = () => {
  const [viewMode, setViewMode] = useState("table");
  const [tasks] = useState(sampleTasks);

  return (
    <div className="bg-background text-foreground min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2">Task Planner Dashboard</h1>
          <p className="text-gray-400">{tasks.length} tasks total</p>
        </div>

        {/* Controls */}
        <div className="flex justify-center items-center gap-4 mb-8">
          <div className="bg-gray-800 rounded-lg overflow-hidden flex">
            <button
              className={`px-6 py-3 transition-colors ${
                viewMode === "table" ? "bg-gray-700" : ""
              }`}
              onClick={() => setViewMode("table")}
            >
              Table
            </button>
            <button
              className={`px-6 py-3 transition-colors ${
                viewMode === "cards" ? "bg-gray-700" : ""
              }`}
              onClick={() => setViewMode("cards")}
            >
              Cards
            </button>
          </div>
          <button className="bg-primary text-foreground px-5 py-3 rounded-lg flex items-center gap-2 hover:bg-blue-700 transition-colors focus:outline-none">
            <span className="text-lg font-bold">+</span> Add Task
          </button>
        </div>

        {/* Table */}
        <div className="w-full border-t border-b border-gray-700 mb-8">
          {/* Table Header */}
          <div className="flex py-4 text-gray-400 text-sm font-semibold">
            <div className="w-1/6 text-center">TITLE</div>
            <div className="w-1/6 text-center">STATUS</div>
            <div className="w-1/6 text-center">PRIORITY</div>
            <div className="w-1/6 text-center">COMPLEXITY</div>
            <div className="w-1/6 text-center">DUE DATE</div>
            <div className="w-1/6 text-center">ACTIONS</div>
          </div>
          {/* Table Rows */}
          {tasks.map((task) => (
            <div key={task.id} className="flex py-4 border-t border-gray-700 items-center">
              <div className="w-1/6 text-center">{task.title}</div>
              <div className="w-1/6 text-center">{statusBadge(task.status)}</div>
              <div className="w-1/6 text-center">{priorityBadge(task.priority)}</div>
              <div className="w-1/6 text-center flex items-center justify-center">
                {complexityDot(task.complexity)}
                {task.complexity}
              </div>
              <div className="w-1/6 text-center">{dueDateCell(task.dueDate)}</div>
              <div className="w-1/6 flex justify-center">
                <ActionButtons />
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Toolbar */}
        <div className="flex justify-center gap-4 mt-8">
          <Button variant="outline" size="sm" className="px-5 py-3 border border-gray-700 rounded-lg hover:bg-gray-800 transition-colors focus:outline-none">
            View Dependency Graph
          </Button>
          <Button variant="outline" size="sm" className="px-5 py-3 border border-gray-700 rounded-lg hover:bg-gray-800 transition-colors focus:outline-none">
            Monthly Mapper
          </Button>
          <Button variant="outline" size="sm" className="px-5 py-3 border border-gray-700 rounded-lg hover:bg-gray-800 transition-colors focus:outline-none">
            Analyze Workload
          </Button>
          <Button variant="outline" size="sm" className="px-5 py-3 border border-gray-700 rounded-lg hover:bg-gray-800 transition-colors focus:outline-none">
            Export Task List
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TaskPlanner; 