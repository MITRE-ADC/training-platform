"use client";

import { DataTable, SortableColumn } from "@/components/ui/dataTable";
import { ColumnDef } from "@tanstack/react-table";
import EmployeePopup from "./employeePopup";
import {
  MountStatus,
  employeeOverview,
  employeeTasks,
  getManageEmployees,
} from "./employeeDefinitions";
import { useEffect, useState } from "react";
import { P } from "@/components/ui/custom/text";
import axios from "axios";
import { req } from "@/lib/utils";
import { User } from "@/db/schema";

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
        <div className="relative -z-50 flex gap-[8px] text-[18px]">
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
  const [didMount, setMount] = useState<MountStatus>(MountStatus.isNotMounted);
  const [placeholder, setPlaceholder] = useState<string>("Loading...");

  useEffect(() => setMount(MountStatus.isFirstMounted), []);

  if (didMount == MountStatus.isFirstMounted && data.length == 0) {
    axios
      .get(req("api/users"))
      .then((r) => {
        const data: User[] = r.data.data;
        const formatted: employeeOverview[] = [];

        data.forEach((user) => {
          formatted.push({
            firstName: user.name.split(" ")[0],
            lastName: user.name.split(" ")[1],
            email: user.email,
            roles: ["Not Implemented"],
            tasks: {
              overdue: 0,
              completed: 0,
              todo: 0,
            },
          });
        });

        setData(formatted);
        setPlaceholder("No Results.");
      })
      .catch(() => {
        setPlaceholder("No Results.");
      });

    setMount(MountStatus.isMounted);
  }

  return (
    <DataTable
      columns={columns}
      data={data}
      defaultSort="tasks"
      placeholder={placeholder}
    />
  );
}
