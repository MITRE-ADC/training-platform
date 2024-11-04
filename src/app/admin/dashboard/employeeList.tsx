"use client";

import { DataTable, SortableColumn } from "@/components/ui/dataTable";
import { ColumnDef } from "@tanstack/react-table";
import EmployeePopup from "./employeePopup";
import {
  employeeOverview,
  employeeTasks,
  getManageEmployees,
} from "./employeeDefinitions";
import { Text } from "@/components/ui/custom/text";
import { useState } from "react";
import { P } from "@/components/ui/custom/text";

const columns: ColumnDef<employeeOverview>[] = [
  {
    id: "buffer",
    cell: () => <div></div>,
  },
  {
    accessorKey: "firstName",
    header: ({ column }) => (
      <SortableColumn column={column} title="First Name" />
    ),
  },
  {
    accessorKey: "lastName",
    header: ({ column }) => (
      <SortableColumn column={column} title="Last Name" />
    ),
  },
  {
    accessorKey: "email",
    header: ({ column }) => <SortableColumn column={column} title="Email" />,
  },
  {
    accessorKey: "roles",
    header: ({ column }) => <SortableColumn column={column} title="Roles" />,
    cell: ({ row }) => roleToSpan(row.getValue("roles")),
  },
  {
    accessorKey: "tasks",
    header: ({ column }) => <SortableColumn column={column} title="Status" />,
    cell: ({ row }) => {
      return (
        <div className="flex gap-[8px] text-[18px]">
          <div className="min-w-9 flex items-center">
            <i className="absolute ri-checkbox-blank-circle-fill text-dark mr-1 -z-10 scale-[75%]"></i>
            <i className="ri-checkbox-circle-fill text-good mr-1"></i>
            <P className="text-dark">{(row.getValue("tasks") as employeeTasks)["completed"]}</P>
          </div>
          <div className="min-w-9 flex items-center">
            <i className="absolute ri-checkbox-blank-circle-fill text-dark mr-1 -z-10 scale-[75%]"></i>
            <i className="ri-indeterminate-circle-fill mr-1 text-neutral"></i>
            <P className="text-dark">{(row.getValue("tasks") as employeeTasks)["todo"]}</P>
          </div>
          <div className="min-w-9 flex items-center">
            <i className="absolute ri-checkbox-blank-circle-fill text-dark mr-1 -z-10 scale-[75%]"></i>
            <i className="ri-close-circle-fill fill-dark text-alert mr-1"></i>
            <P className="text-dark">{(row.getValue("tasks") as employeeTasks)["overdue"]}</P>
          </div>
        </div>
      );
    },
  },
  {
    id: "expand",
    cell: ({ row }) => <EmployeePopup employee={row.getValue("email")} />,
  },
];

export function roleToSpan(roles: string[]) {
  return roles.length == 0 ? (
    <span className="text-darkLight">No Assigned Role</span>
  ) : (
    <span>{roles.join(", ")}</span>
  );
}

export default function EmployeeList() {
  const [data, setData] = useState<employeeOverview[]>([]);

  setTimeout(() => setData(getManageEmployees()), 500);

  return (
    <DataTable
      columns={columns}
      data={getManageEmployees()}
      defaultSort="tasks"
    />
  );
}
