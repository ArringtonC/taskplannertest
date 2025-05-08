
export interface Task {
  id: string;
  title: string;
  status: string;
  priority: string;
  complexity: {
    score: number;
    level: string;
    emoji: string;
  };
  dueDate: string | null;
}
