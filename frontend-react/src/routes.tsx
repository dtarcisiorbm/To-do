import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
// Removed SidebarProvider import since it's now wrapped at root level
import { ProtectedRoute } from "./components/ProtectedRoute";
import { TasksPage } from "./pages/TasksPage";
import { LoginPage } from "./pages/LoginPage";
import { RegisterPage } from "./pages/RegisterPage";
import App from "./App";

export function AppRoutes() {
  return (
	<BrowserRouter>
	  <Routes>
		<Route path="/login" element={<LoginPage />} />
		<Route path="/register" element={<RegisterPage />} />
		<Route
		  path="/tasks"
		  element={
			<ProtectedRoute>
			  <TasksPage />
			</ProtectedRoute>
		  }
		/>
		<Route
		  path="/"
		  element={
			<ProtectedRoute>
			  <App />
			</ProtectedRoute>
		  }
		/>
		<Route path="*" element={<Navigate to="/" replace />} />
	  </Routes>
	</BrowserRouter>
  );
}