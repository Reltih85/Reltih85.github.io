export type TaskStatus = 'todo' | 'inprogress' | 'done';

export interface Task {
  id: string;
  title: string;
  status: TaskStatus;
  hours: number;
  owner: string;
}

export interface Project {
  id: string;
  name: string;

  // 🔐 protección (opcional)
  locked?: boolean;
  passwordSalt?: string;
  passwordHash?: string;

  tasks: Task[];
}
