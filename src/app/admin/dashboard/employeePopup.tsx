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
  EMPTY_EMPLOYEE_ASSIGNMENT,
} from "./employeeDefinitions";
import { roleToSpan } from "./employeeList";
import { H2, P, Text } from "@/components/ui/custom/text";
import CourseSelectorPopup, { CourseSelectorChildData, CourseSelectorData } from "@/components/ui/custom/courseSelectorPopup";
import { MutableRefObject, forwardRef, useRef, useState } from "react";
import { TagSelector } from "@/components/ui/custom/tagSelector";
import { Tag } from "@/components/ui/tag/tag-input";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { Input } from "@/components/ui/input";
import axios from "axios";
import { req } from "@/lib/utils";
import { Assignment, Course, User, User_Assignment, User_Course } from "@/db/schema";
import { assignAssignments, assignCourse, updateUser } from "./dashboardServer";

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

interface EmployeeInfoProps {
  title: string;
  value: string;
}

const EmployeeInfo = forwardRef<HTMLInputElement, EmployeeInfoProps>(function EmployeeInfo({ title, value }, ref) {
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
});

export default function EmployeePopup({ employeeId }: { employeeId: string }) {
  const [data, setData] = useState<employee>(EMPTY_EMPLOYEE);
  const [roles, setRoles] = useState<Tag[]>([]);
  const [placeholder, setPlaceholder] = useState<string>("Loading...");
  const [courseData, setCourseData] = useState<CourseSelectorData[]>([]);
  const [defaultCourses, setDefaultCourses] = useState<string[]>([]);

  const emailInput = useRef<HTMLInputElement | null>(null);
  const nameInput = useRef<HTMLInputElement | null>(null);

  async function load() {
    // TODO: replace with user id get once that route is implemented
    setPlaceholder('Loading...');

    axios.all([
      axios.get(req('api/user_assignments/' + employeeId)),
      axios.get(req('api/user_courses')),
      axios.get(req('api/assignments')),
      axios.get(req('api/courses')),
      axios.get(req('api/users')),
    ]).then(axios.spread((_ua, _uc, _a, _c, _u) => {
      const _uassignments: User_Assignment[] = _ua.data.data;
      const _ucourses: User_Course[] = _uc.data.data;
      const _assignments: Assignment[] = _a.data.data;
      const _courses: Course[] = _c.data.data;
      const _users: User[] = _u.data.data;

      const user = _users.find((u) => u.id == employeeId);
      const uassignments = _uassignments.filter((a) => a.user_id == employeeId);
      const ucourses = _ucourses.filter((c) => c.user_id == employeeId);

      if (!user) return;

      const date = new Date();

      const formattedUser: employee = {
        firstName: user.name.split(' ')[0],
        lastName: user.name.split(' ')[1],
        email: user.email,
        roles: [],
        tasks: {
          overdue: 0,
          completed: 0,
          todo: 0,
        },
        assignments: uassignments.flatMap((a) => {
            const assignment = _assignments.find((x) => x.assignment_id == a.assignment_id);
            const course = _courses.find((x) => x.course_id == assignment?.course_id);
            const ucourse = ucourses.find((x) => x.course_id == assignment?.course_id);

            if (!assignment || !course || !ucourse) {
              console.error("Could not find assignment " + a.assignment_id + " or its related course.");
              return [];
            }

            return {
              course: course.course_name,
              assignment: assignment.assignment_name,
              assigned: ucourse.assigned_date ? ucourse.assigned_date.toDateString() : 'Unknown',
              due: ucourse.due_date ? ucourse.due_date.toDateString() : 'No Deadline',
              status: a.completed ? 'done' : (
                ucourse.due_date ? (ucourse.due_date > date ? 'todo' : 'overdue') : 'todo'
              ),
            }
        })
      };

      const formattedCourses: CourseSelectorData[] = _courses.map((c) => ({
          name: c.course_name,
          id: "c_" + c.course_id,
          children: _assignments.flatMap((a) => (
            a.course_id == c.course_id ? {
              name: a.assignment_name,
              id: "a_" + a.assignment_id,
              webgoat: a.webgoat_info,
              courseId: "" + a.course_id,
            } : []
          ))
        })
      );

      const selectedCourses: string[] = uassignments.flatMap((a) => {
        const _a = _assignments.find((x) => x.assignment_id == a.assignment_id);
        return _a ? 'a_' + _a.assignment_id : [];
      });

      setData(formattedUser);
      setRoles(formattedUser.roles);
      setCourseData(formattedCourses);
      setDefaultCourses(selectedCourses);

      if (formattedUser.assignments.length == 0) {
        setPlaceholder('No Results.');
      }

    })).catch(() => setPlaceholder('No Results.'));
  }

  function handleSubmit() {
    if (emailInput.current && nameInput.current) {
      const email = emailInput.current.value;
      const name = nameInput.current.value;
      if (email != data.email || name != data.firstName + " " + data.lastName) {
        updateUser(employeeId, email, name);
      }
    }
  }

  function handleCourseUpdate(courses: Record<string, boolean>) {
    console.log(courses);
    for (let entry in courses) {
      // currently do not support removing 
      if (!courses[entry]) continue;

      if (entry.startsWith('c_')) assignCourse(employeeId, entry.substring(2));
      else assignAssignments(employeeId, entry.substring(2));
    }
  }

  return (
    <>
      <Sheet>
        <SheetTrigger asChild>
          {/* Even though load should be async, it causes animation lag when the sheet opens, so
            * delay the call until the sheet fully opens */}
          <Button variant="default" onClick={() => setTimeout(() => load(), 500)}>
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
                <EmployeeInfo ref={emailInput} title="Email" value={data.email} />
                <TableRow className="border-b-0">
                  <TableCell className="p-0 pr-6">
                    <P>Role</P>
                  </TableCell>
                  <TableCell className="w-full p-0">
                    <P className="block translate-y-[2px] text-darkBlue">
                      <div className="w-min max-w-[750px]">
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
              <CourseSelectorPopup title="Add Course" data={courseData} setData={setCourseData} defaultCourses={defaultCourses} handle={handleCourseUpdate}>
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
