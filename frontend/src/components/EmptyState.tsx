import React from 'react';
import { Button } from "@/components/ui/button";

interface EmptyStateProps {
  title: string;
  message: string;
  icon?: React.ReactNode;
  actionText?: string;
  onAction?: () => void;
}

/**
 * A reusable empty state component for consistent UI
 */
const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  message,
  icon,
  actionText,
  onAction,
}) => {
  return (
    <div className="flex flex-col justify-center items-center h-64 bg-white p-8 rounded-lg shadow-sm">
      {icon || (
        <svg
          className="w-16 h-16 text-gray-400 mb-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
          />
        </svg>
      )}
      <h3 className="text-lg font-medium text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600 mb-4 text-center">{message}</p>

      {actionText && onAction && (
        <Button variant="default" onClick={onAction}>
          {actionText}
        </Button>
      )}
    </div>
  );
};

export default EmptyState;
