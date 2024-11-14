import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Table, TableRow, TableBody, TableCell } from "@/components/ui/table";
import { DataTable, SortableColumn } from "@/components/ui/dataTable";
import { Close } from "@radix-ui/react-dialog";
import { DatePopup, StringPopup } from "@/components/ui/custom/editPopup";
import {
  employeeAssignment,
  employee,
  getEmployeeData,
  EMPTY_EMPLOYEE,
  _ROLETAGS,
} from "./employeeDefinitions";
import { roleToSpan } from "./employeeList";
import { H2, P, Text } from "@/components/ui/custom/text";
import CourseSelectorPopup from "@/components/ui/custom/courseSelectorPopup";
import { useState } from "react";
import { TagSelector } from "@/components/ui/custom/tagSelector";
import { Tag } from "@/components/ui/tag/tag-input";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";

const columns: ColumnDef<employeeAssignment>[] = [
  {
    id: "buffer",
    cell: () => <span className="w-2"></span>,
  },
  {
    accessorKey: "course",
    header: ({ column }) => <SortableColumn column={column} title="Course" />,
  },
  {
    accessorKey: "assignment",
    header: ({ column }) => (
      <SortableColumn column={column} title="Assignment" />
    ),
  },
  {
    accessorKey: "assigned",
    header: ({ column }) => (
      <SortableColumn column={column} title="Date Assigned" />
    ),
  },
  {
    accessorKey: "due",
    header: ({ column }) => <SortableColumn column={column} title="Date Due" />,
    cell: ({ row }) => {
      const v: undefined | string = row.getValue("due");

      return (
        <>
          <P>{v ? v : "None"}</P>
          <DatePopup
            title="Assign Due Date"
            openBut={
              <i className="ri-edit-2-line ml-2 cursor-pointer text-darkBlue"></i>
            }
          />
        </>
      );
    },
  },
  {
    accessorKey: "status",
    header: ({ column }) => <SortableColumn column={column} title="Status" />,
    cell: ({ row }) => {
      const v = row.getValue("status");
      return (
        <div className="flex items-center">
          {v == "done" ? (
            <P className="w-min rounded-xl bg-green px-4 py-[6px] text-[11px] font-[600] text-white">
              Completed
            </P>
          ) : v == "overdue" ? (
            <P className="w-min rounded-xl bg-red px-4 py-[6px] text-[11px] font-[600] text-white">
              Overdue
            </P>
          ) : (
            <P className="w-min rounded-xl bg-yellow px-4 py-[6px] text-[11px] font-[600] text-white">
              Incomplete
            </P>
          )}
        </div>
      );
    },
  },
  {
    id: "delete",
    cell: () => <i className="ri-close-large-line text-darkBlue"></i>,
  },
];

function EmployeeInfo({
  title,
  value,
  children,
}: {
  title: string;
  value: string | JSX.Element;
  children: React.ReactNode;
}) {
  return (
    <TableRow className="border-b-0">
      <TableCell className="p-0 pr-6">
        <P>{title}</P>
      </TableCell>
      <TableCell className="p-0">
        <P className="text-darkBlue">{value}</P>
        {children}
      </TableCell>
      <TableCell className="w-full"></TableCell>
    </TableRow>
  );
}

export default function EmployeePopup({ employee }: { employee: string }) {
  const [data, setData] = useState<employee>(EMPTY_EMPLOYEE);
  const [roles, setRoles] = useState<Tag[]>([]);

  function load() {
    setTimeout(() => {
      //const d = getEmployeeData(employee);
      const d = getEmployeeData("email@email.org");
      if (d) {
        setData(d);
        setRoles(d.roles);
      } else console.error("Trying to find unknown employee " + employee);
    }, 500);
  }

  return (
    <>
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="default" onClick={load}>
            Expand
          </Button>
        </SheetTrigger>
        <SheetContent side="right" className="w-[75vw]">
          <SheetHeader>
            <VisuallyHidden>
              <SheetTitle>Employee Popup</SheetTitle>
              <SheetDescription>
                Course and assignment information for {employee}
              </SheetDescription>
            </VisuallyHidden>
          </SheetHeader>
          <div className="flex h-full w-full flex-col gap-4 px-16 pb-8 pt-12">
            <H2>Employee Information</H2>
            <Table>
              <TableBody className="whitespace-nowrap font-sans">
                <EmployeeInfo
                  title="Name"
                  value={data["firstName"] + " " + data["lastName"]}
                >
                  <StringPopup
                    title="Update Name"
                    openBut={
                      <i className="ri-edit-2-line ml-2 cursor-pointer text-darkBlue"></i>
                    }
                  />
                </EmployeeInfo>
                <EmployeeInfo title="Email" value={data["email"]}>
                  <StringPopup
                    title="Update Email"
                    openBut={
                      <i className="ri-edit-2-line ml-2 cursor-pointer text-darkBlue"></i>
                    }
                  />
                </EmployeeInfo>
                <TableRow className="border-b-0">
                  <TableCell className="p-0 pr-6">
                    <P>Role</P>
                  </TableCell>
                  <TableCell className="p-0 w-full">
                    <P className="translate-y-[2px] text-darkBlue block">
                      <div className="max-w-[750px] w-min">
                        <TagSelector
                          title=""
                          id="roles"
                          tags={_ROLETAGS}
                          selectedTags={roles}
                          setSelectedTags={setRoles}
                          span="flex-row-reverse justify-end"
                          popoverTrigger="flex-row-reverse justify-end"
                        />
                      </div>
                    </P>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
            <div className="h-2"></div>
            <div className="flex items-end justify-between">
              <H2>Employee Courses</H2>
              <CourseSelectorPopup title="Add Course" email={data.email}>
                <Button variant="outline" className="text-darkLight">
                  <P className="text-darkLight">Add Courses</P>
                </Button>
              </CourseSelectorPopup>
            </div>
            <div className="w-full flex-grow shadow-md">
              <DataTable
                columns={columns}
                data={data["assignments"]}
                defaultSort="status"
              />
            </div>
            <div className="flex justify-end gap-4 font-sans">
              <Close asChild>
                <Button
                  className="h-[40px] w-[140px] rounded-md bg-blue hover:bg-blue/80"
                  variant="secondary"
                >
                  <P className="font-[600] text-white">Cancel</P>
                </Button>
              </Close>
              <Button
                className="h-[40px] w-[140px] rounded-md bg-navy hover:bg-navy/80"
                variant="secondary"
              >
                <P className="font-[600] text-white">Submit Changes</P>
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}
