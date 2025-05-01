import { Formik, Form } from "formik";
import { toFormikValidationSchema } from "zod-formik-adapter";
import { taskSchema, type TaskFormData } from "../schemas/task";
import { taskService } from "../services/task";
import { Box, TextField, Button, Typography, MenuItem } from "@mui/material";
import { useState } from "react";

interface TaskFormProps {
	userId: string;
	initialValues?: Partial<TaskFormData>;
	isEditing?: boolean;
	taskId?: string;
	onSuccess?: () => void;
}

export const TaskForm = ({
	userId,
	initialValues,
	isEditing = false,
	taskId,
	onSuccess,
}: TaskFormProps) => {
	const [error, setError] = useState<string | null>(null);

	const handleSubmit = async (values: TaskFormData) => {
		try {
			setError(null);
			if (isEditing && taskId) {
				await taskService.updateTask(taskId, values);
			} else {
				await taskService.createTask({ ...values, userId });
			}
			onSuccess?.();
		} catch (error) {
			setError("Task operation failed. Please try again.");
			console.error("Task operation failed:", error);
		}
	};

	return (
		<Box sx={{ mt: 2 }}>
			{error && (
				<Typography color="error" sx={{ mb: 2 }}>
					{error}
				</Typography>
			)}
			<Formik
				initialValues={{
					title: initialValues?.title || "",
					description: initialValues?.description || "",
					status: initialValues?.status || "PENDING",
				}}
				validationSchema={toFormikValidationSchema(taskSchema)}
				onSubmit={handleSubmit}
			>
				{({ errors, touched, handleChange, handleBlur }) => (
					<Form>
						<Box sx={{ mt: 1 }}>
							<TextField
								margin="normal"
								required
								fullWidth
								id="title"
								label="Title"
								name="title"
								autoFocus
								onChange={handleChange}
								onBlur={handleBlur}
								error={touched.title && Boolean(errors.title)}
								helperText={touched.title && errors.title}
							/>
							<TextField
								margin="normal"
								required
								fullWidth
								id="description"
								label="Description"
								name="description"
								multiline
								rows={4}
								onChange={handleChange}
								onBlur={handleBlur}
								error={touched.description && Boolean(errors.description)}
								helperText={touched.description && errors.description}
							/>
							<TextField
								margin="normal"
								required
								fullWidth
								id="status"
								select
								label="Status"
								name="status"
								onChange={handleChange}
								onBlur={handleBlur}
								error={touched.status && Boolean(errors.status)}
								helperText={touched.status && errors.status}
							>
								<MenuItem value="PENDING">Pending</MenuItem>
								<MenuItem value="IN_PROGRESS">In Progress</MenuItem>
								<MenuItem value="COMPLETED">Completed</MenuItem>
							</TextField>
							<Button
								type="submit"
								fullWidth
								variant="contained"
								sx={{ mt: 3, mb: 2 }}
							>
								{isEditing ? "Update Task" : "Create Task"}
							</Button>
						</Box>
					</Form>
				)}
			</Formik>
		</Box>
	);
};
