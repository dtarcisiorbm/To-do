import axios from "axios";
import { getToken } from "./auth";

const API_URL = import.meta.env.DEV ? '/api' : 'http://localhost:8080';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
  xsrfCookieName: 'XSRF-TOKEN',
  xsrfHeaderName: 'X-XSRF-TOKEN',
});

// Interceptor para adicionar o token em todas as requisições
api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export interface Task {
  id: string;
  title: string;
  description: string;
  status: "PENDING" | "IN_PROGRESS" | "COMPLETED";
  createdAt: string;
  updatedAt: string;
  userId: string;
}

export interface CreateTaskRequest {
  title: string;
  description: string;
}

export interface UpdateTaskRequest {
  title?: string;
  description?: string;
  status?: "PENDING" | "IN_PROGRESS" | "COMPLETED";
}

class TaskService {
  async getTasks(): Promise<Task[]> {
    const response = await api.get("/task");
    return response.data;
  }

  async getTaskById(id: string): Promise<Task> {
    const response = await api.get(`/task/${id}`);
    return response.data;
  }

  async getTasksForUser(userId: string): Promise<Task[]> {
    console.log("Fetching tasks for user:", userId);
    const response = await api.get(`/task/${userId}`);
    console.log("Tasks for user:", response.data);
    return response.data;
  }


  async createTask(data: CreateTaskRequest): Promise<Task> {
    console.log("Creating task:", data);
    const response = await api.post("/task", data);
    return response.data;
  }

  async updateTask(id: string, data: UpdateTaskRequest): Promise<Task> {
    const response = await api.put(`/task/${id}`, data);
    return response.data;
  }

  async deleteTask(id: string): Promise<void> {
    await api.delete(`/task/${id}`);
  }
}

export const taskService = new TaskService();
