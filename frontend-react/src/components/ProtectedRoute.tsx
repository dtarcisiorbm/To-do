import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { CircularProgress } from "@mui/material";

interface ProtectedRouteProps {
	children: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
	const { user, loading, isAuthenticated } = useAuth();

	if (loading) {
		return <CircularProgress />;
	}

	if (!user || !isAuthenticated) {
		return <Navigate to="/login" replace />;
	}

	return children;
}
