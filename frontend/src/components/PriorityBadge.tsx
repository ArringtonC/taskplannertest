import React, { useRef, useEffect } from 'react';
import { Circle } from 'lucide-react';

type Priority = 'low' | 'medium' | 'high';

const PRIORITY_COLOR_MAP: Record<Priority, string> = {
  low:    '#22c55e', // green-500
  medium: '#eab308', // yellow-500
  high:   '#ef4444', // red-500
};

export function PriorityBadge({ priority }: { priority: Priority }) {
  const label = priority.charAt(0).toUpperCase() + priority.slice(1);
  const color = PRIORITY_COLOR_MAP[priority] ?? PRIORITY_COLOR_MAP.medium;
  return (
    <span className="inline-flex items-center space-x-1 px-3 py-1 rounded-full text-sm">
      <Circle size={12} color={color} fill={color} className="inline-block" />
      <span>{label}</span>
    </span>
  );
}
