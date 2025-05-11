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
}
