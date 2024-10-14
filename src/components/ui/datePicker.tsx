"use client";

// see https://ui.shadcn.com/docs/components/date-picker#date-range-picker

import * as React from "react";
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
import { ControllerRenderProps } from "react-hook-form";

const dateFormat = "LLL dd";

export function DateRangeForm({ field }: { field: ControllerRenderProps }) {
  function rangeToStr(range: DateRange | undefined) {
    return (
      (range?.from ? format(range.from, "P") : "~") +
      " _ " +
      (range?.to ? format(range.to, "P") : "~")
    );
  }

  function propagateDate(date: DateRange | undefined) {
    setDate(date);
    field.onChange(rangeToStr(date));
  }

  const [date, setDate] = React.useState<DateRange | undefined>({
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
            {date?.from ? (
              date.to ? (
                <>
                  {format(date.from, dateFormat)} -{" "}
                  {format(date.to, dateFormat)}
                </>
              ) : (
                format(date.from, dateFormat)
              )
            ) : (
              <i className="text-[#777777]">Select Range ... </i>
            )}
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
