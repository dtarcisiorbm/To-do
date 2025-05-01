import { Formik, Form } from "formik";
import { toFormikValidationSchema } from "zod-formik-adapter";
import { registerSchema, type RegisterFormData } from "../schemas/auth";
import { authService } from "../services/auth";
import { useNavigate } from "react-router-dom";
import {
	Box,
	TextField,
	Button,
	Typography,
	Container,
	Paper,
	Alert,
} from "@mui/material";
import { useState } from "react";

export const RegisterForm = () => {
	const navigate = useNavigate();
	const [error, setError] = useState<string | null>(null);

	const handleSubmit = async (values: RegisterFormData) => {
		try {
			setError(null);
			await authService.register({
				username: values.username,
				password: values.password,
			});
			navigate("/login");
		} catch (error) {
			setError("Registration failed. Please try again.");
			console.error("Registration failed:", error);
		}
	};

	return (
		<Container component="main" maxWidth="xs">
			<Paper elevation={3} sx={{ p: 4, mt: 8 }}>
				<Typography component="h1" variant="h5" align="center" gutterBottom>
					Register
				</Typography>
				{error && (
					<Alert severity="error" sx={{ mb: 2 }}>
						{error}
					</Alert>
				)}
				<Formik
					initialValues={{
						username: "",
						password: "",
						confirmPassword: "",
					}}
					validationSchema={toFormikValidationSchema(registerSchema)}
					onSubmit={handleSubmit}
				>
					{({ errors, touched, handleChange, handleBlur }) => (
						<Form>
							<Box sx={{ mt: 1 }}>
								<TextField
									margin="normal"
									required
									fullWidth
									id="username"
									label="Username"
									name="username"
									autoComplete="username"
									autoFocus
									onChange={handleChange}
									onBlur={handleBlur}
									error={touched.username && Boolean(errors.username)}
									helperText={touched.username && errors.username}
								/>
								<TextField
									margin="normal"
									required
									fullWidth
									name="password"
									label="Password"
									type="password"
									id="password"
									autoComplete="new-password"
									onChange={handleChange}
									onBlur={handleBlur}
									error={touched.password && Boolean(errors.password)}
									helperText={touched.password && errors.password}
								/>
								<TextField
									margin="normal"
									required
									fullWidth
									name="confirmPassword"
									label="Confirm Password"
									type="password"
									id="confirmPassword"
									autoComplete="new-password"
									onChange={handleChange}
									onBlur={handleBlur}
									error={
										touched.confirmPassword && Boolean(errors.confirmPassword)
									}
									helperText={touched.confirmPassword && errors.confirmPassword}
								/>
								<Button
									type="submit"
									fullWidth
									variant="contained"
									sx={{ mt: 3, mb: 2 }}
								>
									Register
								</Button>
							</Box>
						</Form>
					)}
				</Formik>
			</Paper>
		</Container>
	);
};
