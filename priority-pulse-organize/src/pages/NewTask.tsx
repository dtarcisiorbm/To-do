/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/components/ui/use-toast";
import { taskService, llamaService } from "@/services/api";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import TaskForm from "@/components/tasks/TaskForm";
import { useState } from "react";

export const formSchema = z.object({
  title: z.string().min(1, { message: "Título é obrigatório" }),
  description: z.string().optional(),
  category: z.string({
    required_error: "Por favor, selecione uma categoria",
  }),
  priority: z.string({
    required_error: "Por favor, selecione uma prioridade",
  }),
  dueDate: z.date().optional(),
});

const NewTask = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const [isGenerating, setIsGenerating] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      category: "",
      priority: "medium",
      dueDate: new Date(),
    },
  });

  const handleSubmit = async (data: z.infer<typeof formSchema>) => {
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

  const handleGenerateDescription = async () => {
    const title = form.getValues("title");
    if (!title) {
      toast({
        title: "Atenção",
        description: "Por favor, insira um título para gerar a descrição.",
        variant: "warning",
      });
      return;
    }
    setIsGenerating(true);
    try {
      const result = await llamaService.generateDescription(title);
      if (result?.response) {
        form.setValue("description", result.response);
      } else {
        toast({
          title: "Erro",
          description: "Não foi possível gerar a descrição. Tente novamente.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Erro",
        description:
          "Não foi possível gerar a descrição. Verifique a conexão com o serviço Llama.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
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
        <TaskForm
          form={form}
          onSubmit={handleSubmit}
          onGenerateDescription={handleGenerateDescription}
          isGenerating={isGenerating}
        />
      </div>
    </div>
  );
};

export default NewTask;
