import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { DayPicker, SelectSingleEventHandler } from "react-day-picker";

import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
// Importar llamaService
import { useState, useEffect } from "react"; // Importar useState e useEffect
import { Task } from "@/types/task"; // Importar o tipo Task
import { format } from "date-fns";

import { iaService } from "@/services/iaService";
import { taskService } from "@/services/taskService";

export type CalendarProps = React.ComponentProps<typeof DayPicker> & {
	selected: Date | undefined;
	onSelect: SelectSingleEventHandler;
	onAvailabilityChange?: (availableTimes: string[], isLoading: boolean) => void; // Tornar opcional
	tasks?: Task[]; // Nova propriedade para a lista de tarefas
};

function Calendar({
	className,
	classNames,
	showOutsideDays = true,
	selected,
	onSelect,
	onAvailabilityChange,
	tasks = [], // Adicionar a nova propriedade com valor padrão
	...props
}: CalendarProps) {
	const [availableTimes, setAvailableTimes] = useState<[]>([]); // Estado para horários disponíveis
	const [isLoadingTimes, setIsLoadingTimes] = useState(false); // Estado para loading
	useEffect(() => {
		const checkAvailability = async () => {
			if (selected) {
				setIsLoadingTimes(true);
				try {
					const taskDates = await taskService.getTasksByDate(selected);
					const formattedDate = format(selected, "yyyy-MM-dd");
					const availabilityResponse = await iaService.checkAvailability(
						formattedDate,
						taskDates,
					);

					// Processar a resposta em formato de string para array
					const times = availabilityResponse.split(",").map((time) => time.trim());

					if (onAvailabilityChange) {
						onAvailabilityChange(times, false);
					}
				} catch (error) {
					console.error("Error checking availability:", error);
					if (onAvailabilityChange) {
						onAvailabilityChange([], false);
					}
				} finally {
					setIsLoadingTimes(false);
				}
			}
		};

		checkAvailability();
	}, [selected, onAvailabilityChange, tasks]); // Executar efeito quando a data selecionada ou a lista de tarefas mudar

	return (
		<div className="flex flex-col md:flex-row md:space-x-4 items-start">
			<DayPicker
				showOutsideDays={showOutsideDays}
				className={cn("p-3", className)}
				classNames={{
					months:
						"flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
					month: "space-y-4",
					caption: "flex justify-center pt-1 relative items-center",
					caption_label: "text-sm font-medium",
					nav: "space-x-1 flex items-center",
					nav_button: cn(
						buttonVariants({ variant: "outline" }),
						"h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100",
					),
					nav_button_previous: "absolute left-1",
					nav_button_next: "absolute right-1",
					table: "w-full border-collapse space-y-1",
					head_row: "flex",
					head_cell:
						"text-muted-foreground rounded-md w-9 font-normal text-[0.8rem]",
					row: "flex w-full mt-2",
					cell: "h-9 w-9 text-center text-sm p-0 relative [&:has([aria-selected].day-range-end)]:rounded-r-md [&:has([aria-selected].day-outside)]:bg-accent/50 [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
					day: cn(
						buttonVariants({ variant: "ghost" }),
						"h-9 w-9 p-0 font-normal aria-selected:opacity-100",
					),
					day_range_end: "day-range-end",
					day_selected:
						"bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
					day_today: "bg-accent text-accent-foreground",
					day_outside:
						"day-outside text-muted-foreground opacity-50 aria-selected:bg-accent/50 aria-selected:text-muted-foreground aria-selected:opacity-30",
					day_disabled: "text-muted-foreground opacity-50",
					day_range_middle:
						"aria-selected:bg-accent aria-selected:text-accent-foreground",
					day_hidden: "invisible",
					...classNames,
				}}
				components={{
					IconLeft: ({ ..._props }) => <ChevronLeft className="h-4 w-4" />,
					IconRight: ({ ..._props }) => <ChevronRight className="h-4 w-4" />,
				}}
				selected={selected} // Passar a data selecionada
				onSelect={onSelect} // Adicionar handler de seleção
				{...props}
			/>
			{/* Container for available times and chart */}
			<div className="flex flex-col space-y-4 w-full md:w-1/2">
				{/* Exibir horários disponíveis */}
				{selected && (
					<div className="text-center">
						<h3 className="text-lg font-semibold mb-2">
							Resumo {selected.toLocaleDateString()}:
						</h3>
						{isLoadingTimes ? (
							<p>Pensando...</p>
						) : availableTimes &&
							typeof availableTimes === "string" &&
							availableTimes.trim() !== "" ? (
							<div
								className="text-left"
								dangerouslySetInnerHTML={{ __html: availableTimes }}
							/>
						) : (
							<p>Nenhum horário disponível para esta data.</p>
						)}
					</div>
				)}
			</div>
		</div>
	);
}
Calendar.displayName = "Calendar";

export { Calendar };
