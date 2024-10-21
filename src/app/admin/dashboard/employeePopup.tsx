import { Sheet, SheetTrigger, SheetContent } from "@/components/ui/sheet";
import { employee, employeeAssignment, roleToSpan } from "./exployeeList";
import { ColumnDef, Row } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Table, TableRow, TableBody, TableCell } from "@/components/ui/table";
import { DataTable } from "@/components/ui/dataTable";
import { Close } from "@radix-ui/react-dialog";

const columns: ColumnDef<employeeAssignment>[] = [
  {
    id: "buffer",
    cell: () => <span className="w-2"></span>,
  },
  {
    accessorKey: "course",
    header: "Course",
  },
  {
    accessorKey: "assignment",
    header: "Assignment",
  },
  {
    accessorKey: "assigned",
    header: "Date Assigned",
  },
  {
    accessorKey: "due",
    header: "Date Due",
    cell: ({ row }) => {
      return (
        <>
          {row.getValue("due") ? (
            row.getValue("due")
          ) : (
            <span className="italic text-neutral-700">None</span>
          )}
          <Button
            variant="secondary"
            className="ml-2 h-5 px-2 py-1 text-xs outline outline-1 outline-black"
          >
            Edit
          </Button>
        </>
      );
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      switch (row.getValue("status")) {
        case "done":
          return <span className="text-green-600">Completed</span>;
        case "todo":
          return <span className="text-neutral-700">Incomplete</span>;
        case "overdue":
          return <span className="text-rose-500">Overdue</span>;
      }
    },
  },
  {
    id: "delete",
    cell: () => <i className="ri-delete-bin-2-line"></i>,
  },
];

export default function EmployeePopup({ row }: { row: Row<employee> }) {
  return (
    <>
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline">Expand</Button>
        </SheetTrigger>
        <SheetContent side="right" className="w-[75vw]">
          <div className="flex h-full w-full flex-col gap-4 p-8 pt-4">
            <div className="font-sans text-3xl font-[400]">
              Employee Information
            </div>
            <div className="h-4"></div>
            <Table>
              <TableBody className="whitespace-nowrap font-sans">
                <TableRow className="border-b-0">
                  <TableCell className="p-0 pr-6 text-lg font-bold">
                    Name
                  </TableCell>
                  <TableCell className="p-0 pr-6">
                    {row.getValue("firstName") + " " + row.getValue("lastName")}
                  </TableCell>
                  <TableCell className="p-0 pr-6">
                    <Button
                      variant="secondary"
                      className="h-6 px-3 py-0 font-semibold"
                    >
                      Edit
                    </Button>
                  </TableCell>
                  <TableCell className="w-full"></TableCell>
                </TableRow>
                <TableRow className="border-b-0">
                  <TableCell className="p-0 pr-6 text-lg font-bold">
                    Email
                  </TableCell>
                  <TableCell className="p-0 pr-6">
                    {row.getValue("email")}
                  </TableCell>
                  <TableCell className="p-0 pr-6">
                    <Button
                      variant="secondary"
                      className="h-6 px-3 py-0 font-semibold"
                    >
                      Edit
                    </Button>
                  </TableCell>
                </TableRow>
                <TableRow className="border-b-0">
                  <TableCell className="p-0 pr-6 text-lg font-bold">
                    Role
                  </TableCell>
                  <TableCell className="p-0 pr-6">
                    {roleToSpan(row.getValue("roles"))}
                  </TableCell>
                  <TableCell className="p-0 pr-6">
                    <Button
                      variant="secondary"
                      className="h-6 px-3 py-0 font-semibold"
                    >
                      Edit
                    </Button>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
            <div className="h-2"></div>
            <div className="flex items-end justify-between">
              <div className="font-sans text-3xl font-[400]">
                Employee Courses
              </div>
              <div className="gap-4 font-sans">
                <Button variant="ghost" className="text-md align-text-bottom">
                  + Add Plan
                </Button>
                <Button variant="ghost" className="text-md align-text-bottom">
                  + Add Course
                </Button>
              </div>
            </div>
            <div className="w-full flex-grow outline outline-1 outline-black">
              <DataTable columns={columns} data={row.original.assignments} />
            </div>
            <div className="flex justify-end gap-4 font-sans">
              <Close asChild>
                <Button className="h-12 w-52 text-lg" variant="secondary">
                  Cancel
                </Button>
              </Close>
              <Button className="h-12 w-52 text-lg" variant="outline">
                Submit Changes
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}
