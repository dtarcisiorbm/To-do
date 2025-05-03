import {
  Grid,
  Card,
  CardContent,
  Typography,
  IconButton,
  Box,
  Button,
} from "@mui/material";
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  CheckCircle as CheckCircleIcon,
  HourglassEmpty as HourglassEmptyIcon,
} from "@mui/icons-material";
import type { Task } from "../types";

interface TaskGridProps {
  tasks: Task[];
  onEdit: (task: Task) => void;
  onDelete: (taskId: string) => Promise<void>;
  onStatusChange: (taskId: string, updates: Task) => Promise<void>;
}

export const TaskGrid = ({ tasks, onEdit, onDelete, onStatusChange }: TaskGridProps) => {
  console.log('Tasks:', tasks);
  return (
    <Grid container spacing={2}>
      {tasks.map((task) => (
        <Grid  item xs={12} sm={6} md={4} key={task.id}>
          <Card>
            <CardContent>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mb: 2,
                }}
              >
                <Typography variant="h6" component="div">
                  {task.title}
                </Typography>
                <Box
                  sx={{
                    display: "flex",
                    gap: 1,
                  }}
                >
                  <IconButton onClick={() => onEdit(task)} color="primary" size="small">
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => onDelete(task.id)} color="error" size="small">
                    <DeleteIcon />
                  </IconButton>
                </Box>
              </Box>

              <Typography variant="body2" color="text.secondary" paragraph>
                {task.description}
              </Typography>

              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mt: 2,
                }}
              >
                <Box>
                  <Button
                    variant="outlined"
                    color={task.status === "COMPLETED" ? "success" : "primary"}
                    startIcon={
                      task.status === "COMPLETED" ? (
                        <CheckCircleIcon />
                      ) : (
                        <HourglassEmptyIcon />
                      )
                    }
                    onClick={() =>
                      onStatusChange(task.id, {
                        ...task,
                        status: task.status === "COMPLETED" ? "PENDING" : "COMPLETED"
                      })
                    }
                  >
                    {task.status === "COMPLETED" ? "Concluído" : "Pendente"}
                  </Button>
                </Box>
                <Typography variant="body2" color="text.secondary">
                  {new Date(task.updatedAt).toLocaleDateString()}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};
