"use client";

import { format } from "date-fns";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useState } from "react";

export function DatePicker() {
  const [date, setDate] = useState<Date>();

  return (
    <Popover modal={true}>
      <PopoverTrigger asChild className="text-base">
        <Button
          variant={"outline"}
          className={cn(
            "h-8 w-full justify-start px-0 text-left font-normal",
            !date && "text-muted-foreground"
          )}
        >
          <i className="ri-calendar-line ml-2 mr-2"></i>
          {date ? format(date, "LLL dd") : <span>Pick a date</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
}
