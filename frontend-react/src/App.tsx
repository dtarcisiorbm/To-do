import {
	BrowserRouter as Router,
	Routes,
	Route,
	Navigate,
} from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { SidebarProvider } from "./contexts/SidebarContext";
import { LoginPage } from "./pages/LoginPage";
import { RegisterPage } from "./pages/RegisterPage";
import { TasksPage } from "./pages/TasksPage";
import { useAuth } from "./contexts/AuthContext";

function PrivateRoute({ children }: { children: React.ReactNode }) {
	const { user } = useAuth();
	const token = localStorage.getItem("accessToken");
	const isAuthenticated = !!token && !!user;

	if (!isAuthenticated) {
		return <Navigate to="/login" />;
	}

	return <>{children}</>;
}

function PublicRoute({ children }: { children: React.ReactNode }) {
	const { user } = useAuth();
	const token = localStorage.getItem("accessToken");
	const isAuthenticated = !!token && !!user;

	if (isAuthenticated) {
		return <Navigate to="/tasks" />;
	}

	return <>{children}</>;
}

function App() {
	return (
		<Router>
			<AuthProvider>
				<SidebarProvider>
					<Routes>
					<Route
						path="/login"
						element={
							<PublicRoute>
								<LoginPage />
							</PublicRoute>
						}
					/>
					<Route
						path="/register"
						element={
							<PublicRoute>
								<RegisterPage />
							</PublicRoute>
						}
					/>
					<Route
						path="/tasks"
						element={
							<PrivateRoute>
								<TasksPage />
							</PrivateRoute>
						}
					/>
					<Route path="/" element={<Navigate to="/tasks" />} />
					</Routes>
				</SidebarProvider>
			</AuthProvider>
		</Router>
	);
}

export default App;
