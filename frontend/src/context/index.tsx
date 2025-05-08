import React from 'react';
import { TaskProvider } from './TaskContext';

/**
 * Props for the app provider
 */
interface AppProviderProps {
  children: React.ReactNode;
}

/**
 * Root app provider that combines all context providers
 * @param children React children components
 */
export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  return <TaskProvider>{children}</TaskProvider>;
};

// Export all context hooks
export { useTaskContext } from './TaskContext';
