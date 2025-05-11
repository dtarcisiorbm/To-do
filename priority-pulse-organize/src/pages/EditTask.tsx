import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import TaskForm from "@/components/tasks/TaskForm";
import { Task } from "@/types/task";
import { taskService } from "@/services/api";

const EditTask = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();
  const [task, setTask] = useState<Task | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTask = async () => {
      try {
        if (!id) return;
        const taskData = await taskService.getTaskId(id);
        console.log(taskData);
        setTask(taskData[0]);
      } catch (err) {
        setError(
          "Não foi possível carregar a tarefa. Por favor, tente novamente."
        );
        toast({
          title: "Erro",
          description: "Não foi possível carregar a tarefa.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchTask();
  }, [id, toast]);

  const handleSubmit = async (data: Task) => {
    try {
      if (!id) return;

      await taskService.updateTask(id, data);

      toast({
        title: "Tarefa atualizada",
        description: "Sua tarefa foi atualizada com sucesso.",
      });

      navigate("/tasks");
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível atualizar a tarefa. Tente novamente.",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto py-6 px-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h1 className="text-2xl font-bold mb-4">Carregando...</h1>
          <p className="mb-4">
            Por favor, aguarde enquanto carregamos os dados da tarefa.
          </p>
        </div>
      </div>
    );
  }

  if (error || !task) {
    return (
      <div className="container mx-auto py-6 px-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h1 className="text-2xl font-bold mb-4">Tarefa não encontrada</h1>
          <p className="mb-4">
            {error ||
              "A tarefa que você está procurando não existe ou foi excluída."}
          </p>
          <button
            className="text-primary hover:underline"
            onClick={() => navigate("/tasks")}
          >
            Voltar para Tarefas
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 px-6">
      <div className="flex flex-col mb-6">
        <h1 className="text-3xl font-bold">Edit Task</h1>
        <p className="text-muted-foreground mt-1">Update your task details</p>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6">
        <TaskForm
          onSubmit={handleSubmit}
          defaultValues={{
            title: task.title,
            description: task.description,
            category: task.category,
            priority: task.priority,
            dueDate: task.dueDate,
          }}
          isEditing
        />
      </div>
    </div>
  );
};

export default EditTask;
