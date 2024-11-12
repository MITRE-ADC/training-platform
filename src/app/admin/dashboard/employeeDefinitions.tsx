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
  roles: Tag[];
  tasks: employeeTasks;
  assignments: employeeAssignment[];
};

// information needed for manage employees tab data table
export type employeeOverview = {
  firstName: string;
  lastName: string;
  email: string;
  roles: string[];
  tasks: employeeTasks;
};

export enum MountStatus {
  isMounted,
  isNotMounted,
  isFirstMounted,
}

export function getManageEmployees(): employeeOverview[] {
  return _DATAOVERVIEW;
}

export function getEmployeeData(email: string): employee | undefined {
  let out: employee | undefined;

  _DATA.forEach((d) => {
    if (d.email == email) {
      out = d;
      return;
    }
  });

  return out;
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
  roles: [],
  tasks: EMPTY_EMPLOYEE_TASK,
  assignments: EMPTY_EMPLOYEE_ASSIGNMENT,
};

const _DATA: employee[] = [
  {
    firstName: "John",
    lastName: "Doe",
    roles: [
      { text: "Project Manager", id: "1" },
      { text: "Cybersecurity Engineer", id: "2" },
    ],
    email: "email@email.org",
    tasks: {
      overdue: 2,
      completed: 1,
      todo: 2,
    },
    assignments: [
      {
        course: "Introduction",
        assignment: "WebWolf - Your Mailbox",
        assigned: "9/01/2024",
        due: "11/01/2024",
        status: "done",
      },
      {
        course: "Introduction",
        assignment: "WebWolf - Sub Assignment",
        assigned: "9/01/2024",
        due: "10/01/2024",
        status: "overdue",
      },
      {
        course: "Course",
        assignment: "Assignment - Sub Assignment",
        assigned: "9/01/2024",
        due: "",
        status: "todo",
      },
    ],
  },
  {
    firstName: "Jane",
    lastName: "Doe",
    roles: [{ text: "Software Engineer", id: "2" }],
    email: "helloworld@mitre.company.csec",
    tasks: {
      overdue: 1,
      completed: 5,
      todo: 0,
    },
    assignments: [],
  },
  {
    firstName: "Emilia",
    lastName: "Oneal",
    roles: [],
    email: "helloworld@mitre.company.csec",
    tasks: {
      overdue: 0,
      completed: 1,
      todo: 2,
    },
    assignments: [
      {
        course: "Introduction",
        assignment: "WebWolf - Your Mailbox",
        assigned: "9/01/2024",
        due: "11/01/2024",
        status: "done",
      },
    ],
  },
  {
    firstName: "Will",
    lastName: "Zamora",
    roles: [],
    email: "helloworld@mitre.company.csec",
    tasks: {
      overdue: 0,
      completed: 10,
      todo: 0,
    },
    assignments: [],
  },
  {
    firstName: "Ibraheem",
    lastName: "White",
    roles: [],
    email: "helloworld@mitre.company.csec",
    tasks: {
      overdue: 0,
      completed: 4,
      todo: 6,
    },
    assignments: [],
  },
];

const _DATAOVERVIEW: employeeOverview[] = [
  {
    firstName: "John",
    lastName: "Doe",
    roles: ["Project Manager", "Cybersecurity Engineer"],
    email: "email@email.org",
    tasks: {
      overdue: 2,
      completed: 1,
      todo: 2,
    },
  },
  {
    firstName: "Jane",
    lastName: "Doe",
    roles: ["Software Engineer"],
    email: "helloworld@mitre.company.csec",
    tasks: {
      overdue: 1,
      completed: 5,
      todo: 0,
    },
  },
  {
    firstName: "Emilia",
    lastName: "Oneal",
    roles: [],
    email: "helloworld@mitre.company.csec",
    tasks: {
      overdue: 0,
      completed: 1,
      todo: 2,
    },
  },
  {
    firstName: "Will",
    lastName: "Zamora",
    roles: [],
    email: "helloworld@mitre.company.csec",
    tasks: {
      overdue: 0,
      completed: 10,
      todo: 0,
    },
  },
  {
    firstName: "Ibraheem",
    lastName: "White",
    roles: [],
    email: "helloworld@mitre.company.csec",
    tasks: {
      overdue: 0,
      completed: 4,
      todo: 6,
    },
  },
];

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
];

export const _STATUSTAGS: Tag[] = [
  {
    id: "completed",
    text: "Completed",
  },
  {
    id: "overdue",
    text: "Overdue",
  },
  {
    id: "todo",
    text: "In Progress",
  },
];
