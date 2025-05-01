import {
	createContext,
	useContext,
	useState,
	useEffect,
	type ReactNode,
} from "react";
import { authService } from "../services/auth";

interface User {
	id: string;
	name: string;
	username: string;
}

interface AuthContextType {
	user: User | null;
	loading: boolean;
	login: (username: string, password: string) => Promise<void>;
	register: (name: string, username: string, password: string) => Promise<void>;
	logout: () => void;
	isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
	const [user, setUser] = useState<User | null>(() => {
		try {
			const storedUser = localStorage.getItem("user");
			return storedUser ? JSON.parse(storedUser) : null;
		} catch (error) {
			return null;
		}
	});
	const [loading, setLoading] = useState(true);

	const [isAuthenticated, setIsAuthenticated] = useState(() => {
		const token = localStorage.getItem("accessToken");
		return !!token && !!user;
	});

	useEffect(() => {
		const checkAuth = async () => {
			const token = localStorage.getItem("accessToken");
			if (token && !user) {
				try {
					const userData = await authService.getCurrentUser();
					setUser(userData);
					setIsAuthenticated(true);
				} catch (error) {
					console.error("Error checking authentication:", error);
					authService.logout();
					setUser(null);
					setIsAuthenticated(false);
				}
			}
		};

		checkAuth();
	}, []);

	useEffect(() => {
		setLoading(false);
	}, [user]);

	const login = async (username: string, password: string) => {
		const response = await authService.login({ username, password });
		setUser(response.user);
		setIsAuthenticated(true);
	};

	const register = async (name: string, username: string, password: string) => {
		const response = await authService.register({ name, username, password });
		setUser(response.user);
		setIsAuthenticated(true);
	};

	const logout = () => {
		authService.logout();
		setUser(null);
		setIsAuthenticated(false);
	};

	return (
		<AuthContext.Provider
			value={{
				user,
				loading,
				login,
				register,
				logout,
				isAuthenticated: !!user,
			}}
		>
			{children}
		</AuthContext.Provider>
	);
}

export function useAuth() {
	const context = useContext(AuthContext);
	if (context === undefined) {
		throw new Error("useAuth must be used within an AuthProvider");
	}
	return context;
}
