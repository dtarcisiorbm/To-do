import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Task } from "@/types/task";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/contexts/AuthContext";

import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";

// Import the calendar styles
import "react-calendar/dist/Calendar.css";
import { Calendar } from "@/components/ui/calendar";
import { taskService } from "@/services/taskService";


const CalendarView = () => {
	const navigate = useNavigate();
	const { toast } = useToast();
	const { user } = useAuth();
	const [tasks, setTasks] = useState<Task[]>([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchTasks = async () => {
			try {
				if (user?.id) {
					const tasksData = await taskService.getTasks(user.id);
					// Garantir que as datas das tarefas sejam convertidas corretamente
					const tasksWithFormattedDates = tasksData.map((task) => ({
						...task,
						dueDate: task.dueDate ? new Date(task.dueDate).toISOString() : null,
					}));
					setTasks(tasksWithFormattedDates);
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
	}, [user?.id, toast]);
	const [selectedDate, setSelectedDate] = useState<Date | undefined>(
		new Date(),
	);
	const [dailyTasks, setDailyTasks] = useState<Task[]>([]);
	const [isTasksDialogOpen, setIsTasksDialogOpen] = useState(false);

	const handleDateSelect = (date: Date | undefined) => {
		if (!date) return;

		// Garantir que a data selecionada seja uma instância de Date
		const selectedDateObj = new Date(date);
		setSelectedDate(selectedDateObj);

		// Filter tasks for the selected date
		const tasksForDay = tasks.filter((task) => {
			if (!task.dueDate) return false;

			const taskDate = new Date(task.dueDate);
			return (
				taskDate.getDate() === selectedDateObj.getDate() &&
				taskDate.getMonth() === selectedDateObj.getMonth() &&
				taskDate.getFullYear() === selectedDateObj.getFullYear()
			);
		});

		setDailyTasks(tasksForDay);
		setIsTasksDialogOpen(true);
	};

	// Helper to determine if a date has tasks
	const tileContent = ({ date, view }: { date: Date; view: string }) => {
		if (view !== "month") return null;

		const hasTask = tasks.some((task) => {
			if (!task.dueDate) return false;

			const taskDate = new Date(task.dueDate);
			return (
				taskDate.getDate() === date.getDate() &&
				taskDate.getMonth() === date.getMonth() &&
				taskDate.getFullYear() === date.getFullYear()
			);
		});

		return hasTask ? (
			<div className="h-1.5 w-1.5 bg-primary rounded-full mx-auto mt-1"></div>
		) : null;
	};

	const handleViewTask = (taskId: string) => {
		navigate(`/edit-task/${taskId}`);
		setIsTasksDialogOpen(false);
	};

	return (
		<div className="container mx-auto py-6 px-6">
			<div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
				<h1 className="text-3xl font-bold">Calendar</h1>

				<Button onClick={() => navigate("/new-task")}>
					<PlusCircle className="mr-2 h-4 w-4" />
					Add New Task
				</Button>
			</div>

			<div className="bg-white rounded-lg shadow-sm p-6">
				{loading ? (
					<div className="flex justify-center items-center h-64">
						<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
					</div>
				) : (
					<div className="calendar-container">
						<Calendar
							mode="single"
							selected={selectedDate}
							onSelect={handleDateSelect}
							className="w-full"
							tasks={tasks} // Passar a lista de tarefas para o componente Calendar
							components={{
								// @ts-ignore - We're adding a custom renderer for the days
								DayContent: (props) => (
									<div>
										<div>{props.date.getDate()}</div>
										{tileContent({ date: props.date, view: "month" })}
									</div>
								),
							}}
						/>
					</div>
				)}
			</div>

			{/* <Dialog open={isTasksDialogOpen} onOpenChange={setIsTasksDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {selectedDate &&
                new Intl.DateTimeFormat("en-US", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                }).format(selectedDate)}
            </DialogTitle>
            <DialogDescription>Tasks due on this day</DialogDescription>
          </DialogHeader>

          <div className="mt-4">
            {dailyTasks.length === 0 ? (
              <p className="text-center text-muted-foreground py-4">
                No tasks scheduled for this day
              </p>
            ) : (
              <ul className="space-y-2">
                {dailyTasks.map((task) => (
                  <li
                    key={task.id}
                    className="p-3 border rounded-md cursor-pointer hover:bg-accent"
                    onClick={() => handleViewTask(task.id)}
                  >
                    <div className="flex items-center">
                      <div
                        className={`w-2 h-2 rounded-full mr-2 ${
                          task.priority === "high"
                            ? "bg-priority-high"
                            : task.priority === "medium"
                            ? "bg-priority-medium"
                            : "bg-priority-low"
                        }`}
                      ></div>
                      <div className="flex-1">
                        <p
                          className={`font-medium ${
                            task.completed
                              ? "line-through text-muted-foreground"
                              : ""
                          }`}
                        >
                          {task.title}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {task.description.substring(0, 50)}
                          {task.description.length > 50 ? "..." : ""}
                        </p>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </DialogContent>
      </Dialog> */}
		</div>
	);
};

export default CalendarView;
