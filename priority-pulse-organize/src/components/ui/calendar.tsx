import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { DayPicker, SelectSingleEventHandler } from "react-day-picker";

import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { llamaService } from "@/services/api"; // Importar llamaService
import { useState, useEffect } from "react"; // Importar useState e useEffect
import { Task } from "@/types/task"; // Importar o tipo Task
import { format } from "date-fns";

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
    const fetchAvailability = async () => {
      if (selected) {
        setIsLoadingTimes(true);
        if (onAvailabilityChange) {
          onAvailabilityChange([], true);
        } // Notify parent about loading state safely

        // Processar a lista de tarefas para obter horários ocupados na data selecionada
        const occupiedTimesForSelectedDate = tasks
          .filter(
            (task) =>
              task.dueDate &&
              new Date(task.dueDate).toDateString() === selected.toDateString()
          )
          .map((task) => format(new Date(task.dueDate!), "HH:mm"));
        console.log(selected);
        try {
          // Chamar a API com a data selecionada e horários ocupados
          const result = await llamaService.checkAvailability(
            new Date(selected).toDateString(),
            occupiedTimesForSelectedDate // Usar a lista de horários ocupados processada
          );

          if (result) {
            console.log("Horários disponíveis:", result);
            setAvailableTimes(result);
            if (onAvailabilityChange) {
              onAvailabilityChange(result, false);
            } // Notify parent with data safely
          } else {
            setAvailableTimes([]); // Limpar se não houver horários ou erro
            if (onAvailabilityChange) {
              onAvailabilityChange([], false);
            } // Notify parent with empty data safely
          }
        } catch (error) {
          console.log("Erro ao buscar horários disponíveis:", error);
          console.error("Erro ao buscar horários disponíveis:", error);
          setAvailableTimes([]);
          if (onAvailabilityChange) {
            onAvailabilityChange([], false);
          } // Notify parent about error safely
        } finally {
          setIsLoadingTimes(false);
        }
      } else {
        setAvailableTimes([]);
        if (onAvailabilityChange) {
          onAvailabilityChange([], false);
        } // Notify parent when no date is selected safely
      }
    };

    fetchAvailability();
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
            "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100"
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
            "h-9 w-9 p-0 font-normal aria-selected:opacity-100"
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
              Horários Ocupados {selected.toLocaleDateString()}:
            </h3>
            {isLoadingTimes ? (
              <p>Carregando horários...</p>
            ) : availableTimes.length > 0 ? (
              <ul className="list-disc list-inside">
                {availableTimes.map((time, index) => (
                  <li>{time}</li>
                ))}
              </ul>
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
