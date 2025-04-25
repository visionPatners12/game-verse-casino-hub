
import { Button } from "@/components/ui/button";
import { addDays, format } from "date-fns";
import { fr } from "date-fns/locale";

interface DateFilterProps {
  selectedDate: Date;
  onDateChange: (date: Date) => void;
}

export function DateFilter({ selectedDate, onDateChange }: DateFilterProps) {
  const nextDays = Array.from({ length: 5 }, (_, i) => addDays(new Date(), i));

  return (
    <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
      {nextDays.map((date) => (
        <Button
          key={date.toISOString()}
          variant={date.toDateString() === selectedDate.toDateString() ? "default" : "outline"}
          onClick={() => onDateChange(date)}
          className="whitespace-nowrap"
        >
          {format(date, "EEEE d MMM", { locale: fr })}
        </Button>
      ))}
    </div>
  );
}
