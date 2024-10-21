"use client";

import { DataTable } from "@/components/ui/dataTable";
import { ColumnDef } from "@tanstack/react-table";

type employeeTasks = {
  overdue: number;
  warning: number;
  completed: number;
  todo: number;
};

type employee = {
  name: string;
  tasks: employeeTasks;
};

const columns: ColumnDef<employee>[] = [
  {
    accessorKey: "tasks",
    header: "Status",
    cell: ({ row }) => {
      return (
        <div className="flex">
          <div className="mr-1 min-w-9">
            <i className="ri-error-warning-fill mr-1 text-rose-500"></i>
            <span>{(row.getValue("tasks") as employeeTasks)["overdue"]}</span>
          </div>
          <div className="mr-1 min-w-9">
            <i className="ri-alert-fill mr-1 text-amber-400"></i>
            <span>{(row.getValue("tasks") as employeeTasks)["warning"]}</span>
          </div>
          <div className="mr-1 min-w-9">
            <i className="ri-checkbox-circle-fill mr-1 text-green-600"></i>
            <span>{(row.getValue("tasks") as employeeTasks)["completed"]}</span>
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
    accessorKey: "name",
    header: "Employee",
  },
];

function getData(): employee[] {
  return [
    {
      name: "John Doe",
      tasks: {
        overdue: 2,
        warning: 1,
        completed: 1,
        todo: 2,
      },
    },
    {
      name: "Jane Doe",
      tasks: {
        overdue: 1,
        warning: 4,
        completed: 5,
        todo: 0,
      },
    },
    {
      name: "Emilia Oneal",
      tasks: {
        overdue: 0,
        warning: 0,
        completed: 1,
        todo: 2,
      },
    },
    {
      name: "Will Zamora",
      tasks: {
        overdue: 0,
        warning: 0,
        completed: 10,
        todo: 0,
      },
    },
    {
      name: "Ibraheem White",
      tasks: {
        overdue: 0,
        warning: 3,
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
