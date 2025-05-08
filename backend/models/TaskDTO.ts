export interface TaskDTO {
  id: string;
  title: string;
  description?: string;
  priority?: 'low' | 'medium' | 'high';
  complexity?: 'simple' | 'moderate' | 'complex';
  dueDate?: string; // ISO date
  status?: 'pending' | 'in-progress' | 'completed' | 'cancelled' | 'deferred';
  tags?: string[];
  createdBy: string;
  assignedTo: string;
  project: string;
  parentTask: string;
  subtasks?: string[];
  dependencies?: string[];
  createdAt: string;
  updatedAt: string;
} 