import axios, { InternalAxiosRequestConfig } from "axios";
import { Task } from "../types/task";

const API_URL = import.meta.env.DEV ? "/api" : "http://localhost:8080";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: false,
});

// Interceptor para adicionar o token de autenticação
api.interceptors.request.use(
  (
    config: InternalAxiosRequestConfig<any>
  ): InternalAxiosRequestConfig<any> => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers.set("Authorization", `Bearer ${token}`);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptador para tratamento de erros
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response) {
      // Erro de autenticação
      if (error.response.status === 401) {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("user");
        window.location.href = "/login";
      }

      // Erro de CORS
      if (error.response.status === 0 && error.message.includes("CORS")) {
        console.error("Erro de CORS: Verifique a configuração do servidor");
      }

      return Promise.reject(error.response.data);
    }

    return Promise.reject(error);
  }
);

export const taskService = {
  async getTasks(userId: string): Promise<Task[]> {
    const response = await api.get(`/task/user/${userId}`);
    return response.data;
  },
  async getTaskId(id: string): Promise<Task[]> {
    const response = await api.get(`/task/${id}`);
    return response.data;
  },

  async createTask(task: Omit<Task, "id" | "createdAt">): Promise<Task> {
    const response = await api.post("/task", task);
    return response.data;
  },

  async updateTask(taskId: string, task: Partial<Task>): Promise<void> {
    await api.put(`/task/${taskId}`, task);
  },

  async deleteTask(taskId: string): Promise<void> {
    await api.delete(`/task/${taskId}`);
  },
};

export const llamaService = {
  async generateDescription(prompt: string): Promise<{ response: string }> {
    const response = await api.post("/api/llama", { prompt });
    return response.data;
  },
};

export default api;
