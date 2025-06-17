import axios, { InternalAxiosRequestConfig, AxiosError } from "axios";
import { authService } from "./authService";

const API_URL = import.meta.env.DEV ? "/api" : "http://localhost:8080";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

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

// Interceptador para tratamento de erros
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    if (error.response?.status === 401) {
      authService.logout();
      window.location.replace("/login");
    }
    return Promise.reject(error);
  }
);

export default api;
