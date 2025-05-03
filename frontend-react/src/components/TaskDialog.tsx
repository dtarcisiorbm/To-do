import { Dialog, DialogContent, DialogActions, TextField, Button, Box, CircularProgress } from "@mui/material";
import { Formik, Form } from "formik";
import { z } from "zod";
import { Task } from "../types";

interface TaskDialogProps {
  open: boolean;
  onClose: () => void;
  task?: Task;
  formData: {
    title: string;
    description: string;
  };
  setFormData: (data: {
    title: string;
    description: string;
  }) => void;
  onSubmit: (values: {
    title: string;
    description: string;
  }) => void;
  isLoading?: boolean;
}

interface TaskFormValues {
  title: string;
  description: string;
}

const taskSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required')


});

export const TaskDialog = ({
  open,
  onClose,
  task,
  formData,
  setFormData,
  onSubmit,
  isLoading = false,
}: TaskDialogProps) => {
  const initialValues: TaskFormValues = {
    title: formData.title,
    description: formData.description
  };

  const validateForm = (values: TaskFormValues) => {
    try {
      taskSchema.parse(values);
      return {};
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldErrors: Record<string, string> = {};
        Object.entries(error.formErrors.fieldErrors).forEach(([key, value]) => {
          if (value && value.length > 0) {
            fieldErrors[key] = value[0];
          }
        });
        return fieldErrors;
      }
      return { general: 'Validation failed' };
    }
  };

  const handleSubmit = (values: TaskFormValues) => {
    setFormData(values); // Mantenha isso para atualizar o estado local
    onSubmit(values); // Passe os valores diretamente para onSubmit
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      {/* <DialogTitle>
        {task ? "Edit Task" : "Create New Task"}
      </DialogTitle> */}
      <Formik
        initialValues={initialValues}
        validate={validateForm}
        onSubmit={handleSubmit}
      >
        {({ values, errors, touched, handleChange, handleBlur, isValid, submitForm }) => (
          <Form>
            <DialogContent>
              <Box sx={{ mt: 2 }}>
                <TextField
                  autoFocus
                  margin="dense"
                  id="title"
                  name="title"
                  label="Title"
                  fullWidth
                  value={values.title}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.title && Boolean(errors.title)}
                  helperText={touched.title && errors.title}
                />
                <TextField
                  margin="dense"
                  id="description"
                  name="description"
                  label="Description"
                  fullWidth
                  multiline
                  rows={4}
                  value={values.description}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.description && Boolean(errors.description)}
                  helperText={touched.description && errors.description}
                />
              </Box>
            </DialogContent>
            <DialogActions>
              <Button onClick={onClose}>Cancel</Button>
              <Button 
                onClick={submitForm}
                variant="contained" 
                color="primary"
                disabled={isLoading || !isValid}
              >
                {isLoading ? (
                  <CircularProgress size={24} />
                ) : (
                  task ? "Update" : "Create"
                )}
              </Button>
            </DialogActions>
          </Form>
        )}
      </Formik>
    </Dialog>
  );
};
