"use client";

import { Button } from "@/components/ui/button";
import { TagSelector } from "@/components/ui/custom/tagSelector";
import {
  _ASSIGNMENTTAGS,
  _COURSETAGS,
  _ROLETAGS,
  _STATUSTAGS,
} from "./employeeDefinitions";
import { Tag } from "@/components/ui/tag/tag-input";
import { useEffect, useState } from "react";
import { P } from "@/components/ui/custom/text";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export function AdvancedDashboardFilters() {
  const [courses, setCourses] = useState<Tag[]>([]);
  const [assignments, setAssignments] = useState<Tag[]>([]);
  const [status, setStatus] = useState<Tag[]>([]);

  const [tableWidth, setTableWidth] = useState<string>("w-auto");

  useEffect(() => {
    const table = document.getElementById("Employee-List-Table");
    if (table) {
      setTableWidth(table.scrollWidth + "px");
    }
  }, []);

  return (
    <Popover onOpenChange={() => console.log("trigger")}>
      <PopoverTrigger asChild>
        <Button variant="outline" className="text-darkLight">
          <P className="text-darkLight">Advanced Filters</P>
          <i className="ri-expand-up-down-line r-sm ml-1"></i>
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="h-[175px] w-auto translate-x-[1px] translate-y-[3px] rounded-md border-highlight bg-white"
        style={{
          maxWidth: tableWidth,
        }}
        align="end"
      >
        <div className="flex h-full min-w-[200px] flex-col justify-around">
          <TagSelector
            title="Courses"
            id="courses"
            tags={_COURSETAGS}
            selectedTags={courses}
            setSelectedTags={setCourses}
            titleClass="mr-2"
          />
          <TagSelector
            title="Assignments"
            id="assignments"
            tags={_ASSIGNMENTTAGS}
            selectedTags={assignments}
            setSelectedTags={setAssignments}
            titleClass="mr-2"
          />
          <TagSelector
            title="Status"
            id="status"
            tags={_STATUSTAGS}
            selectedTags={status}
            setSelectedTags={setStatus}
            titleClass="mr-2"
          />
        </div>
      </PopoverContent>
    </Popover>
  );
}
