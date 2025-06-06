import React, { createContext, useContext, useState, useEffect } from "react";
import {
  authService,
  LoginCredentials,
  RegisterData,
} from "@/services/authService";
import { userService, UpdateUserData } from "@/services/userService";
import { UserDTO } from "@/services/authService";
import api from "@/services/api";

type User = UserDTO;

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
  loading: boolean;
  error: string | null;
  updateUser: (data: UpdateUserData) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth deve ser usado dentro de um AuthProvider");
  }
  return context;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true); // Começa como true para indicar o carregamento inicial
  const [error, setError] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false); // Estado para controlar a autenticação
  // Função para validar o token e buscar dados do usuário
  const validateSession = async () => {
    try {
      const token = authService.getToken();
      const refreshToken = authService.getRefreshToken();

      if (!token || !refreshToken) {
        throw new Error("No tokens found");
      }

      // Tentar buscar os dados do usuário
      const response = await api.get("/user/me");
      const userData = response.data;

      setUser(userData);
      setIsAuthenticated(true);
      localStorage.setItem("user", JSON.stringify(userData));
      return true;
    } catch (error) {
      console.error("Error validating session:", error);
      authService.logout();
      setUser(null);
      setIsAuthenticated(false);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Efeito para inicializar a autenticação
  useEffect(() => {
    validateSession();
  }, []);

  const login = async (credentials: LoginCredentials) => {
    try {
      setLoading(true);
      setError(null);

      const response = await authService.login(credentials);

      authService.setTokens(response.accessToken, response.refreshToken);
      setUser(response.user);
      setIsAuthenticated(true);
      localStorage.setItem("user", JSON.stringify(response.user));
    } catch (error) {
      setError("Falha na autenticação. Verifique suas credenciais.");
      setIsAuthenticated(false);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    authService.logout();
    setUser(null);
    setIsAuthenticated(false);
    setError(null);
    window.location.href = "/login"; // Redireciona explicitamente para a página de login
  };

  const register = async (data: RegisterData) => {
    try {
      setLoading(true);
      setError(null);

      const response = await authService.register(data);

      authService.setTokens(response.accessToken, response.refreshToken);
      setUser(response.user);
      localStorage.setItem("user", JSON.stringify(response.user));
    } catch (error) {
      setError("Falha no registro. Verifique seus dados.");
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const updateUser = async (data: UpdateUserData) => {
    try {
      setLoading(true);
      setError(null);
      const updatedUser = await userService.updateUser(data);
      setUser(updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser));
    } catch (error) {
      console.error("Error updating user:", error);
      setError("Falha ao atualizar usuário. Tente novamente.");
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        login,
        register,
        logout,
        loading,
        error,
        updateUser,
      }}
    >
      {loading ? <div>Carregando...</div> : children}
    </AuthContext.Provider>
  );
}
