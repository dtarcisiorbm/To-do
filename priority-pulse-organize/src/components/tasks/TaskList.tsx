import React from "react";
import TaskCard from "./TaskCard";
import { Task } from "@/types/task";

interface TaskListProps {
  tasks: Task[];
  onEdit: (taskId: string) => void;
  onDelete: (taskId: string) => void;
  onToggleComplete: (taskId: Task, completed: boolean) => void;
}

const TaskList = ({
  tasks,
  onEdit,
  onDelete,
  onToggleComplete,
}: TaskListProps) => {
  return (
    <div>
      {tasks.length === 0 ? (
        <div className="text-center py-10">
          <h3 className="text-lg font-medium">No tasks found</h3>
          <p className="text-muted-foreground">Add a new task to get started</p>
        </div>
      ) : (
        <div>
          {tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onEdit={onEdit}
              onDelete={onDelete}
              onToggleComplete={onToggleComplete}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default TaskList;
