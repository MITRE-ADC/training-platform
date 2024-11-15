"use client";

import Image from 'next/image'
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

  return (
    <div>
      <div className="mt-[calc(26px+18px)] ml-[calc(43px+18px)]">
        <Image src="/mitre_logo.png" width="148" height="51" alt="Mitre Logo"></Image>
      </div>
      <div className="h-8"></div>
      <div className="flex h-[825px] w-screen items-center justify-center">
        <div className="flex h-full w-[95vw] justify-center">
          <div className="flex-grow">
            <div className="h-full">
              <div className="flex h-full w-full flex-col px-16 pb-14 pt-4">
                <H1>Dashboard</H1>
                <div className="flex justify-between">
                <div className="mb-5 mt-4 w-[405px] rounded-md shadow-md border-highlight2 border-[1px] flex items-center justify-start">
                      <span className="ri-search-line ri-lg ml-4 text-[#73737B]"></span>
                      <Input placeholder="Search Lessons" className="py-2 border-0 focus-visible:ring-0 font-inter"/>
                    </div>
                  <div className="flex flex-col justify-center mb-5 mt-4 rounded-md shadow-md border-highlight2 border-[1px] flex items-center justify-start">
                    <Popover open={open} onOpenChange={setOpen}>
                      <PopoverTrigger asChild>
                        <Button
                          role="combobox"
                          aria-expanded={open}
                          className="h-9 w-[200px] justify-between rounded-full py-2 bg-white hover:bg-white text-black text-base"
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
                                (framework: { value: string; label: string }) => (
                                  <CommandItem
                                    key={framework.value}
                                    value={framework.value}
                                    onSelect={(
                                      currentValue: React.SetStateAction<string>
                                    ) => {
                                      setValue(
                                        currentValue === value
                                          ? ""
                                          : currentValue
                                      );
                                      setOpen(false);
                                    }}
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
