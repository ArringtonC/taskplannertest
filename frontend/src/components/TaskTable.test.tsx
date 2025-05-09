import React from 'react';
import { render, screen } from '@testing-library/react';
import TaskTable from './TaskTable';

const baseTask = {
  id: '1',
  status: 'pending',
  priority: 'medium',
  complexity: 'moderate',
};

describe('TaskTable', () => {
  it('renders the title or fallback', () => {
    render(
      <TaskTable
        tasks={[
          { ...baseTask, title: 'Test Task', dueDate: '2025-01-01T00:00:00.000Z' },
          { ...baseTask, id: '2', title: '', dueDate: '2025-01-01T00:00:00.000Z' },
          { ...baseTask, id: '3', title: undefined as any, dueDate: '2025-01-01T00:00:00.000Z' },
        ]}
        onEdit={() => {}}
        onDelete={() => {}}
      />
    );
    expect(screen.getByText('Test Task')).toBeInTheDocument();
    expect(screen.getAllByText('(No Title)').length).toBe(2);
  });

  it('renders dueDate as formatted date or fallback', () => {
    render(
      <TaskTable
        tasks={[
          { ...baseTask, title: 'Task 1', dueDate: '2025-01-01T00:00:00.000Z' },
          { ...baseTask, id: '2', title: 'Task 2', dueDate: undefined as any },
        ]}
        onEdit={() => {}}
        onDelete={() => {}}
      />
    );
    // Should show formatted date
    expect(screen.getByText(new Date('2025-01-01T00:00:00.000Z').toLocaleDateString())).toBeInTheDocument();
    // Should show fallback for missing dueDate
    expect(screen.getByText('Not set')).toBeInTheDocument();
  });
}); 