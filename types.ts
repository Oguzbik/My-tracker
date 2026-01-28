export interface SubTask {
  id: string;
  label: string;
  notes?: string;
}

export interface TaskBlock {
  id: string;
  title: string;
  tasks: SubTask[];
}

// Key is Date string YYYY-MM-DD, Value is array of completed task IDs
export type HistoryLog = Record<string, string[]>;

export interface DailyStats {
  totalTasks: number;
  completedTasks: number;
  percentage: number;
  isPerfect: boolean;
}

export interface GlobalStats {
  currentStreak: number;
  maxStreak: number;
  totalPerfectDays: number;
  totalXp: number;
  level: string;
  nextLevelXp: number;
}