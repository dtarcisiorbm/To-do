import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

interface PrivateRouteProps {
  children: React.ReactNode;
}

export function PrivateRoute({ children }: PrivateRouteProps) {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  // Se ainda está carregando, mostra um loading
  if (loading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center">
        <div className="text-lg">Carregando...</div>
      </div>
    );
  }

  // Se não está autenticado, redireciona para o login
  if (!isAuthenticated) {
    // Salva a localização atual para redirecionar de volta após o login
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  // Se está autenticado, renderiza o conteúdo protegido
  return <>{children}</>;
}
