import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MonthlyMapper } from '../MonthlyMapper';
import { Task } from '../../context/taskState';
import { addMonths, subMonths } from 'date-fns';

describe('MonthlyMapper', () => {
  const baseDate = new Date(2024, 4, 1); // May 2024
  const tasks: Task[] = [
    {
      _id: '1',
      title: 'Goal 1 Task',
      complexity: 3,
      status: 'pending',
      priority: 'high',
      dueDate: '2024-05-15T00:00:00.000Z',
      createdBy: 'user',
      createdAt: '2024-04-01T00:00:00.000Z',
      updatedAt: '2024-04-01T00:00:00.000Z',
      tags: ['goal-1'],
    },
    {
      _id: '2',
      title: 'Goal 2 Completed',
      complexity: 2,
      status: 'completed',
      priority: 'medium',
      dueDate: '2024-05-10T00:00:00.000Z',
      createdBy: 'user',
      createdAt: '2024-04-01T00:00:00.000Z',
      updatedAt: '2024-04-01T00:00:00.000Z',
      tags: ['goal-2'],
    },
    {
      _id: '3',
      title: 'No Rush Task',
      complexity: 1,
      status: 'pending',
      priority: 'low',
      dueDate: '2024-05-20T00:00:00.000Z',
      createdBy: 'user',
      createdAt: '2024-04-01T00:00:00.000Z',
      updatedAt: '2024-04-01T00:00:00.000Z',
      tags: [],
    },
    {
      _id: '4',
      title: 'Overdue Task',
      complexity: 2,
      status: 'pending',
      priority: 'medium',
      dueDate: '2024-05-01T00:00:00.000Z',
      createdBy: 'user',
      createdAt: '2023-04-01T00:00:00.000Z',
      updatedAt: '2023-04-01T00:00:00.000Z',
      tags: ['goal-1'],
    },
  ];

  it('renders the heading and navigation', () => {
    render(<MonthlyMapper tasks={tasks} initialDate={new Date(2024, 4, 1)} />);
    expect(screen.getByRole('heading', { name: /monthly mapper/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/back to dashboard/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/month navigation/i)).toBeInTheDocument();
  });

  it('shows tasks grouped by goal and "No Rush"', () => {
    render(<MonthlyMapper tasks={tasks} initialDate={new Date(2024, 4, 1)} />);
    expect(screen.getByText('Goal #1')).toBeInTheDocument();
    expect(screen.getByText('Goal #2')).toBeInTheDocument();
    expect(screen.getByText('No Rush Goals/Personal')).toBeInTheDocument();
    expect(screen.getByText('Goal 1 Task')).toBeInTheDocument();
    expect(screen.getByText('Goal 2 Completed')).toBeInTheDocument();
    expect(screen.getByText('No Rush Task')).toBeInTheDocument();
  });

  it('applies correct styling for overdue and completed tasks', () => {
    render(<MonthlyMapper tasks={tasks} initialDate={new Date(2024, 4, 1)} />);
    const overdue = screen.getByText('Goal 1 Task');
    expect(overdue).toHaveClass('bg-red-600');
    const completed = screen.getByText('Goal 2 Completed');
    expect(completed).toHaveClass('bg-green-700');
  });

  it('navigates months with prev/next buttons', () => {
    render(<MonthlyMapper tasks={tasks} initialDate={new Date(2024, 4, 1)} />);
    const monthLabel = screen.getByText(/may 2024/i);
    expect(monthLabel).toBeInTheDocument();
    const nextBtn = screen.getByLabelText(/next month/i);
    fireEvent.click(nextBtn);
    expect(screen.getByText(/june 2024/i)).toBeInTheDocument();
    const prevBtn = screen.getByLabelText(/previous month/i);
    fireEvent.click(prevBtn);
    fireEvent.click(prevBtn);
    expect(screen.getByText(/april 2024/i)).toBeInTheDocument();
  });

  it('calls onBack when back button is clicked', () => {
    const onBack = jest.fn();
    render(<MonthlyMapper tasks={tasks} onBack={onBack} initialDate={new Date(2024, 4, 1)} />);
    fireEvent.click(screen.getByLabelText(/back to dashboard/i));
    expect(onBack).toHaveBeenCalled();
  });

  it('matches snapshot', () => {
    const { asFragment } = render(<MonthlyMapper tasks={tasks} initialDate={new Date(2024, 4, 1)} />);
    expect(asFragment()).toMatchSnapshot();
  });
}); 