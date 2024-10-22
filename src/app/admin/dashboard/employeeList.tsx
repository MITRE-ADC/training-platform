"use client";

import { DataTable, SortableColumn } from "@/components/ui/dataTable";
import { ColumnDef } from "@tanstack/react-table";
import EmployeePopup from "./employeePopup";
import { _DATA, employee, employeeTasks } from "./employeeDefinitions";
import { Text } from "@/components/ui/custom/text";

const columns: ColumnDef<employee>[] = [
  {
    id: "buffer",
    cell: () => <div className="w-4"></div>,
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
        <div className="flex gap-1">
          <div className="min-w-9">
            <i className="ri-checkbox-circle-fill text-good mr-1"></i>
            <span>{(row.getValue("tasks") as employeeTasks)["completed"]}</span>
          </div>
          <div className="min-w-9">
            <i className="ri-error-warning-fill text-alert mr-1"></i>
            <span>{(row.getValue("tasks") as employeeTasks)["overdue"]}</span>
          </div>
          <div className="min-w-9">
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
  return roles.length == 0 ? (
    <Text disabled>No Assigned Role</Text>
  ) : (
    <span>{roles.join(", ")}</span>
  );
}

export default function EmployeeList() {
  return (
    <DataTable columns={columns} data={_DATA} defaultSort="tasks" alternate />
  );
}
