import axios, { InternalAxiosRequestConfig, AxiosError } from "axios";
import { authService } from "./authService";
import { Task } from "../types/task";

const API_URL = import.meta.env.DEV ? "/api" : "http://localhost:8080";

interface QueueItem {
  resolve: (value?: unknown) => void;
  reject: (reason?: unknown) => void;
}

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: false,
});

// Flag para controlar se já está renovando o token
let isRefreshing = false;
let failedQueue: QueueItem[] = [];

const processQueue = (error: Error | null = null, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });

  failedQueue = [];
};

// Interceptor para adicionar o token de autenticação
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
    const token = authService.getToken();
    if (token) {
      config.headers.set("Authorization", `Bearer ${token}`);
    }
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// Interceptador para tratamento de erros e renovação de token
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise<unknown>((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            if (typeof token === "string") {
              originalRequest.headers["Authorization"] = "Bearer " + token;
              return api(originalRequest);
            }
            return Promise.reject(new Error("Invalid token"));
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const refreshToken = authService.getRefreshToken();

      if (!refreshToken) {
        processQueue(new Error("No refresh token"));
        authService.logout();
        window.location.href = "/login";
        return Promise.reject(error);
      }

      try {
        const response = await api.post<{
          accessToken: string;
          refreshToken: string;
        }>("/user/refresh", {
          refreshToken: refreshToken,
        });

        const { accessToken: newAccessToken, refreshToken: newRefreshToken } =
          response.data;

        authService.setTokens(newAccessToken, newRefreshToken);

        processQueue(null, newAccessToken);

        originalRequest.headers["Authorization"] = "Bearer " + newAccessToken;
        return api(originalRequest);
      } catch (refreshError) {
        processQueue(
          refreshError instanceof Error ? refreshError : new Error("Refresh failed"),
          null
        );
        authService.logout();
        window.location.href = "/login";
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    if (error.response?.status === 0 && error.message.includes("CORS")) {
      console.error("Erro de CORS: Verifique a configuração do servidor");
    }

    return Promise.reject(error.response?.data || error);
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
  async getTaskDate(date: Date): Promise<Task[]> {
    const response = await api.get(`/task/date/${date}`);
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
  async checkAvailability(
    date: string,
    horariosOcupados: Task[]
  ): Promise<{ response: string }> {
    const response = await api.post("/api/llama/check-availability", {
      date,
      horariosOcupados,
    });
    return response.data;
  },
};

export default api;
