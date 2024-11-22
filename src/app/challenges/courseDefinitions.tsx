export type courseAssignment = {
  name: string;
  assigned: string;
  due: string;
  status: "overdue" | "todo" | "done";
};

export type Course = {
  course: string;
  assignments: Array<courseAssignment>;
};

export const _DATA: Course[] = [
  {
    course: "Introduction",
    assignments: [
      {
        name: "WebWolf - Your Mailbox",
        assigned: "9/01/2024",
        due: "11/01/2024",
        status: "done",
      },
      {
        name: "WebWolf - Sub Assignment",
        assigned: "9/01/2024",
        due: "10/01/2024",
        status: "overdue",
      },
    ],
  },
  {
    course: "Course",
    assignments: [
      {
        name: "Assignment - Sub Assignment",
        assigned: "9/01/2024",
        due: "",
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
