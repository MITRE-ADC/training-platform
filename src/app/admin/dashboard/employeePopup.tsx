import { Sheet, SheetTrigger, SheetContent } from "@/components/ui/sheet";
import { ColumnDef, Row } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Table, TableRow, TableBody, TableCell } from "@/components/ui/table";
import { DataTable } from "@/components/ui/dataTable";
import { Close } from "@radix-ui/react-dialog";
import { DatePopup, StringPopup } from "@/components/ui/custom/editPopup";
import { employeeAssignment, employee } from "./employeeDefinitions";
import { roleToSpan } from "./exployeeList";
import { H2, Text } from "@/components/ui/custom/text";

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
      const but = (
        <Button
          variant="secondary"
          className="main-outline ml-2 h-5 px-2 py-1 text-xs"
        >
          Edit
        </Button>
      );

      const v: undefined | string = row.getValue("due");

      return (
        <>
          <Text disabled={!v}>{v ? v : "None"}</Text>
          <DatePopup title="Assign Due Date" open={but} />
        </>
      );
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const v = row.getValue("status");
      return v == "done" ? (
        <Text status="good">Completed</Text>
      ) : v == "overdue" ? (
        <Text status="alert">Overdue</Text>
      ) : (
        <Text>Incomplete</Text>
      );
    },
  },
  {
    id: "delete",
    cell: () => <i className="ri-delete-bin-2-line"></i>,
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
      <TableCell className="p-0 pr-6 text-lg font-bold">{title}</TableCell>
      <TableCell className="p-0 pr-6">{value}</TableCell>
      <TableCell className="p-0 pr-6">{children}</TableCell>
      <TableCell className="w-full"></TableCell>
    </TableRow>
  );
}

export default function EmployeePopup({ row }: { row: Row<employee> }) {
  return (
    <>
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline">Expand</Button>
        </SheetTrigger>
        <SheetContent side="right" className="w-[75vw]">
          <div className="flex h-full w-full flex-col gap-4 p-8 pt-4">
            <H2>Employee Information</H2>
            <div className="h-4"></div>
            <Table>
              <TableBody className="whitespace-nowrap font-sans">
                <EmployeeInfo
                  title="Name"
                  value={
                    row.getValue("firstName") + " " + row.getValue("lastName")
                  }
                >
                  <StringPopup title="Update Name" />
                </EmployeeInfo>
                <EmployeeInfo title="Email" value={row.getValue("email")}>
                  <StringPopup title="Update Email" />
                </EmployeeInfo>
                <EmployeeInfo
                  title="Role"
                  value={roleToSpan(row.getValue("roles"))}
                >
                  <StringPopup title="Set Roles" />
                </EmployeeInfo>
              </TableBody>
            </Table>
            <div className="h-2"></div>
            <div className="flex items-end justify-between">
              <H2>Employee Courses</H2>
              <div className="gap-4 font-sans">
                <Button variant="ghost" className="text-md align-text-bottom">
                  + Add Course
                </Button>
              </div>
            </div>
            <div className="main-outline w-full flex-grow">
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
