import {
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  TextField,
  CircularProgress,
  Alert,
  AppBar,
  Toolbar,
  Box,
  Container,
  Typography,
  IconButton,
  DialogActions,
  Tooltip,
} from "@mui/material";
import MenuIcon from '@mui/icons-material/Menu';
import AddIcon from '@mui/icons-material/Add';

import { Sidebar } from "../components/Sidebar";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import type{ Task, CreateTaskRequest } from "../types";
import { taskService } from "../services/tasks";
import { useEffect, useState, useCallback } from "react";
import { useSidebar } from "../contexts/SidebarContext";

import { TaskGrid } from "../components/TaskGrid";

interface TaskDialogProps {
  open: boolean;
  onClose: () => void;
  task: Task | null;
  formData: CreateTaskRequest;
  setFormData: React.Dispatch<React.SetStateAction<CreateTaskRequest>>;
  onSubmit: () => void;
}

const TaskDialog: React.FC<TaskDialogProps> = ({ open, onClose, task, formData, setFormData, onSubmit }) => {
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>{task ? "Edit Task" : "Create New Task"}</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          label="Title"
          fullWidth
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
        />
        <TextField
          margin="dense"
          label="Description"
          fullWidth
          multiline
          rows={4}
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
        />
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

export const TasksPage = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [formData, setFormData] = useState<CreateTaskRequest>({
    title: "",
    description: "",
  });
  
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toggleSidebar } = useSidebar();

  const loadTasks = useCallback(async () => {
    if (!user?.id) return;
    
    try {
      setLoading(true);
      setError(null);
      const response = await taskService.getTasksForUser(user.id);
      setTasks(response);
    } catch (err) {
      setError(`Failed to load tasks: ${(err as Error).message}`);
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    loadTasks();
  }, [loadTasks]);

  const handleDialogOpen = (task?: Task) => {
    setEditingTask(task);
    setFormData(task ? {
      title: task.title,
      description: task.description,
    } : {
      title: "",
      description: "",
    });
    setOpenDialog(true);
  };

  const handleDialogClose = () => {
    setOpenDialog(false);
    setEditingTask(null);
    setFormData({ title: "", description: "" });
  };

  const handleTaskCreate = async (data: CreateTaskRequest) => {
    try {
      await taskService.createTask({
        title: data.title,
        description: data.description,
      });
      await loadTasks();
      handleDialogClose();
    } catch (err) {
      setError(`Failed to create task: ${(err as Error).message}`);
    }
  };

  const handleTaskUpdate = async (taskId: string, updates: Partial<Task>) => {
    try {
      await taskService.updateTask(taskId, updates);
      await loadTasks();
    } catch (err) {
      setError(`Failed to update task: ${(err as Error).message}`);
    }
  };

  const handleTaskDelete = async (taskId: string) => {
    try {
      await taskService.deleteTask(taskId);
      setTasks(tasks.filter(task => task.id !== taskId));
    } catch (error) {
      console.error('Error deleting task:', error);
      setError('Failed to delete task');
    }
  };

  const handleStatusChange = async (taskId: string, updates: Partial<Task>) => {
    try {
      const updatedTask = await taskService.updateTask(taskId, updates);
      setTasks(tasks.map(task => task.id === taskId ? updatedTask : task));
    } catch (error) {
      console.error('Error updating task status:', error);
      setError('Failed to update task status');
    }
  };

  if (!user) {
    navigate("/login");
    return null;
  }

  return (
    <Box sx={{ display: "flex", minHeight: "100vh" }}>
      <Sidebar />
      <Box sx={{ flexGrow: 1, p: 3, mt: 8 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
          {loading ? (
            <CircularProgress />
          ) : error ? (
            <Alert severity="error">{error}</Alert>
          ) : (
            <TaskGrid tasks={tasks} onEdit={handleDialogOpen} onDelete={handleTaskDelete} onStatusChange={handleStatusChange} />
          )}
        </Box>
      </Box>
      <AppBar position="fixed">
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={toggleSidebar}
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Tasks
          </Typography>
          <Tooltip title="Add Task">
            <IconButton color="inherit" onClick={() => handleDialogOpen()}>
              <AddIcon />
            </IconButton>
          </Tooltip>
        </Toolbar>
      </AppBar>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          mt: 8,
        }}
      >
        {loading ? (
          <CircularProgress />
        ) : error ? (
          <Alert severity="error">{error}</Alert>
        ) : (
          <Container maxWidth="lg">
            <TaskGrid
              tasks={tasks}
              onEdit={handleDialogOpen}
              onDelete={handleTaskDelete}
              onStatusChange={handleStatusChange}
            />
          </Container>
        )}
      </Box>
      <TaskDialog
        open={openDialog}
        onClose={handleDialogClose}
        task={editingTask}
        formData={formData}
        setFormData={setFormData}
        onSubmit={() => editingTask ? handleTaskUpdate(editingTask.id, formData) : handleTaskCreate(formData)}
      />
    </Box>
  );
}
