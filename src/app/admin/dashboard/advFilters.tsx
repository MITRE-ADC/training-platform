"use client";

import { Button } from "@/components/ui/button";
import { TagSelector } from "@/components/ui/custom/tagSelector";
import {
  MountStatus,
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
import axios from "axios";
import { req } from "@/lib/utils";
import { Assignment, Course } from "@/db/schema";

export function AdvancedDashboardFilters() {
  const [courses, setCourses] = useState<Tag[]>([]);
  const [assignments, setAssignments] = useState<Tag[]>([]);
  const [status, setStatus] = useState<Tag[]>([]);

  const [tableWidth, setTableWidth] = useState<string>("w-auto");

  const [courseTags, setCourseTags] = useState<Tag[]>([]);
  const [assignmentTags, setAssignmentTags] = useState<Tag[]>([]);

  const [didMount, setMount] = useState<MountStatus>(MountStatus.isNotMounted);

  useEffect(() => {
    const table = document.getElementById("Employee-List-Table");
    if (table) {
      setTableWidth(table.scrollWidth + "px");
    }

    setMount(MountStatus.isFirstMounted);
  }, []);

  if (didMount == MountStatus.isFirstMounted) {
    if (courseTags.length == 0) {
      axios.get(req("/api/courses")).then((r) => {
        const _courses: Course[] = r.data.data;

        setCourseTags(
          _courses.map((c) => ({
            id: "" + c.course_id,
            text: c.course_name,
          })) as Tag[]
        );
      });
    }

    if (assignmentTags.length == 0) {
      axios.get(req("/api/assignments")).then((r) => {
        const _assignments: Assignment[] = r.data.data;

        setAssignmentTags(
          _assignments.map((a) => ({
            id: "" + a.assignment_id,
            text: a.assignment_name,
          })) as Tag[]
        );
      });
    }

    setMount(MountStatus.isMounted);
  }

  return (
    <Popover onOpenChange={() => console.log("trigger")}>
      <PopoverTrigger asChild>
        <Button variant="outline" className="text-darkLight">
          <P className="text-darkLight">Advanced Filters</P>
          <i className="ri-expand-up-down-line r-sm ml-1"></i>
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="h-[150px] w-auto translate-x-[1px] translate-y-[3px] rounded-md border-highlight bg-white"
        style={{
          maxWidth: tableWidth,
        }}
        align="end"
      >
        <div className="flex h-full min-w-[200px] flex-col justify-around">
          <TagSelector
            title="Courses"
            id="courses"
            tags={courseTags}
            selectedTags={courses}
            setSelectedTags={setCourses}
            titleClass="mr-2"
          />
          <TagSelector
            title="Assignments"
            id="assignments"
            tags={assignmentTags}
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
