"use client";

// see https://ui.shadcn.com/docs/components/date-picker#date-range-picker

import { CalendarIcon } from "@radix-ui/react-icons";
import { format } from "date-fns";
import { DateRange } from "react-day-picker";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useState } from "react";

export function DateRangeForm({
  onChange,
}: {
  onChange: (d: { from: string; to: string }) => void;
}) {
  function propagateDate(date: DateRange | undefined) {
    setDate(date);

    onChange({
      from: date?.from ? format(date.from, "P") : "",
      to: date?.to ? format(date.to, "P") : "",
    });
  }

  const [date, setDate] = useState<DateRange | undefined>({
    from: undefined,
    to: undefined,
  });

  return (
    <>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant={"outline"}
            className={cn(
              "flex-grow justify-start text-left font-normal",
              !date && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            <i>
              {date?.from ? (
                date.to ? (
                  <>
                    {format(date.from, "LLL dd")} - {format(date.to, "LLL dd")}
                  </>
                ) : (
                  format(date.from, "LLL dd")
                )
              ) : (
                <i className="text-[#777777]">Select Range ... </i>
              )}
            </i>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="range"
            defaultMonth={date?.from}
            selected={date}
            onSelect={propagateDate}
            numberOfMonths={2}
          />
        </PopoverContent>
      </Popover>
      <div className="w-4"></div>
      <Button
        variant="secondary"
        onClick={() => propagateDate({ to: undefined, from: undefined })}
        type="button"
      >
        <i className="ri-loop-left-line ri-md"></i>
      </Button>
    </>
  );
}
