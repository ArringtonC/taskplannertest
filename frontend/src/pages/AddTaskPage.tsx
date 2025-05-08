import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTasks } from '../hooks';
import PageLayout from '../components/PageLayout';
import NewTaskForm from '../components/Task/NewTaskForm';

/**
 * Dedicated page for adding a new task
 */
const AddTaskPage: React.FC = () => {
  const navigate = useNavigate();

  // Handle when form is closed (either completed or cancelled)
  const handleFormClose = () => {
    navigate('/');
  };

  return (
    <PageLayout
      title="Add New Task"
      subtitle="Create a task with details including priority, complexity, and due date"
      backLink="/"
    >
      <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-md p-6">
        <NewTaskForm onClose={handleFormClose} />
      </div>
    </PageLayout>
  );
};

export default AddTaskPage;
