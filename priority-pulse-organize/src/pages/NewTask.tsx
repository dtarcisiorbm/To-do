/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import TaskForm from "@/components/tasks/TaskForm";
import { taskService } from "@/services/api";
import { useAuth } from "@/contexts/AuthContext";

const NewTask = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();

  const handleSubmit = async (data: any) => {
    try {
      if (!user?.id) {
        throw new Error("Usuário não autenticado");
      }
      console.log(user?.id);
      const taskData = {
        ...data,

        user: {
          id: user?.id,
        },
      };

      await taskService.createTask(taskData);

      toast({
        title: "Tarefa criada",
        description: "Sua nova tarefa foi criada com sucesso.",
      });

      navigate("/tasks");
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível criar a tarefa. Tente novamente.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="container mx-auto py-6 px-6">
      <div className="flex flex-col mb-6">
        <h1 className="text-3xl font-bold">Create New Task</h1>
        <p className="text-muted-foreground mt-1">
          Add a new task to your list
        </p>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6">
        <TaskForm onSubmit={handleSubmit} />
      </div>
    </div>
  );
};

export default NewTask;
