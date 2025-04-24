
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Button } from "@/components/ui/button";
import { Dispatch, SetStateAction } from "react";

interface DateSelectorProps {
  selectedDate: Date;
  setSelectedDate: Dispatch<SetStateAction<Date>>;
  nextFiveDays: Date[];
}

export function DateSelector({ selectedDate, setSelectedDate, nextFiveDays }: DateSelectorProps) {
  return (
    <div className="flex gap-2 overflow-x-auto py-2 px-1 no-scrollbar">
      {nextFiveDays.map((date) => (
        <Button
          key={date.toISOString()}
          variant={selectedDate.getDate() === date.getDate() ? "default" : "outline"}
          onClick={() => setSelectedDate(date)}
          className="whitespace-nowrap"
        >
          {format(date, "EEE d MMM", { locale: fr })}
        </Button>
      ))}
    </div>
  );
}
