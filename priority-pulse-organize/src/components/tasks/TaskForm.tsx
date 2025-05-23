import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { format } from "date-fns";
import { CalendarIcon, Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react"; // Import Loader2 icon
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip"; // Import Tooltip components
import { Task } from "@/types/task"; // Importar o tipo Task

// Define the form schema
const formSchema = z.object({
	title: z.string().min(1, { message: "Título é obrigatório" }),
	description: z.string().optional(),
	category: z.string({
		required_error: "Por favor, selecione uma categoria",
	}),
	priority: z.string({
		required_error: "Por favor, selecione uma prioridade",
	}),
	dueDate: z.union([z.date(), z.string()]).optional(),
});

interface TaskFormProps {
	form: ReturnType<typeof useForm<z.infer<typeof formSchema>>>;
	onSubmit: (data: z.infer<typeof formSchema>) => void;
	onGenerateDescription?: () => void;
	defaultValues?: Partial<z.infer<typeof formSchema>>;
	isEditing?: boolean;
	isGenerating?: boolean; // Add isGenerating prop
	tasks?: Task[]; // Add tasks prop
}

const TaskForm = ({
	form,
	onSubmit,
	onGenerateDescription,
	defaultValues,
	isEditing = false,
	isGenerating = false,
	tasks = [],
}: TaskFormProps) => {
	// Só popula os campos uma vez, no mount
	React.useEffect(() => {
		if (defaultValues) {
			Object.entries(defaultValues).forEach(([key, value]) => {
				if (value !== undefined) {
					form.setValue(
						key as keyof typeof defaultValues,
						key === "dueDate" && value
							? new Date(value as string | Date)
							: value,
						{ shouldDirty: false },
					);
				}
			});
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []); // Só roda no mount

	const handleSubmit = (data: z.infer<typeof formSchema>) => {
		if (data.title && (!data.description || data.description.trim() === "")) {
			alert("A descrição está vazia!");
		}
		onSubmit(data);
	};

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
				<FormField
					control={form.control}
					name="title"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Título da Tarefa</FormLabel>
							<FormControl>
								<Input placeholder="Digite o título da tarefa" {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name="description"
					render={({ field }) => {
						// Define o placeholder dinamicamente

						return (
							<FormItem>
								<FormLabel>Descrição</FormLabel>
								{/* Container for textarea and button */}
								<div className="relative">
									<FormControl>
										<Textarea
											placeholder={
												isGenerating
													? "Pensando..."
													: "Digite a descrição da tarefa (opcional)"
											}
											disabled={isGenerating}
											className="min-h-[120px] pr-24"
											{...field}
										/>
									</FormControl>
									{onGenerateDescription && (
										<TooltipProvider>
											<Tooltip>
												<TooltipTrigger asChild>
													<Button
														type="button"
														variant="outline"
														onClick={onGenerateDescription}
														className="absolute top-2 right-2"
														disabled={isGenerating}
													>
														{isGenerating ? (
															<Loader2 className="mr-2 h-4 w-4 animate-spin" />
														) : (
															<Sparkles className="h-4 w-4" />
														)}
													</Button>
												</TooltipTrigger>
												<TooltipContent>
													<p>Gerar Descrição IA</p>
												</TooltipContent>
											</Tooltip>
										</TooltipProvider>
									)}
								</div>
								<FormMessage />
							</FormItem>
						);
					}}
				/>

				<div className="grid grid-cols-1 gap-6 md:grid-cols-2">
					<FormField
						control={form.control}
						name="category"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Categoria</FormLabel>
								<Select
									onValueChange={field.onChange}
									defaultValue={field.value}
								>
									<FormControl>
										<SelectTrigger>
											<SelectValue placeholder="Selecione uma categoria" />
										</SelectTrigger>
									</FormControl>
									<SelectContent>
										<SelectItem value="personal">
											<div className="flex items-center">
												<div className="w-3 h-3 rounded-full bg-blue-400 mr-2" />
												<span>Personal</span>
											</div>
										</SelectItem>
										<SelectItem value="work">
											<div className="flex items-center">
												<div className="w-3 h-3 rounded-full bg-green-400 mr-2" />
												<span>Work</span>
											</div>
										</SelectItem>
										<SelectItem value="study">
											<div className="flex items-center">
												<div className="w-3 h-3 rounded-full bg-purple-400 mr-2" />
												<span>Study</span>
											</div>
										</SelectItem>
										<SelectItem value="health">
											<div className="flex items-center">
												<div className="w-3 h-3 rounded-full bg-yellow-400 mr-2" />
												<span>Health</span>
											</div>
										</SelectItem>
									</SelectContent>
								</Select>
								<FormMessage />
							</FormItem>
						)}
					/>

					<FormField
						control={form.control}
						name="priority"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Prioridade</FormLabel>
								<Select
									onValueChange={field.onChange}
									defaultValue={field.value}
								>
									<FormControl>
										<SelectTrigger>
											<SelectValue placeholder="Selecione a prioridade" />
										</SelectTrigger>
									</FormControl>
									<SelectContent>
										<SelectItem value="low">
											<div className="flex items-center">
												<div className="w-3 h-3 rounded-full bg-priority-low mr-2" />
												<span>LOW</span>
											</div>
										</SelectItem>
										<SelectItem value="medium">
											<div className="flex items-center">
												<div className="w-3 h-3 rounded-full bg-priority-medium mr-2" />
												<span>MEDIUM</span>
											</div>
										</SelectItem>
										<SelectItem value="high">
											<div className="flex items-center">
												<div className="w-3 h-3 rounded-full bg-priority-high mr-2" />
												<span>HIGH</span>
											</div>
										</SelectItem>
									</SelectContent>
								</Select>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name="dueDate"
						render={({ field }) => (
							<FormItem className="flex flex-col">
								<FormLabel>Data e Hora de Vencimento (Opcional)</FormLabel>
								<FormControl>
									<Input
										type="datetime-local"
										className="w-[240px]"
										value={
											field.value
												? typeof field.value === "string"
													? field.value
													: format(field.value as Date, "yyyy-MM-dd'T'HH:mm")
												: ""
										}
										onChange={(e) => {
											const value = e.target.value;
											field.onChange(value ? new Date(value) : undefined);
										}}
									/>
								</FormControl>
								<FormDescription>
									Selecione a data e hora de vencimento para sua tarefa
									(opcional)
								</FormDescription>
								<FormMessage />
							</FormItem>
						)}
					/>
				</div>

				<div className="flex justify-end space-x-4">
					<Button type="button" variant="outline" onClick={() => form.reset()}>
						Cancelar
					</Button>
					<Button type="submit">
						{isEditing ? "Atualizar Tarefa" : "Criar Tarefa"}
					</Button>
				</div>
			</form>
		</Form>
	);
};

export default TaskForm;
