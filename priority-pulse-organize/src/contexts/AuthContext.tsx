import React, { createContext, useContext, useState, useEffect } from "react";
import { authService, LoginCredentials, RegisterData } from "@/services/authService";
import { userService, UpdateUserData } from "@/services/userService";
import { UserDTO } from "@/services/authService";

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
  const [loading, setLoading] = useState(true); // Começa como true
  const [error, setError] = useState<string | null>(null);
  const [initialized, setInitialized] = useState(false);

  // Verificar se existe um token salvo ao iniciar
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const token = authService.getToken();
        const savedUser = localStorage.getItem("user");

        if (token && savedUser) {
          const parsedUser = JSON.parse(savedUser);
          setUser(parsedUser);
        }
      } catch (error) {
        console.error("Error initializing auth:", error);
        authService.logout();
      } finally {
        setLoading(false);
        setInitialized(true);
      }
    };

    initializeAuth();
  }, []);

  const login = async (credentials: LoginCredentials) => {
    try {
      setError(null);
      setLoading(true);
      const response = await authService.login(credentials);
      authService.setTokens(response.accessToken, response.refreshToken);
      localStorage.setItem("user", JSON.stringify(response.user));
      setUser(response.user);
      window.location.replace("/");
    } catch (err) {
      setError("Falha no login. Verifique suas credenciais.");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const register = async (data: RegisterData) => {
    try {
      setError(null);
      setLoading(true);
      const response = await authService.register(data);
      authService.setTokens(response.accessToken, response.refreshToken);
      localStorage.setItem("user", JSON.stringify(response.user));
      setUser(response.user);
      window.location.replace("/");
    } catch (err) {
      setError("Falha no registro. Tente novamente.");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    authService.logout();
    setUser(null);
    window.location.replace("/login");
  };

  const updateUser = async (data: UpdateUserData) => {
    try {
      setLoading(true);
      const updatedUser = await userService.updateUser(data);
      setUser(updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser));
    } finally {
      setLoading(false);
    }
  };

  // Só considera autenticado se já inicializou, tem usuário e token
  const isAuthenticated = initialized && !!user && !!authService.getToken();

  // Não renderiza nada até a inicialização estar completa
  if (!initialized) {
    return null;
  }

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
      {children}
    </AuthContext.Provider>
  );
}
