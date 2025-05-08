import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTasks } from '../hooks';
import PageLayout from '../components/PageLayout';
import EditTaskForm from '../components/Task/EditTaskForm';
import EmptyState from '../components/EmptyState';

const MAX_RETRIES = 3;

const EditTaskPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { fetchTaskById } = useTasks();

  const [task, setTask] = useState<any>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [inFlight, setInFlight] = useState(false);

  useEffect(() => {
    console.log('[EditTaskPage] useParams id =', id);
    if (!id) {
      console.warn('No task ID—redirecting home');
      navigate('/');
      return;
    }

    let cancelled = false;

    async function tryFetch(id: string, maxAttempts = MAX_RETRIES) {
      for (let attempt = 1; attempt <= maxAttempts; attempt++) {
        const controller = new AbortController();
        try {
          setInFlight(true);
          console.log(`[EditTaskPage] Fetch attempt #${attempt} for id:`, id);
          const t = await fetchTaskById(id, { signal: controller.signal });
          if (!cancelled) {
            setTask(t);
            setErrorMsg(!t ? 'Task not found' : null);
          }
          setInFlight(false);
          return;
        } catch (e: any) {
          if (e.name === 'AbortError') {
            console.log(`[EditTaskPage] Attempt ${attempt} was aborted—will retry`);
          } else {
            console.error(`[EditTaskPage] Attempt ${attempt} failed:`, e);
          }
          if (attempt < maxAttempts) {
            await new Promise(res => setTimeout(res, attempt * 500));
          } else {
            if (!cancelled) setErrorMsg(e.message || 'Error loading task');
            setInFlight(false);
          }
        }
      }
    }

    setTask(null);
    setErrorMsg(null);
    tryFetch(id);

    return () => {
      cancelled = true;
      // Each fetch attempt gets its own controller, so nothing to abort here
    };
  }, [id, fetchTaskById, navigate]);

  const handleClose = () => navigate('/');

  return (
    <PageLayout
      title="Edit Task"
      subtitle={
        errorMsg
          ? undefined
          : `Edit details for: ${task?.title ?? ' …'}`
      }
      backLink="/"
    >
      <div
        className="max-w-3xl mx-auto bg-white rounded-lg shadow-md p-6"
        style={{ minHeight: '32rem' }}
      >
        {errorMsg ? (
          <EmptyState
            title={errorMsg === 'Task not found' ? 'Not Found' : 'Error'}
            message={errorMsg}
            actionText="Back"
            onAction={handleClose}
          />
        ) : (
          <EditTaskForm
            task={task}
            isLoading={!task || inFlight}
            onClose={handleClose}
          />
        )}
      </div>
    </PageLayout>
  );
};

export default EditTaskPage; 