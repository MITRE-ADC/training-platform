"use client";

import Image from "next/image";
import { CourseList } from "./courseList";
import { Input } from "@/components/ui/input";
import { H1 } from "@/components/ui/custom/text";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ChevronsUpDown, Check } from "lucide-react";
import React from "react";

const frameworks = [
  { value: "Default", label: "Default" },
  { value: "A-Z (Courses)", label: "A-Z (Courses)" },
  { value: "Z-A (Courses)", label: "Z-A (Courses)" },
  { value: "Due First", label: "Due First" },
  { value: "Due Last", label: "Due Last" },
];

export default function ChallengeHomepage() {
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState("");
  const [searchQuery, setSearchQuery] = React.useState("");

  const [originalOrder, setOriginalOrder] =
    React.useState<Map<Element, number>>();

  React.useEffect(() => {
    const container = document.getElementById("card-container");
    if (container) {
      const cards = Array.from(container.children);
      setOriginalOrder(new Map(cards.map((card, index) => [card, index])));
    }
  }, []);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const searchValue = event.target.value.toLowerCase();
    setSearchQuery(searchValue);
    const container = document.getElementById("card-container");
    if (container) {
      for (const child of container.children) {
        const element = child as HTMLElement;
        if (element.id.toLowerCase().includes(searchValue)) {
          element.style.display = "block";
        } else {
          element.style.display = "none";
        }
      }
    }
  };

  const handleSort = (currentValue: string) => {
    setValue(currentValue === value ? "Default" : currentValue);
    setOpen(false);

    const container = document.getElementById("card-container");
    if (!container) return;

    const cards = Array.from(container.children);

    const sortedCards = cards.sort((a, b) => {
      const aTitle =
        (a as HTMLElement).querySelector(".text-2xl")?.textContent || "";
      const bTitle =
        (b as HTMLElement).querySelector(".text-2xl")?.textContent || "";

      switch (currentValue) {
        case "A-Z (Courses)":
          return aTitle.localeCompare(bTitle);
        case "Z-A (Courses)":
          return bTitle.localeCompare(aTitle);
        case "Due First": {
          const aDueDates = Array.from(
            (a as HTMLElement).querySelectorAll(".ri-calendar-schedule-line")
          )
            .map(
              (el) => el.nextSibling?.textContent?.replace("Due: ", "") || ""
            )
            .filter((date) => date && date !== "No due date");
          const bDueDates = Array.from(
            (b as HTMLElement).querySelectorAll(".ri-calendar-schedule-line")
          )
            .map(
              (el) => el.nextSibling?.textContent?.replace("Due: ", "") || ""
            )
            .filter((date) => date && date !== "No due date");
          if (aDueDates.length === 0 && bDueDates.length === 0) return 0;
          if (aDueDates.length === 0) return 1;
          if (bDueDates.length === 0) return -1;
          const aEarliestDate = new Date(
            Math.min(...aDueDates.map((date) => new Date(date).getTime()))
          );
          const bEarliestDate = new Date(
            Math.min(...bDueDates.map((date) => new Date(date).getTime()))
          );

          return aEarliestDate.getTime() - bEarliestDate.getTime();
        }
        case "Due Last": {
          const aDueDates = Array.from(
            (a as HTMLElement).querySelectorAll(".ri-calendar-schedule-line")
          )
            .map(
              (el) => el.nextSibling?.textContent?.replace("Due: ", "") || ""
            )
            .filter((date) => date && date !== "No due date");
          const bDueDates = Array.from(
            (b as HTMLElement).querySelectorAll(".ri-calendar-schedule-line")
          )
            .map(
              (el) => el.nextSibling?.textContent?.replace("Due: ", "") || ""
            )
            .filter((date) => date && date !== "No due date");
          if (aDueDates.length === 0 && bDueDates.length === 0) return 0;
          if (aDueDates.length === 0) return -1;
          if (bDueDates.length === 0) return 1;
          const aLatestDate = new Date(
            Math.max(...aDueDates.map((date) => new Date(date).getTime()))
          );
          const bLatestDate = new Date(
            Math.max(...bDueDates.map((date) => new Date(date).getTime()))
          );

          return bLatestDate.getTime() - aLatestDate.getTime();
        }
        case "Default":
          return originalOrder.get(a)! - originalOrder.get(b)!;
        default:
          return originalOrder.get(a)! - originalOrder.get(b)!;
      }
    });
    container.innerHTML = "";
    sortedCards.forEach((card) => container.appendChild(card));
  };

  return (
    <div>
      <div className="ml-[calc(43px+18px)] mt-[calc(26px+18px)]">
        <Image
          src="/mitre_logo.png"
          width="148"
          height="51"
          alt="Mitre Logo"
        ></Image>
      </div>
      <div className="h-8"></div>
      <div className="flex h-[825px] w-screen items-center justify-center">
        <div className="flex h-full w-[95vw] justify-center">
          <div className="flex-grow">
            <div className="h-full">
              <div className="flex h-full w-full flex-col px-16 pb-14 pt-4">
                <H1>Dashboard</H1>
                <div className="flex justify-between">
                  <div className="mb-5 mt-4 flex w-[405px] items-center justify-start rounded-md border-[1px] border-highlight2 shadow-md">
                    <span className="ri-search-line ri-lg ml-4 text-[#73737B]"></span>
                    <Input
                      placeholder="Search Lessons"
                      className="border-0 py-2 font-inter focus-visible:ring-0"
                      onChange={handleSearch}
                      value={searchQuery}
                    />
                  </div>
                  <div className="mb-5 mt-4 flex flex-col items-center justify-start justify-center rounded-md border-[1px] border-highlight2 shadow-md">
                    <Popover open={open} onOpenChange={setOpen}>
                      <PopoverTrigger asChild>
                        <Button
                          role="combobox"
                          aria-expanded={open}
                          className="h-9 w-[200px] justify-between rounded-full bg-white py-2 text-base text-black hover:bg-white"
                        >
                          {value
                            ? frameworks.find(
                                (framework: { value: string }) =>
                                  framework.value === value
                              )?.label
                            : "Sort By:"}
                          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-[200px] rounded-full p-0 shadow-md">
                        <Command>
                          <CommandInput placeholder="Sort By..." />
                          <CommandList>
                            <CommandEmpty>No framework found.</CommandEmpty>
                            <CommandGroup>
                              {frameworks.map(
                                (framework: {
                                  value: string;
                                  label: string;
                                }) => (
                                  <CommandItem
                                    key={framework.value}
                                    value={framework.value}
                                    onSelect={handleSort}
                                  >
                                    <Check
                                      className={cn(
                                        "mr-2 h-4 w-4",
                                        value === framework.value
                                          ? "opacity-100"
                                          : "opacity-0"
                                      )}
                                    />
                                    {framework.label}
                                  </CommandItem>
                                )
                              )}
                            </CommandGroup>
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>
                <div className="h-full">
                  <CourseList />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
