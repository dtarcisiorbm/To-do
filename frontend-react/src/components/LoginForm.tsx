import { Formik, Form, Field } from "formik";
import { toFormikValidationSchema } from "zod-formik-adapter";
import { loginSchema } from "../schemas/auth";
import type { LoginFormData } from "../schemas/auth";
import { TextField, Button, Box } from "@mui/material";

interface LoginFormProps {
	onSubmit: (values: LoginFormData) => Promise<void>;
	isSubmitting?: boolean;
}

export function LoginForm({ onSubmit, isSubmitting = false }: LoginFormProps) {
	return (
		<Formik
			initialValues={{
				username: "",
				password: "",
			}}
			validationSchema={toFormikValidationSchema(loginSchema)}
			onSubmit={onSubmit}
		>
			{({ errors, touched }) => (
				<Form>
					<Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
						<Field
							as={TextField}
							id="username"
							name="username"
							label="Username"
							type="text"
							required
							fullWidth
							error={touched.username && Boolean(errors.username)}
							helperText={touched.username && errors.username}
						/>
						<Field
							as={TextField}
							id="password"
							name="password"
							label="Password"
							type="password"
							required
							fullWidth
							error={touched.password && Boolean(errors.password)}
							helperText={touched.password && errors.password}
						/>
						<Button
							type="submit"
							variant="contained"
							fullWidth
							disabled={isSubmitting}
							sx={{ mt: 2 }}
						>
							{isSubmitting ? "Signing in..." : "Sign in"}
						</Button>
					</Box>
				</Form>
			)}
		</Formik>
	);
}
