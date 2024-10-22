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

export const _DATA: employee[] = [
  {
    firstName: "John",
    lastName: "Doe",
    roles: ["Project Manager", "Cybersecurity Engineer"],
    email: "leowang@terpmail.umd.edu",
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
