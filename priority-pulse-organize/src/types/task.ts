export enum Priority {
  BAIXA = "BAIXA",
  MEDIA = "MEDIA",
  ALTA = "ALTA",
}

export interface Category {
  id: string;
  name: string;
  color: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  category: string;
  completed: boolean;
  priority: Priority;
  dueDate: Date | null;
  createdAt: Date;
  userId?: string; // ID do usuário dono da task
  assignedTo?: string; // ID do usuário designado para a task (se aplicável)
  status?: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
  comments?: string[];
  attachments?: string[];
  tags?: string[];
}
