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
import { Button } from "@/components/ui/button";

interface analysisInterface {
  user_id: string;
  analysis: {
    overdue: number;
    completed: number;
    in_progress: number;
    not_started: number;
  };
}

export interface analysisRequestInterface {
  course_filter: string;
  assignment_filter: string;
  status_filter: string;
}

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
    header: ({ column }) => (
      <SortableColumn column={column} title="Course Status" />
    ),
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
      const a = _a.getValue("tasks") as employeeTasks;
      const b = _b.getValue("tasks") as employeeTasks;

      // sort by overdue, then todo, then completed
      if (a.overdue == b.overdue) {
        if (a.todo == b.todo) {
          return a.completed - b.completed;
        } else return a.todo - b.todo;
      } else return a.overdue - b.overdue;
    },
  },
  {
    id: "expand",
    cell: ({ row }) => <EmployeePopup employeeId={row.original.id} />,
  },
  {
    id: "remove",
    cell: ({ row }) => (
      <Button className="text-darkLight" variant="outline">
        <i className="ri-delete-bin-5-line ri-1x"></i>
      </Button>
    ),
  },
];

export function roleToSpan(roles: string[]) {
  return roles.length == 0 ? (
    <span className="text-darkLight">No Assigned Role</span>
  ) : (
    <span>{roles.join(", ")}</span>
  );
}

export default function EmployeeList({
  searchFilter,
  setSearchFilter,
  filter,
}: {
  searchFilter: string;
  setSearchFilter: Dispatch<SetStateAction<string>>;
  filter?: analysisRequestInterface;
}) {
  const [data, setData] = useState<employeeOverview[]>([]);
  const [didMount, setMount] = useState<MountStatus>(MountStatus.isNotMounted);
  const [placeholder, setPlaceholder] = useState<string>("Loading...");

  useEffect(() => {
    setMount(MountStatus.isFirstMounted);

    // moving signals out of data tables is very annoying, so just use events instead
    removeAllListeners("request_employee_list_reload");
    addEventListener("request_employee_list_reload", () => load());
  }, []);

  useEffect(() => {
    load();
  }, [filter]);

  function load() {
    setData([]);
    setPlaceholder("Loading...");

    axios
      .all([
        filter
          ? axios.get(req("api/filters"), { params: filter })
          : axios.get(req("api/users")),
        axios.get(req("api/analysis/courses")),
      ])
      .then(
        axios.spread((u, c) => {
          const data: User[] = u.data.data;
          const formatted: employeeOverview[] = [];
          const analysis: analysisInterface[] = c.data.data;

          data.forEach((user) => {
            const tasks = {
              overdue: 0,
              completed: 0,
              todo: 0,
            };

            const anl = analysis.find((x) => x.user_id == user.id);
            if (anl) {
              tasks.overdue = anl.analysis.overdue;
              tasks.completed = anl.analysis.completed;
              tasks.todo = anl.analysis.not_started + anl.analysis.in_progress;
            }

            formatted.push({
              firstName: user.name.split(" ")[0],
              lastName: user.name.split(" ")[1],
              email: user.email,
              tasks: tasks,
              id: user.id,
            });
          });

          setData(formatted);
          setPlaceholder("No Results.");
        })
      )
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
          const f = _f.trim().toLowerCase().split(" ");

          if (f.length == 0) return true;

          // scuffed
          const match = (
            ((((row.getValue("firstName") as string) +
              row.getValue("lastName")) as string) +
              row.getValue("email")) as string
          ).toLowerCase();

          for (let i = 0; i < f.length; i++) {
            if (!match.includes(f[i])) return false;
          }

          return true;
        },
      }}
    />
  );
}
