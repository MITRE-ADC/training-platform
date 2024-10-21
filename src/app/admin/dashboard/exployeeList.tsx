"use client";

import { DataTable } from "@/components/ui/dataTable";
import { ColumnDef } from "@tanstack/react-table";
import EmployeePopup from "./employeePopup";

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

const columns: ColumnDef<employee>[] = [
  {
    id: "buffer",
    cell: () => <div className="w-4"></div>,
  },
  {
    accessorKey: "firstName",
    /*header: ({ column }) => <SortableColumn column={column} title="First Name"/>*/
    header: "First Name",
  },
  {
    accessorKey: "lastName",
    header: "Last Name",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "roles",
    header: "Roles",
    cell: ({ row }) => roleToSpan(row.getValue("roles")),
  },
  {
    accessorKey: "tasks",
    header: "Status",
    cell: ({ row }) => {
      return (
        <div className="flex">
          <div className="mr-1 min-w-9">
            <i className="ri-checkbox-circle-fill mr-1 text-green-600"></i>
            <span>{(row.getValue("tasks") as employeeTasks)["completed"]}</span>
          </div>
          <div className="mr-1 min-w-9">
            <i className="ri-error-warning-fill mr-1 text-rose-500"></i>
            <span>{(row.getValue("tasks") as employeeTasks)["overdue"]}</span>
          </div>
          <div className="mr-1 min-w-9">
            <i className="ri-circle-fill mr-1 text-neutral-500"></i>
            <span>{(row.getValue("tasks") as employeeTasks)["todo"]}</span>
          </div>
        </div>
      );
    },
  },
  {
    id: "expand",
    cell: ({ row }) => <EmployeePopup row={row} />,
  },
];

export function roleToSpan(roles: string[]) {
  if (roles.length == 0) {
    return <span className="italic text-neutral-700">No Assigned Role</span>;
  } else {
    return <span>{roles.join(", ")}</span>;
  }
}

function getData(): employee[] {
  return [
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
}

export default function EmployeeList() {
  const data = getData();

  return (
    <>
      <DataTable columns={columns} data={data} alternate />
    </>
  );
}
