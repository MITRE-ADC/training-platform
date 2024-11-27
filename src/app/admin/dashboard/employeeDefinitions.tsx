import { CourseSelectorData } from "@/components/ui/custom/courseSelectorPopup";
import { Tag } from "@/components/ui/tag/tag-input";

export type employeeTasks = {
  overdue: number;
  completed: number;
  todo: number;
};

export type employeeAssignment = {
  course: string;
  assignment: string;
  assigned: string;
  due: string;
  status: "done" | "todo" | "overdue";
};

export type employee = {
  firstName: string;
  lastName: string;
  email: string;
  tasks: employeeTasks;
  assignments: employeeAssignment[];
};

// information needed for manage employees tab data table
export type employeeOverview = {
  firstName: string;
  lastName: string;
  email: string;
  tasks: employeeTasks;
  id: string;
};

export enum MountStatus {
  isMounted,
  isNotMounted,
  isFirstMounted,
}

export const EMPTY_EMPLOYEE_TASK: employeeTasks = {
  overdue: 0,
  completed: 0,
  todo: 0,
};

export const EMPTY_EMPLOYEE_ASSIGNMENT: employeeAssignment[] = [];

export const EMPTY_EMPLOYEE: employee = {
  firstName: "",
  lastName: "",
  email: "",
  tasks: EMPTY_EMPLOYEE_TASK,
  assignments: EMPTY_EMPLOYEE_ASSIGNMENT,
};

export const _ASSIGNMENTTAGS: Tag[] = [
  {
    id: "4 1",
    text: "Course 4 Child 1",
  },
  {
    id: "4 2",
    text: "Course 4 Child 2",
  },
];

export const _COURSETAGS: Tag[] = [
  {
    id: "4",
    text: "Course 4",
  },
  {
    id: "3",
    text: "Course 3",
  },
  {
    id: "44",
    text: "Course 44",
  },
  {
    id: "33",
    text: "Course 33",
  },
  {
    id: "100",
    text: "Course 100",
  },
  {
    id: "200",
    text: "Course 200",
  },
  {
    id: "-1",
    text: "_Course 4",
  },
  {
    id: "-2",
    text: "_Course 3",
  },
  {
    id: "-3",
    text: "_Course 44",
  },
  {
    id: "-4",
    text: "_Course 33",
  },
  {
    id: "-5",
    text: "_Course 100",
  },
  {
    id: "-6",
    text: "_Course 200",
  },
];

export const _ROLETAGS: Tag[] = [
  {
    text: "Project Manager",
    id: "1",
  },
  {
    text: "Cybersecurity Engineer",
    id: "2",
  },
  {
    text: "Software Engineer",
    id: "3",
  },
  {
    text: "_Project Manager",
    id: "4",
  },
  {
    text: "_Cybersecurity Engineer",
    id: "5",
  },
  {
    text: "_Software Engineer",
    id: "6",
  },
  {
    text: "__Project Manager",
    id: "7",
  },
  {
    text: "__Cybersecurity Engineer",
    id: "8",
  },
  {
    text: "__Software Engineer",
    id: "9",
  },
  {
    text: "___Project Manager",
    id: "10",
  },
  {
    text: "___Cybersecurity Engineer",
    id: "11",
  },
  {
    text: "___Software Engineer",
    id: "12",
  },
];

export const _STATUSTAGS: Tag[] = [
  {
    id: "completed",
    text: "Completed",
  },
  {
    id: "not_started",
    text: "Not Started",
  },
  {
    id: "in_progress",
    text: "In Progress",
  },
];
