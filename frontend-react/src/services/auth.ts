import axios from "axios";

const API_URL = "http://localhost:8080";

// Criar uma instância do axios com configurações padrão
const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

// Interceptor para adicionar o token em todas as requisições
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  username: string;
  password: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  expires_in: number;
  user: {
    id: string;
    name: string;
    username: string;
  };
}

export const getToken = () => localStorage.getItem("accessToken");

class AuthService {
  private async fetchUserData(): Promise<AuthResponse["user"]> {
    try {
      const response = await api.get("/user/me");
      return response.data;
    } catch (error) {
      console.error("Error fetching user data:", error);
      throw error;
    }
  }

  async getCurrentUser(): Promise<AuthResponse["user"]> {
    return this.fetchUserData();
  }

  async login(data: LoginRequest): Promise<AuthResponse> {
    const response = await api.post("/user/auth", data);
    const responseData = response.data;

    console.log("Login API Response:", responseData); // Debug log

    if (responseData.accessToken) {
      localStorage.setItem("accessToken", responseData.accessToken);
      localStorage.setItem("refreshToken", responseData.refreshToken);
      localStorage.setItem(
        "tokenExpiration",
        responseData.expires_in.toString()
      );

      // Fetch user data after successful login
      const userData = await this.fetchUserData();
      localStorage.setItem("user", JSON.stringify(userData));
      localStorage.setItem("userId", userData.id);

      return {
        ...responseData,
        user: userData,
      };
    }

    throw new Error("No access token received");
  }

  async register(data: RegisterRequest): Promise<AuthResponse> {
    const response = await api.post("/user/register", data);
    const responseData = response.data;

    console.log("Register API Response:", responseData); // Debug log

    if (responseData.accessToken) {
      localStorage.setItem("accessToken", responseData.accessToken);
      localStorage.setItem("refreshToken", responseData.refreshToken);
      localStorage.setItem(
        "tokenExpiration",
        responseData.expires_in.toString()
      );

      // Fetch user data after successful registration
      const userData = await this.fetchUserData();
      localStorage.setItem("user", JSON.stringify(userData));
      localStorage.setItem("userId", userData.id);

      return {
        ...responseData,
        user: userData,
      };
    }

    throw new Error("No access token received");
  }

  async logout() {
    try {
      await api.post("/user/logout");
    } finally {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("tokenExpiration");
      localStorage.removeItem("user");
      localStorage.removeItem("userId");
    }
  }

  getToken() {
    return localStorage.getItem("accessToken");
  }

  getUserId() {
    return localStorage.getItem("userId");
  }

  isTokenExpired() {
    const expiration = localStorage.getItem("tokenExpiration");
    if (!expiration) return true;
    return Date.now() > Number.parseInt(expiration);
  }
}

export const authService = new AuthService();
