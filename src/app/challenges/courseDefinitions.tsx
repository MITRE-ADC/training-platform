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
];

export function getAssignmentData(): Course[] {
  return _DATA;
}
