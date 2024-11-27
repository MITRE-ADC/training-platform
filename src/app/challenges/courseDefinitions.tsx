import { req } from "@/lib/utils";
import axios from "axios";
import { MountStatus } from "../admin/dashboard/employeeDefinitions";

export type courseAssignment = {
  name: string;
  status: "overdue" | "todo" | "done";
};

export type Course = {
  course: string;
  assigned: string;
  due: string;
  assignments: Array<courseAssignment>;
};

export const _DATA: Course[] = [
  {
    course: "Introduction",
    assigned: "9/01/2024",
    due: "11/01/2020",
    assignments: [
      {
        name: "WebWolf - Your Mailbox",
        status: "done",
      },
      {
        name: "WebWolf - Sub Assignment",
        status: "overdue",
      },
    ],
  },
  {
    course: "Course",
    assigned: "9/01/2024",
    due: "11/01/2024",
    assignments: [
      {
        name: "Assignment - Sub Assignment",
        status: "todo",
      },
    ],
  },
  {
    course: "DateTest",
    assigned: "9/01/2024",
    due: "11/01/2024",
    assignments: [
      {
        name: "Due Early",
        status: "todo",
      },
    ],
  },
  {
    course: "DateTest2",
    assigned: "9/01/2024",
    due: "11/01/2024",
    assignments: [
      {
        name: "Due Late",
        status: "todo",
      },
    ],
  },
  {
    course: "Another Date Test",
    assigned: "9/01/2024",
    due: "11/01/2025",
    assignments: [
      {
        name: "Due Latest",
        status: "todo",
      },
      {
        name: "Due Earliest",
        status: "todo",
      },
    ],
  },
  {
    course: "DateTest",
    assignments: [
      {
        name: "Due Early",
        assigned: "9/01/2020",
        due: "9/01/2023",
        status: "todo",
      },
    ],
  },
  {
    course: "DateTest2",
    assignments: [
      {
        name: "Due Late",
        assigned: "9/01/2020",
        due: "9/01/2025",
        status: "todo",
      },
    ],
  },
  {
    course: "Another Date Test",
    assignments: [
      {
        name: "Due Latest",
        assigned: "9/01/2020",
        due: "9/02/2025",
        status: "todo",
      },
      {
        name: "Due Earliest",
        assigned: "9/01/2020",
        due: "9/02/2020",
        status: "todo",
      },
    ],
  },
];

export function getAssignmentData(): Course[] {
  return _DATA;
}
