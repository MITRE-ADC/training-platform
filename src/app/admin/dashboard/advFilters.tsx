"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { TagSelector } from "@/components/ui/custom/tagSelector";
import {
  _ASSIGNMENTTAGS,
  _COURSETAGS,
  _ROLETAGS,
  _STATUSTAGS,
} from "./employeeDefinitions";
import { Tag } from "@/components/ui/tag/tag-input";
import { useState } from "react";

export function AdvancedDashboardFilters() {
  const [courses, setCourses] = useState<Tag[]>([]);
  const [assignments, setAssignments] = useState<Tag[]>([]);
  const [roles, setRoles] = useState<Tag[]>([]);
  const [status, setStatus] = useState<Tag[]>([]);

  // TODO: make form

  return (
    <DropdownMenu onOpenChange={() => console.log("trigger")}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="text-base">
          Advanced Filters
          <i className="ri-arrow-down-s-fill ri-xl ml-1"></i>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="h-[200px] w-[1000px] translate-x-[1px] translate-y-[3px] rounded-none border-black bg-secondary"
        align="end"
      >
        <div className="ml-8 flex h-full flex-col justify-around">
          <TagSelector
            title="Courses"
            id="courses"
            tags={_COURSETAGS}
            selectedTags={courses}
            setSelectedTags={setCourses}
          />
          <TagSelector
            title="Assignments"
            id="assignments"
            tags={_ASSIGNMENTTAGS}
            selectedTags={assignments}
            setSelectedTags={setAssignments}
          />
          <TagSelector
            title="Roles"
            id="roles"
            tags={_ROLETAGS}
            selectedTags={roles}
            setSelectedTags={setRoles}
          />
          <TagSelector
            title="Status"
            id="status"
            tags={_STATUSTAGS}
            selectedTags={status}
            setSelectedTags={setStatus}
          />
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
