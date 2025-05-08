import React from 'react';
import { Circle } from 'lucide-react';

type Status = 'pending' | 'in-progress' | 'done';

const STATUS_COLOR_MAP: Record<Status, string> = {
  pending:      '#eab308', // yellow-500
  'in-progress':'#3b82f6', // blue-500
  done:         '#22c55e', // green-500
};

export function StatusBadge({ status }: { status: Status }) {
  const color = STATUS_COLOR_MAP[status] ?? STATUS_COLOR_MAP.pending;
  const label = status.replace(/-/, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
  return (
    <span className="inline-flex items-center space-x-1 px-3 py-1 rounded-full text-sm">
      <Circle size={12} color={color} fill={color} className="inline-block" />
      <span>{label}</span>
    </span>
  );
}
