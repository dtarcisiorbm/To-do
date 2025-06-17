import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { PlusCircle } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

import { Button } from "@/components/ui/button";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import type { Task, Priority } from "@/types/task";
import TaskList from "@/components/tasks/TaskList";

import { useAuth } from "@/contexts/AuthContext";
import { taskService } from "@/services/taskService";

const ListView = () => {
	const navigate = useNavigate();
	const { toast } = useToast();
	const { user } = useAuth();
	const [tasks, setTasks] = useState<Task[]>([]);
	const [priorityFilter, setPriorityFilter] = useState<Priority | "all">("all");
	const [categoryFilter, setCategoryFilter] = useState<string>("all");
	const [statusFilter, setStatusFilter] = useState<string>("all");
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchTasks = async () => {
			try {
				if (user?.id) {
					const tasksData = await taskService.getTasks(user.id);
					setTasks(tasksData);
				}
			} catch (error) {
				toast({
					title: "Erro",
					description: "Não foi possível carregar as tarefas.",
					variant: "destructive",
				});
			} finally {
				setLoading(false);
			}
		};

		fetchTasks();
	}, [user?.id]);

	const handleEditTask = (taskId: string) => {
		navigate(`/edit-task/${taskId}`);
	};

	const handleDeleteTask = async (taskId: string) => {
		try {
			await taskService.deleteTask(taskId);
			setTasks(tasks.filter((task) => task.id !== taskId));

			toast({
				title: "Tarefa excluída",
				description: "A tarefa foi excluída com sucesso.",
			});
		} catch (error) {
			toast({
				title: "Erro",
				description: "Não foi possível excluir a tarefa.",
				variant: "destructive",
			});
		}
	};

	const handleToggleComplete = async (task: Task, completed: boolean) => {
		console.log("Toggling complete for task:", task.id, "to:", completed);
		try {
			await taskService.updateTask(task.id, { ...task, completed });
			setTasks(tasks.map((t) => (t.id === task.id ? { ...t, completed } : t)));

			toast({
				title: completed ? "Tarefa concluída" : "Tarefa reaberta",
				description: completed
					? "A tarefa foi marcada como concluída."
					: "A tarefa foi reaberta.",
			});
		} catch (error) {
			toast({
				title: "Erro",
				description: "Não foi possível atualizar o status da tarefa.",
				variant: "destructive",
			});
		}
	};

	// Apply filters
	const filteredTasks = tasks.filter((task) => {
		const matchesPriority =
			priorityFilter === "all" || task.priority === priorityFilter;
		const matchesCategory =
			categoryFilter === "all" || task.category === categoryFilter;
		const matchesStatus = statusFilter === "all";

		return matchesPriority && matchesCategory && matchesStatus;
	});

	return (
		<div className="container mx-auto py-6 px-6">
			<div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
				<h1 className="text-3xl font-bold">Tasks</h1>

				<Button onClick={() => navigate("/new-task")}>
					<PlusCircle className="mr-2 h-4 w-4" />
					Add New Task
				</Button>
			</div>

			<div className="bg-white rounded-lg shadow-sm p-6 mb-6">
				<div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
					<div>
						<label className="block text-sm font-medium mb-1">Priority</label>
						<Select
							value={priorityFilter}
							onValueChange={(value: Priority | "all") =>
								setPriorityFilter(value)
							}
						>
							<SelectTrigger>
								<SelectValue placeholder="Filter by priority" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="all">All Priorities</SelectItem>
								<SelectItem value="low">Low</SelectItem>
								<SelectItem value="medium">Medium</SelectItem>
								<SelectItem value="high">High</SelectItem>
							</SelectContent>
						</Select>
					</div>

					<div>
						<label className="block text-sm font-medium mb-1">Category</label>
						<Select value={categoryFilter} onValueChange={setCategoryFilter}>
							<SelectTrigger>
								<SelectValue placeholder="Filter by category" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="all">All Categories</SelectItem>
								<SelectItem value="personal">Personal</SelectItem>
								<SelectItem value="work">Work</SelectItem>
								<SelectItem value="study">Study</SelectItem>
								<SelectItem value="health">Health</SelectItem>
							</SelectContent>
						</Select>
					</div>

					<div>
						<label className="block text-sm font-medium mb-1">Status</label>
						<Select value={statusFilter} onValueChange={setStatusFilter}>
							<SelectTrigger>
								<SelectValue placeholder="Filter by status" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="all">All Statuses</SelectItem>
								<SelectItem value="active">Active</SelectItem>
								<SelectItem value="completed">Completed</SelectItem>
							</SelectContent>
						</Select>
					</div>
				</div>

				<TaskList
					tasks={filteredTasks}
					onEdit={handleEditTask}
					onDelete={handleDeleteTask}
					onToggleComplete={handleToggleComplete}
				/>
			</div>
		</div>
	);
};

export default ListView;
