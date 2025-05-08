import React from 'react';
import { Circle } from 'lucide-react';

type Complexity = 1 | 2 | 3 | 4 | 5;

const COMPLEXITY_MAP: Record<Complexity, { label: string; color: string }> = {
  1: { label: 'Trivial',      color: 'bg-green-500' },
  2: { label: 'Easy',         color: 'bg-blue-500' },
  3: { label: 'Moderate',     color: 'bg-yellow-500' },
  4: { label: 'Complex',      color: 'bg-orange-500' },
  5: { label: 'Very Complex', color: 'bg-red-500' },
};

export function ComplexityBadge({ complexity }: { complexity: Complexity }) {
  const { label, color } = COMPLEXITY_MAP[complexity] ?? COMPLEXITY_MAP[3];
  // Convert Tailwind color class to hex for the icon
  const colorHexMap: Record<string, string> = {
    'bg-green-500': '#22c55e',
    'bg-blue-500': '#3b82f6',
    'bg-yellow-500': '#eab308',
    'bg-orange-500': '#f59e42',
    'bg-red-500': '#ef4444',
  };
  const iconColor = colorHexMap[color] || '#eab308';
  return (
    <span className="inline-flex items-center space-x-1 text-sm">
      <Circle size={14} color={iconColor} fill={iconColor} className="inline-block" />
      <span>{label}</span>
    </span>
  );
}
