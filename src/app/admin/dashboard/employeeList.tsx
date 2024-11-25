"use client";

import { DataTable, SortableColumn } from "@/components/ui/dataTable";
import { ColumnDef, ColumnFiltersState } from "@tanstack/react-table";
import EmployeePopup from "./employeePopup";
import {
  MountStatus,
  employeeOverview,
  employeeTasks,
} from "./employeeDefinitions";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { P } from "@/components/ui/custom/text";
import axios from "axios";
import { req } from "@/lib/utils";
import { User } from "@/db/schema";
import { removeAllListeners } from "process";

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
    sortingFn: (_a, _b, _) => {
      const a = _a.getValue('tasks') as employeeTasks;
      const b = _b.getValue('tasks') as employeeTasks;

      // sort by overdue, then todo, then completed
      if (a.overdue == b.overdue) {
        if (a.todo == b.todo) {
          return a.completed - b.completed;
        } else return a.todo - b.todo;
      } else return a.overdue - b.overdue;
    }
  },
  {
    id: "expand",
    cell: ({ row }) => <EmployeePopup employeeId={row.original.id} />,
  },
];

export function roleToSpan(roles: string[]) {
  return roles.length == 0 ? (
    <span className="text-darkLight">No Assigned Role</span>
  ) : (
    <span>{roles.join(", ")}</span>
  );
}

export default function EmployeeList({ searchFilter, setSearchFilter }: {searchFilter: string, setSearchFilter: Dispatch<SetStateAction<string>>}) {
  const [data, setData] = useState<employeeOverview[]>([]);
  const [didMount, setMount] = useState<MountStatus>(MountStatus.isNotMounted);
  const [placeholder, setPlaceholder] = useState<string>("Loading...");

  useEffect(() => {
    setMount(MountStatus.isFirstMounted);

    // moving signals out of data tables is very annoying, so just use events instead
    removeAllListeners('request_employee_list_reload');
    addEventListener('request_employee_list_reload', (e) => load());
  }, []);

  function load() {
    setData([]);
    setPlaceholder('Loading...');

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
            tasks: {
              overdue: 0,
              completed: 0,
              todo: 0,
            },
            id: user.id,
          });
        });

        setData(formatted);
        setPlaceholder("No Results.");
      })
      .catch(() => {
        setPlaceholder("No Results.");
      });
  }

  if (didMount == MountStatus.isFirstMounted && data.length == 0) {
    load();
    setMount(MountStatus.isMounted);
  }

  return (
    <DataTable
      columns={columns}
      data={data}
      defaultSort="tasks"
      placeholder={placeholder}
      filter={{
        filter: searchFilter,
        setFilter: setSearchFilter,
        filterFn: (row, _, _f: string) => {
          const f = _f.trim().toLowerCase().split(' ');

          if (f.length == 0) return true;

          // scuffed
          const match = (row.getValue('firstName') as string +
                         row.getValue('lastName') as string +
                         row.getValue('email') as string)
                        .toLowerCase();

          for (let i = 0; i < f.length; i++) {
            if (!match.includes(f[i])) return false;
          }

          return true;
        }
      }}
    />
  );
}
