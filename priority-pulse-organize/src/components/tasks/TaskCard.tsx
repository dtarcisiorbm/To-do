import React from "react";
import { format } from "date-fns";
import { Pencil, Trash2, Calendar as CalendarIcon } from "lucide-react";

import { Task } from "@/types/task";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";

interface TaskCardProps {
  task: Task;
  onEdit: (taskId: string) => void;
  onDelete: (taskId: string) => void;
  onToggleComplete: (task: Task, completed: boolean) => void;
}

const TaskCard = ({
  task,
  onEdit,
  onDelete,
  onToggleComplete,
}: TaskCardProps) => {
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "low":
        return "bg-priority-low text-white";
      case "medium":
        return "bg-priority-medium text-white";
      case "high":
        return "bg-priority-high text-white";
      default:
        return "bg-gray-400 text-white";
    }
  };

  const getCategoryColor = (categoryId: string) => {
    switch (categoryId) {
      case "personal":
        return "bg-blue-400";
      case "work":
        return "bg-green-400";
      case "study":
        return "bg-purple-400";
      case "health":
        return "bg-yellow-400";
      default:
        return "bg-gray-400";
    }
  };

  const getCategoryName = (categoryId: string) => {
    switch (categoryId) {
      case "personal":
        return "Personal";
      case "work":
        return "Work";
      case "study":
        return "Study";
      case "health":
        return "Health";
      default:
        return "Unknown";
    }
  };

  return (
    <Card className={`mb-4 ${task.completed ? "opacity-70" : ""}`}>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Checkbox
              checked={task.completed}
              onCheckedChange={(checked) =>
                onToggleComplete(task, Boolean(checked))
              }
            />
            <CardTitle
              className={
                task.completed ? "line-through text-muted-foreground" : ""
              }
            >
              {task.title}
            </CardTitle>
          </div>
          <div className="flex items-center space-x-1">
            <div
              className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(
                task.priority
              )}`}
            >
              {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
            </div>
          </div>
        </div>
        <div className="flex items-center mt-1">
          <div className="flex items-center space-x-1">
            <div
              className={`w-3 h-3 rounded-full ${getCategoryColor(
                task.category
              )}`}
            ></div>
            <CardDescription>{getCategoryName(task.category)}</CardDescription>
          </div>
        </div>
      </CardHeader>

      {task.description && (
        <CardContent className="pb-2">
          <p className="text-sm">{task.description}</p>
        </CardContent>
      )}

      <CardFooter className="pt-0 flex items-center justify-between">
        <div>
          {task.dueDate && (
            <div className="flex items-center text-xs text-muted-foreground">
              <CalendarIcon className="h-3 w-3 mr-1" />
              <span>Due {format(task.dueDate, "dd/mm/yyyy HH:mm")}</span>
            </div>
          )}
        </div>

        <div className="flex space-x-2">
          <Button size="sm" variant="ghost" onClick={() => onEdit(task.id)}>
            <Pencil className="h-4 w-4" />
          </Button>
          <Button size="sm" variant="ghost" onClick={() => onDelete(task.id)}>
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default TaskCard;
