import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useTasks } from '../../hooks';
import { Task } from '../../context/taskState';
import { Button } from "@/components/ui/button";

interface EditTaskFormProps {
  task: Task | null;
  onClose?: () => void;
  isLoading?: boolean;
}

// Form fields type (omit _id, allow string for status/priority)
type EditTaskFormFields = {
  title: string;
  description: string;
  complexity: number;
  priority: string;
  status: string;
  dueDate: string;
};

const defaultValues: EditTaskFormFields = {
  title: '',
  description: '',
  complexity: 1,
  priority: 'medium',
  status: 'pending',
  dueDate: '',
};

const EditTaskForm: React.FC<EditTaskFormProps> = ({ task, onClose, isLoading }) => {
  const { updateTask, refreshTasks } = useTasks();
  const { register, handleSubmit, reset, formState: { isSubmitting } } = useForm<EditTaskFormFields>({
    defaultValues,
  });

  useEffect(() => {
    if (task) {
      reset({
        title: task.title,
        description: task.description,
        complexity: task.complexity,
        priority: task.priority,
        status: task.status,
        dueDate: task.dueDate ? task.dueDate.slice(0, 10) : '',
      });
    }
  }, [task, reset]);

  const onSubmit = async (data: EditTaskFormFields) => {
    if (!task) return;
    try {
      await updateTask(task._id, {
        ...data,
        status: data.status as Task["status"],
        priority: data.priority as Task["priority"],
        dueDate: data.dueDate ? new Date(data.dueDate).toISOString() : undefined,
      });
      await refreshTasks();
      if (onClose) onClose();
    } catch (error) {
      console.error('Failed to update task:', error);
    }
  };

  if (isLoading) {
    return <p className="text-center text-gray-500">Loading task…</p>;
  }

  if (!task) {
    return <p className="text-center text-gray-500">No task found.</p>;
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700">
          Title <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="title"
          {...register('title', { required: true })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          placeholder="Enter task title"
        />
      </div>
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700">
          Description
        </label>
        <textarea
          id="description"
          {...register('description')}
          rows={3}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          placeholder="Enter task description"
        />
      </div>
      <div>
        <label htmlFor="complexity" className="block text-sm font-medium text-gray-700">
          Complexity
        </label>
        <select
          id="complexity"
          {...register('complexity', { valueAsNumber: true })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
        >
          <option value={1}>Simple (1)</option>
          <option value={4}>Moderate (4)</option>
          <option value={8}>Complex (8)</option>
        </select>
      </div>
      <div>
        <label htmlFor="priority" className="block text-sm font-medium text-gray-700">
          Priority
        </label>
        <select
          id="priority"
          {...register('priority')}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
        >
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
      </div>
      <div>
        <label htmlFor="status" className="block text-sm font-medium text-gray-700">
          Status
        </label>
        <select
          id="status"
          {...register('status')}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
        >
          <option value="pending">Pending</option>
          <option value="in-progress">In Progress</option>
          <option value="completed">Completed</option>
          <option value="deferred">Deferred</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>
      <div>
        <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700">
          Due Date
        </label>
        <input
          type="date"
          id="dueDate"
          {...register('dueDate')}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
        />
      </div>
      <div className="flex justify-end space-x-3 pt-4 border-t">
        {onClose && (
          <Button variant="outline" size="sm" onClick={onClose}>
            Cancel
          </Button>
        )}
        <Button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-foreground shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? 'Updating…' : 'Update Task'}
        </Button>
      </div>
    </form>
  );
};

export default EditTaskForm;
