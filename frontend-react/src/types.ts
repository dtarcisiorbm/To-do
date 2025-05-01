export interface User {
  id: string;
  name: string;
  email: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  userId: string;
}

export interface CreateTaskRequest {
  title: string;
  description: string;
}
