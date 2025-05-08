import React from 'react';
import { Circle } from 'lucide-react';

export function DueDateBadge({ dueDate }: { dueDate?: string }) {
  let color = '#a3a3a3'; // gray-400 for not set
  let label = 'Not set';
  let formatted = '';
  if (dueDate) {
    const now = new Date();
    const date = new Date(dueDate);
    formatted = date.toLocaleDateString();
    // Remove time for comparison
    const nowDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const dateDay = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    if (dateDay < nowDay) {
      color = '#ef4444'; // red-500 (overdue)
    } else if (dateDay.getTime() === nowDay.getTime()) {
      color = '#eab308'; // yellow-500 (today)
    } else {
      color = '#22c55e'; // green-500 (future)
    }
    label = formatted;
  }
  return (
    <span className="inline-flex items-center space-x-1 text-sm">
      <Circle size={12} color={color} fill={color} className="inline-block" />
      <span>{label}</span>
    </span>
  );
} 