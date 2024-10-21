"use client";

import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/dataTable";
import { ColumnDef } from "@tanstack/react-table";

type employeeTasks = {
  overdue: number;
  completed: number;
  todo: number;
};

type employee = {
  firstName: string;
  lastName: string;
  email: string;
  roles: string[];
  tasks: employeeTasks;
};

const columns: ColumnDef<employee>[] = [
  {
    id: "buffer",
    cell: () => <div className="w-4"></div>,
  },
  {
    accessorKey: "firstName",
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
    cell: ({ row }) => {
      const r = row.getValue("roles") as string[];

      if (r.length == 0) {
        return <span className="italic text-gray-500">No Assigned Role</span>;
      } else {
        return <span>{r.join(", ")}</span>;
      }
    },
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
    cell: () => {
      return <Button variant="outline">Expand</Button>;
    },
  },
];

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
}

export default function EmployeeList() {
  const data = getData();

  return (
    <>
      <DataTable columns={columns} data={data} />
    </>
  );
}
