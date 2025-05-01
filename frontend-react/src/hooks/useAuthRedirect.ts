import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export function useAuthRedirect() {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    const isAuthenticated = !!token && !!user;

    if (isAuthenticated) {
      navigate("/tasks");
    }
  }, [user, navigate]);
}
