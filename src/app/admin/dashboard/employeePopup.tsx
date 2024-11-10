import { Sheet, SheetTrigger, SheetContent } from "@/components/ui/sheet";
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
          <P>{v ? v : 'None'}</P>
          <DatePopup title="Assign Due Date" openBut={
            <i className="ml-2 ri-edit-2-line cursor-pointer text-darkBlue"></i>
          } />
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
          {
            (v == "done") ? (
              <P className="rounded-xl bg-green w-min text-white text-[11px] py-[6px] px-4 font-[600]">
                Completed
              </P>
            ) : v == "overdue" ? (
              <P className="rounded-xl bg-red w-min text-white text-[11px] py-[6px] px-4 font-[600]">
                  Overdue
                </P>
            ) : (
              <P className="rounded-xl bg-yellow w-min text-white text-[11px] py-[6px] px-4 font-[600]">
                Incomplete
              </P>
            )
        }
        </div>
      )
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
      const d = getEmployeeData('email@email.org')
      if (d) {
        setData(d);
        setRoles(d.roles);
      }
      else console.error("Trying to find unknown employee " + employee);
    }, 500);
  }

  return (
    <>
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="default" onClick={load}>Expand</Button>
        </SheetTrigger>
        <SheetContent side="right" className="w-[75vw]">
          <div className="flex h-full w-full flex-col gap-4 px-16 pt-12 pb-8">
            <H2>Employee Information</H2>
            <Table>
              <TableBody className="whitespace-nowrap font-sans">
                <EmployeeInfo
                  title="Name"
                  value={data["firstName"] + " " + data["lastName"]}
                >
                  <StringPopup title="Update Name" openBut={<i className="ml-2 ri-edit-2-line cursor-pointer text-darkBlue"></i>}/>
                </EmployeeInfo>
                <EmployeeInfo title="Email" value={data["email"]}>
                  <StringPopup title="Update Email" openBut={<i className="ml-2 ri-edit-2-line cursor-pointer text-darkBlue"></i>}/>
                </EmployeeInfo>
                <EmployeeInfo title="Role" value={
                  <div className="translate-y-[2px]">
                    <TagSelector
                      title=""
                      id="roles"
                      tags={_ROLETAGS}
                      selectedTags={roles}
                      setSelectedTags={setRoles}
                      titleClass=""
                    />
                  </div>
                  }>
                </EmployeeInfo>
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
            <div className="shadow-md w-full flex-grow">
              <DataTable
                columns={columns}
                data={data["assignments"]}
                defaultSort="status"
              />
            </div>
            <div className="flex justify-end gap-4 font-sans">
              <Close asChild>
                <Button className="w-[140px] h-[40px] bg-blue rounded-md hover:bg-blue/80" variant="secondary">
                  <P className="text-white font-[600]">Cancel</P>
                </Button>
              </Close>
              <Button className="w-[140px] h-[40px] bg-navy rounded-md hover:bg-navy/80" variant="secondary">
              <P className="text-white font-[600]">Submit Changes</P>
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}
