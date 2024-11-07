"use client";

import { DataTable, SortableColumn } from "@/components/ui/dataTable";
import { ColumnDef } from "@tanstack/react-table";
import EmployeePopup from "./employeePopup";
import {
  employeeOverview,
  employeeTasks,
  getEmployeeData,
  getManageEmployees,
} from "./employeeDefinitions";
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
          <div className="flex min-w-9 items-center">
            <i className="ri-checkbox-blank-circle-fill absolute -z-10 mr-1 scale-[75%] text-dark"></i>
            <i className="ri-checkbox-circle-fill text-good mr-1"></i>
            <P className="text-dark">
              {(row.getValue("tasks") as employeeTasks)["completed"]}
            </P>
          </div>
          <div className="flex min-w-9 items-center">
            <i className="ri-checkbox-blank-circle-fill absolute -z-10 mr-1 scale-[75%] text-dark"></i>
            <i className="ri-indeterminate-circle-fill text-neutral mr-1"></i>
            <P className="text-dark">
              {(row.getValue("tasks") as employeeTasks)["todo"]}
            </P>
          </div>
          <div className="flex min-w-9 items-center">
            <i className="ri-checkbox-blank-circle-fill absolute -z-10 mr-1 scale-[75%] text-dark"></i>
            <i className="ri-close-circle-fill text-alert mr-1 fill-dark"></i>
            <P className="text-dark">
              {(row.getValue("tasks") as employeeTasks)["overdue"]}
            </P>
          </div>
        </div>
      );
    },
  },
  {
    id: "expand",
    cell: ({ row }) => {
      const data = getEmployeeData(row.getValue("email"));
      if (data) return <EmployeePopup data={data} />;
      else
        console.error(
          "Unable to find matching employee with email " + row.getValue("email")
        );
    },
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
  return (
    <DataTable
      columns={columns}
      data={getManageEmployees()}
      defaultSort="tasks"
    />
  );
}
