import { CourseSelectorData } from "@/components/ui/custom/courseSelectorPopup";

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
  roles: string[];
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

export function getManageEmployees(): employeeOverview[] {
  return _DATAOVERVIEW;
}

export function getCourseData(): CourseSelectorData[] {
  return _COURSEDATA;
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

const _DATA: employee[] = [
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
    roles: ["Software Engineer"],
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

const _COURSEDATA: CourseSelectorData[] = [
  {
    name: "Course 1",
    id: "1",
    children: [
      { name: "Course 1 Child 1", id: "1 1" },
      { name: "Course 1 Child 2", id: "1 2" },
      { name: "Course 1 Child 3", id: "1 3" },
    ],
  },
  {
    name: "Course 2",
    id: "2",
    children: [{ name: "Course 2 Child 1", id: "2 1" }],
  },
  {
    name: "Course 3",
    id: "3",
    children: [
      { name: "Course 3 Child 1", id: "3 1" },
      { name: "Course 3 Child 2", id: "3 2" },
      { name: "Course 3 Child 3", id: "3 3" },
      { name: "Course 3 Child 4", id: "3 4" },
      { name: "Course 3 Child 5", id: "3 5" },
      { name: "Course 3 Child 6", id: "3 6" },
    ],
  },
  {
    name: "Course 4",
    id: "4",
    children: [
      { name: "Course 4 Child 1", id: "4 1" },
      { name: "Course 4 Child 2", id: "4 2" },
      { name: "Course 4 Child 3", id: "4 3" },
      { name: "Course 4 Child 4", id: "4 4" },
      { name: "Course 4 Child 5", id: "4 5" },
      { name: "Course 4 Child 6", id: "4 6" },
      { name: "Course 4 Child 7", id: "4 7" },
      { name: "Course 4 Child 8", id: "4 8" },
      { name: "Course 4 Child 9", id: "4 9" },
      { name: "Course 4 Child 10", id: "4 10" },
      { name: "Course 4 Child 11", id: "4 11" },
      { name: "Course 4 Child 12", id: "4 12" },
    ],
  },
];
