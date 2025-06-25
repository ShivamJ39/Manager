
// src/app/models/task.model.ts

export interface Subtask {
  id?: number;           // Optional (if DB auto-generates)
  title: string;
  completed?: boolean;
  taskModelId?: number;  // Foreign key to parent task
}

export interface Task {
  id?: number;            // Optional (set by SQL backend)
  title: string;
  status?: 'active' | 'completed';
  subtasks?: Subtask[];
}
