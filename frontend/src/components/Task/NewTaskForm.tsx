import React, { useState, FormEvent } from 'react';
import { useTasks } from '../../hooks';
import { TaskStatus, TaskPriority } from '../../context/taskState';
import { getComplexityLabel } from '../../utils/complexityStats';
import { Button } from "@/components/ui/button";

interface NewTaskFormProps {
  onClose?: () => void;
}

/**
 * Map numeric complexity to string for backend
 */
function mapComplexityToString(value: number): string {
  if (value <= 2) return 'simple';
  if (value <= 5) return 'moderate';
  return 'complex';
}

/**
 * Form component for creating new tasks
 */
const NewTaskForm: React.FC<NewTaskFormProps> = ({ onClose }) => {
  const { addTask, loading, refreshTasks } = useTasks();

  // Form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [complexity, setComplexity] = useState(3); // Default to moderate complexity
  const [priority, setPriority] = useState<TaskPriority>('medium');
  const [status, setStatus] = useState<TaskStatus>('pending');
  const [dueDate, setDueDate] = useState('');

  // Validation state
  const [errors, setErrors] = useState<{
    title?: string;
    dueDate?: string;
  }>({});

  // API error state
  const [apiErrors, setApiErrors] = useState([]);

  // Form submission handler
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    // Validate form
    const newErrors: {
      title?: string;
      dueDate?: string;
    } = {};

    if (!title.trim()) {
      newErrors.title = 'Title is required';
    }

    if (dueDate && isNaN(Date.parse(dueDate))) {
      newErrors.dueDate = 'Please enter a valid date';
    }

    // If there are validation errors, update state and abort
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      setErrors({});
      setApiErrors([]);
      // Build payload matching backend schema
      const payload = {
        title,
        description: description || undefined,
        priority: priority || undefined,
        complexity: mapComplexityToString(complexity),
        status: status || undefined,
        ...(dueDate ? { dueDate: new Date(dueDate).toISOString() } : {})
      };
      console.log('Submitting payload to backend:', payload);
      await addTask(payload);
      await refreshTasks();
      console.log('Refreshed tasks after addTask in NewTaskForm');
      if (onClose) onClose();
      setTitle('');
      setDescription('');
      setComplexity(3);
      setPriority('medium');
      setStatus('pending');
      setDueDate('');
    } catch (error: any) {
      console.error('Failed to add task:', error);
      if (error && error.data) {
        console.error('Backend error response:', error.data);
      }
      if (error && error.data && error.data.errors) {
        setApiErrors(error.data.errors);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Title field */}
      <div>
        <label
          htmlFor="title"
          className="block text-sm font-medium text-gray-700"
        >
          Title <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm ${
            errors.title ? 'border-red-300' : ''
          }`}
          placeholder="Enter task title"
        />
        {errors.title && (
          <p className="mt-1 text-sm text-red-600">{errors.title}</p>
        )}
      </div>

      {/* Description field */}
      <div>
        <label
          htmlFor="description"
          className="block text-sm font-medium text-gray-700"
        >
          Description
        </label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          placeholder="Enter task description"
        />
      </div>

      {/* Complexity field */}
      <div>
        <label
          htmlFor="complexity"
          className="block text-sm font-medium text-gray-700"
        >
          Complexity: {complexity} - {getComplexityLabel(complexity)}
        </label>
        <input
          type="range"
          id="complexity"
          min="1"
          max="8"
          step="1"
          value={complexity}
          onChange={(e) => setComplexity(parseInt(e.target.value))}
          className="mt-1 block w-full"
        />
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>Simple (1)</span>
          <span>Moderate (4)</span>
          <span>Complex (8)</span>
        </div>
      </div>

      {/* Priority field */}
      <div>
        <label
          htmlFor="priority"
          className="block text-sm font-medium text-gray-700"
        >
          Priority
        </label>
        <select
          id="priority"
          value={priority}
          onChange={(e) => setPriority(e.target.value as TaskPriority)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
        >
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
      </div>

      {/* Status field */}
      <div>
        <label
          htmlFor="status"
          className="block text-sm font-medium text-gray-700"
        >
          Status
        </label>
        <select
          id="status"
          value={status}
          onChange={(e) => setStatus(e.target.value as TaskStatus)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
        >
          <option value="pending">Pending</option>
          <option value="in-progress">In Progress</option>
          <option value="completed">Completed</option>
          <option value="deferred">Deferred</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      {/* Due Date field */}
      <div>
        <label
          htmlFor="dueDate"
          className="block text-sm font-medium text-gray-700"
        >
          Due Date
        </label>
        <input
          type="date"
          id="dueDate"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm ${
            errors.dueDate ? 'border-red-300' : ''
          }`}
        />
        {errors.dueDate && (
          <p className="mt-1 text-sm text-red-600">{errors.dueDate}</p>
        )}
      </div>

      {/* Display backend validation errors */}
      {apiErrors.length > 0 && (
        <div className="mt-2">
          {apiErrors.map((err: any) => (
            <p key={err.field || err.param} className="text-red-600 text-sm">
              {err.field || err.param}: {err.message || err.msg}
            </p>
          ))}
        </div>
      )}

      {/* Form actions */}
      <div className="flex justify-end space-x-3 pt-4 border-t">
        {onClose && (
          <Button
            type="button"
            onClick={() => {
              console.log(
                'Cancel button clicked in AddTaskPage - returning to dashboard'
              );
              onClose();
            }}
            variant="outline"
            size="sm"
          >
            Cancel
          </Button>
        )}
        <Button
          type="submit"
          disabled={loading}
          onClick={() => console.log('Save Task button clicked')}
          className="inline-flex justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-foreground shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Saving...' : 'Save Task'}
        </Button>
      </div>
    </form>
  );
};

export default NewTaskForm;
