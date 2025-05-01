import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
} from "@mui/material";
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
  onSubmit: () => void;
}

export const TaskDialog = ({
  open,
  onClose,
  task,
  formData,
  setFormData,
  onSubmit,
}: TaskDialogProps) => {
  const handleInputChange = (field: keyof typeof formData) => (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFormData({
      ...formData,
      [field]: event.target.value,
    });
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{task ? "Edit Task" : "Create New Task"}</DialogTitle>
      <DialogContent>
        <Box sx={{ mt: 2 }}>
          <TextField
            autoFocus
            margin="dense"
            label="Title"
            fullWidth
            value={formData.title}
            onChange={handleInputChange("title")}
          />
          <TextField
            margin="dense"
            label="Description"
            fullWidth
            multiline
            rows={4}
            value={formData.description}
            onChange={handleInputChange("description")}
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={onSubmit} variant="contained" color="primary">
          {task ? "Update" : "Create"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
