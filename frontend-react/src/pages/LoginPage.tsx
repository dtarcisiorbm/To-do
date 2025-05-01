import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { LoginForm } from "../components/LoginForm";
import type { LoginFormData } from "../schemas/auth";
import { Container, Paper, Typography, Alert } from "@mui/material";

export function LoginPage() {
	const navigate = useNavigate();
	const { login } = useAuth();
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const handleSubmit = async (values: LoginFormData) => {
		try {
			setIsSubmitting(true);
			setError(null);
			await login(values.username, values.password);
			navigate("/tasks");
		} catch (err) {
			console.error("Login failed:", err);
			setError("Credenciais inválidas. Tente novamente.");
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<Container component="main" maxWidth="xs">
			<Paper
				elevation={3}
				sx={{
					p: 4,
					mt: 8,
					display: "flex",
					flexDirection: "column",
					alignItems: "center",
				}}
			>
				<Typography component="h1" variant="h5" gutterBottom>
					Sign in to your account
				</Typography>
				{error && (
					<Alert severity="error" sx={{ mb: 2 }}>
						{error}
					</Alert>
				)}
				<LoginForm onSubmit={handleSubmit} isSubmitting={isSubmitting} />
			</Paper>
		</Container>
	);
}
