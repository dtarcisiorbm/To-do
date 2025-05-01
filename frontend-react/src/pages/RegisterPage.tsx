import { Formik, Form, Field } from "formik";
import { toFormikValidationSchema } from "zod-formik-adapter";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { registerSchema } from "../schemas/auth";
import type { RegisterFormData } from "../schemas/auth";

export function RegisterPage() {
	const navigate = useNavigate();
	const { register } = useAuth();

	const handleSubmit = async (values: RegisterFormData) => {
		try {
			await register(values.name, values.username, values.password);
			navigate("/tasks");
		} catch (error) {
			console.error("Registration failed:", error);
		}
	};

	return (
		<div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
			<div className="max-w-md w-full space-y-8">
				<div>
					<h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
						Create your account
					</h2>
				</div>
				<Formik
					initialValues={{
						name: "",
						username: "",
						password: "",
					}}
					validationSchema={toFormikValidationSchema(registerSchema)}
					onSubmit={handleSubmit}
				>
					{({ errors, touched, isSubmitting }) => (
						<Form className="mt-8 space-y-6">
							<div className="rounded-md shadow-sm -space-y-px">
								<div>
									<label htmlFor="name" className="sr-only">
										Name
									</label>
									<Field
										id="name"
										name="name"
										type="text"
										required
										className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
										placeholder="Full Name"
									/>
									{errors.name && touched.name && (
										<p className="mt-1 text-sm text-red-600">{errors.name}</p>
									)}
								</div>
								<div>
									<label htmlFor="username" className="sr-only">
										Username
									</label>
									<Field
										id="username"
										name="username"
										type="text"
										required
										className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
										placeholder="Username"
									/>
									{errors.username && touched.username && (
										<p className="mt-1 text-sm text-red-600">
											{errors.username}
										</p>
									)}
								</div>
								<div>
									<label htmlFor="password" className="sr-only">
										Password
									</label>
									<Field
										id="password"
										name="password"
										type="password"
										required
										className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
										placeholder="Password"
									/>
									{errors.password && touched.password && (
										<p className="mt-1 text-sm text-red-600">
											{errors.password}
										</p>
									)}
								</div>
							</div>

							<div>
								<button
									type="submit"
									disabled={isSubmitting}
									className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
								>
									{isSubmitting ? "Creating account..." : "Create account"}
								</button>
							</div>
						</Form>
					)}
				</Formik>
			</div>
		</div>
	);
}
