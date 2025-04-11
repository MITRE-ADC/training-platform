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
  EMPTY_EMPLOYEE,
  _ROLETAGS,
} from "./employeeDefinitions";
import { H2, P } from "@/components/ui/custom/text";
import CourseSelectorPopup, {
  CourseSelectorChildData,
  CourseSelectorData,
} from "@/components/ui/custom/courseSelectorPopup";
import { forwardRef, useRef, useState } from "react";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { Input } from "@/components/ui/input";
import axios from "axios";
import { req } from "@/lib/utils";
import {
  Assignment,
  Course,
  User,
  User_Assignment,
  User_Course,
} from "@/db/schema";
import {
  assignAssignments,
  assignCourse,
  deleteAssignment,
  deleteCourse,
  updateCourseDueDate,
  updateUser,
} from "./dashboardServer";

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

      return <P>{v ? v : "None"}</P>;
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
];

interface EmployeeInfoProps {
  title: string;
  value: string;
}

const EmployeeInfo = forwardRef<HTMLInputElement, EmployeeInfoProps>(
  function EmployeeInfo({ title, value }, ref) {
    return (
      <TableRow className="border-b-0">
        <TableCell className="p-0 pr-6">
          <P>{title}</P>
        </TableCell>
        <TableCell className="p-0">
          <P className="flex h-9 w-min items-center text-darkBlue">
            <Input
              ref={ref}
              defaultValue={value}
              className="h-min w-min rounded-none border-0 py-0 pl-1 shadow-none focus-visible:border-b-[1px] focus-visible:ring-0"
            />
            <i className="ri-edit-2-line -translate-x-full"></i>
          </P>
        </TableCell>
        <TableCell className="w-full"></TableCell>
      </TableRow>
    );
  }
);

export default function EmployeePopup({ employeeId }: { employeeId: string }) {
  const [data, setData] = useState<employee>(EMPTY_EMPLOYEE);
  const [placeholder, setPlaceholder] = useState<string>("Loading...");
  const [courseData, setCourseData] = useState<CourseSelectorData[]>([]);
  const [defaultCourses, setDefaultCourses] = useState<string[]>([]);

  const [assignmentCache, setAssignmentCache] = useState<Assignment[]>([]);
  const [courseCache, setCourseCache] = useState<Course[]>([]);

  const emailInput = useRef<HTMLInputElement | null>(null);
  const nameInput = useRef<HTMLInputElement | null>(null);

  async function load() {
    setPlaceholder("Loading...");

    axios
      .all([
        axios.get(req("api/user_assignments/" + employeeId)),
        axios.get(req("api/user_courses/" + employeeId)),
        assignmentCache.length == 0 ? axios.get(req("api/assignments")) : null,
        courseCache.length == 0 ? axios.get(req("api/courses")) : null,
        axios.get(req("api/users/" + employeeId)),
      ])
      .then(
        axios.spread((_ua, _uc, _a, _c, _u) => {
          if (!_ua || !_uc || !_u) return;

          const uassignments: User_Assignment[] = _ua.data.data;
          const ucourses: User_Course[] = _uc.data.data;
          const user: User = _u.data.data;

          if (_a) setAssignmentCache(_a.data.data as Assignment[]);
          if (_c) setCourseCache(_c.data.data as Course[]);

          const assignments: Assignment[] = _a ? _a.data.data : assignmentCache;
          const courses: Course[] = _c ? _c.data.data : courseCache;

          if (!user) return;

          const date = new Date();

          const formattedUser: employee = {
            firstName: user.name.split(" ")[0],
            lastName: user.name.split(" ")[1],
            email: user.email,
            tasks: {
              overdue: 0,
              completed: 0,
              todo: 0,
            },
            assignments: uassignments.flatMap((a) => {
              const assignment = assignments.find(
                (x) => x.assignment_id == a.assignment_id
              );
              const course = courses.find(
                (x) => x.course_id == assignment?.course_id
              );
              const ucourse = ucourses.find(
                (x) => x.course_id == assignment?.course_id
              );

              if (!assignment || !course || !ucourse) {
                console.error(
                  "Could not find assignment " +
                    a.assignment_id +
                    " or its related course."
                );
                return [];
              }

              const assigned = new Date(ucourse.assigned_date);
              const due = new Date(ucourse.due_date);

              if (course.course_name == "NONE COURSE")
                course.course_name = "Uncategorized";

              return {
                course: course.course_name,
                assignment: assignment.assignment_name,
                assigned: ucourse.assigned_date
                  ? assigned.toLocaleDateString("en-US", { timeZone: "UTC" })
                  : "Unknown",
                due: ucourse.due_date
                  ? due.toLocaleDateString("en-US", { timeZone: "UTC" })
                  : "No Deadline",
                status: a.completed
                  ? "done"
                  : ucourse.due_date
                    ? due > date
                      ? "todo"
                      : "overdue"
                    : "todo",
              };
            }),
          };

          const formattedCourses: CourseSelectorData[] = courses.map((c) => {
            const due_date = ucourses.find(
              (x) => x.course_id == c.course_id
            )?.due_date;

            return {
              name: c.course_name,
              id: "c_" + c.course_id,
              due: due_date ? new Date(due_date) : undefined,
              children: assignments.flatMap((a) =>
                a.course_id == c.course_id
                  ? {
                      name: a.assignment_name,
                      id: "a_" + a.assignment_id,
                      webgoat: a.webgoat_info,
                      courseId: "" + a.course_id,
                    }
                  : []
              ),
            };
          });

          let selectedCourses: string[] = uassignments.flatMap((a) => {
            const _a = assignments.find(
              (x) => x.assignment_id == a.assignment_id
            );
            return _a ? "a_" + _a.assignment_id : [];
          });

          selectedCourses = selectedCourses.concat(
            ucourses.flatMap((c) => {
              const _c = courses.find((x) => x.course_id == c.course_id);
              return _c ? "c_" + _c.course_id : [];
            })
          );

          setData(formattedUser);
          setCourseData(formattedCourses);
          setDefaultCourses(selectedCourses);

          if (formattedUser.assignments.length == 0) {
            setPlaceholder("No Results.");
          }
        })
      )
      .catch(() => setPlaceholder("No Results."));
  }

  async function handleSubmit() {
    if (emailInput.current && nameInput.current) {
      const email = emailInput.current.value;
      let name = nameInput.current.value;

      // sanitize name - we only want first and last name (one space max)
      const n = name.split(" ");
      if (n.length > 1) {
        name = n[0] + " " + n[1];
      }

      if (email != data.email || name != data.firstName + " " + data.lastName) {
        setData(EMPTY_EMPLOYEE);
        await updateUser(employeeId, email, name);

        dispatchEvent(new Event("request_employee_list_reload"));
      }
    }
  }

  function handleCourseUpdate(
    courses: Record<string, boolean>,
    dueDates: Record<string, Date>
  ) {
    const updates: Promise<void>[] = [];

    let hasChanges = false;
    for (const entry in courses) {
      const res = courses[entry];

      if (res && !defaultCourses.includes(entry)) {
        if (entry.startsWith("c_"))
          updates.push(assignCourse(employeeId, entry.substring(2)));
        else updates.push(assignAssignments(employeeId, entry.substring(2)));

        hasChanges = true;
      } else if (!res && defaultCourses.includes(entry)) {
        if (entry.startsWith("c_"))
          updates.push(deleteCourse(employeeId, entry.substring(2)));
        else updates.push(deleteAssignment(employeeId, entry.substring(2)));

        hasChanges = true;
      }
    }

    for (const entry in dueDates) {
      updates.push(
        updateCourseDueDate(employeeId, entry.substring(2), dueDates[entry])
      );
      hasChanges = true;
    }

    if (hasChanges) {
      setPlaceholder("Loading...");

      setCourseData([]);
      setDefaultCourses([]);
      setData({
        ...data,
        assignments: [],
      });

      Promise.all(updates).then(() => load());
    }
  }

  return (
    <>
      <Sheet>
        <SheetTrigger asChild>
          {/* Even though load should be async, it causes animation lag when the sheet opens, so
           * delay the call until the sheet fully opens */}
          <Button
            variant="default"
            onClick={() => setTimeout(() => load(), 500)}
          >
            Expand
          </Button>
        </SheetTrigger>
        <SheetContent side="right" className="w-[75vw]">
          <SheetHeader>
            <VisuallyHidden>
              <SheetTitle>Employee Popup</SheetTitle>
              <SheetDescription>
                Course and assignment information for employee {employeeId}
              </SheetDescription>
              {/* hidden field to take away auto focus on name field */}
              <input></input>
            </VisuallyHidden>
          </SheetHeader>
          <div className="flex h-full w-full flex-col gap-4 px-16 pb-8 pt-12">
            <H2>Employee Information</H2>
            <Table>
              <TableBody className="whitespace-nowrap font-sans">
                <EmployeeInfo
                  ref={nameInput}
                  title="Name"
                  value={
                    data.firstName && data.lastName
                      ? data.firstName + " " + data.lastName
                      : ""
                  }
                />
                <EmployeeInfo
                  ref={emailInput}
                  title="Email"
                  value={data.email}
                />
              </TableBody>
            </Table>
            <div className="h-2"></div>
            <div className="flex items-end justify-between">
              <H2>Employee Assignments</H2>
              <CourseSelectorPopup
                title="Modify Courses"
                data={courseData}
                setData={setCourseData}
                defaultCourses={defaultCourses}
                handle={handleCourseUpdate}
              >
                <Button variant="outline" className="text-darkLight">
                  <P className="text-darkLight">Modify Courses</P>
                </Button>
              </CourseSelectorPopup>
            </div>
            <div className="w-full flex-grow shadow-md">
              <DataTable
                columns={columns}
                data={data["assignments"]}
                defaultSort="status"
                placeholder={placeholder}
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
              <Close asChild>
                <Button
                  className="h-[40px] w-[140px] rounded-md bg-navy hover:bg-navy/80"
                  variant="secondary"
                  onClick={handleSubmit}
                >
                  <P className="font-[600] text-white">Submit Changes</P>
                </Button>
              </Close>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}
