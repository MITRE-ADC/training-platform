import React, { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import "remixicon/fonts/remixicon.css";
import { req } from "@/lib/utils";
import axios from "axios";
import {
  EMPTY_EMPLOYEE,
  MountStatus,
  employee,
  employeeOverview,
} from "../admin/dashboard/employeeDefinitions";
import { getAllUserAssignments, getCoursesByUser } from "@/db/queries";
import { Input } from "@/components/ui/input";
import { Assignment, Course, User, User_Assignment, User_Course } from "@/db/schema";

const SubmitModal = ({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) => {
  // TODO: consider switching to zod for form validation
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [fieldErrors, setFieldErrors] = useState({
    username: false,
    password: false,
  });
  const [errorMessage, setErrorMessage] = useState("");

  const handleSignIn = async () => {
    const errors = {
      username: false,
      password: false,
    };

    if (!username) errors.username = true;
    if (!password) errors.password = true;

    setFieldErrors(errors);

    if (Object.values(errors).includes(true)) {
      setErrorMessage("Please fill out all required fields.");
      return;
    }
    if (password.length < 6 || password.length > 10) {
      setErrorMessage("Password must be between 6 and 10 characters.");
      setFieldErrors({ ...errors, password: true });
      return;
    }
    if (username.length < 6 || username.length > 45) {
      setErrorMessage("Username must be between 6 and 45 characters.");
      setFieldErrors({ ...errors, username: true });
      return;
    }

    if (/[^a-z0-9\-]/.test(username)) {
      setErrorMessage("Username must only contain lowercase letters, numbers, and hyphens.");
      setFieldErrors({ ...errors, username: true });
      return;
    }

    setErrorMessage("");
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/20">
      <Card className="w-[480px]">
        <CardHeader className="pb-2">
          <CardTitle>WebGoat Login</CardTitle>
          <p className="text-sm text-muted-foreground">
            Input your WebGoat credentials here:
          </p>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <Input
              className={`mb-4 py-6 text-lg ${fieldErrors.username ? "border-customRed border-2" : ""}`}
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="flex gap-4">
            <Input
              className={`mb-4 py-6 text-lg ${fieldErrors.password ? "border-customRed border-2" : ""}`}
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          {errorMessage && (
            <p className="text-customRed mb-4">{errorMessage}</p>
          )}
          <div className="flex space-x-2">
            <Button
              className="w-1/2 rounded-md bg-slate-800 px-16 py-5 text-sm text-white hover:bg-slate-600"
              onClick={handleSignIn}
            >
              Submit
            </Button>
            <Button
              onClick={onClose}
              className="w-1/2 rounded-md bg-slate-400 px-16 py-5 text-sm text-white hover:bg-slate-300"
            >
              Close
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

interface CourseListData {
  name: string,
  assignDate: string,
  dueDate: string,
  id: number,
  assignments: {
    name: string,
    webgoat: string,
    id: number,
    status: 'done' | 'todo' | 'overdue',
  }[]
}

export function CourseList() {
  const [didMount, setMount] = useState<MountStatus>(MountStatus.isNotMounted);
  useEffect(() => setMount(MountStatus.isFirstMounted), []);

  const [isModalOpen, setModalOpen] = useState(false);
  const openModal = () => setModalOpen(true);
  const closeModal = () => setModalOpen(false);

  const [data, setData] = useState<CourseListData[]>([]);
  const [assignmentCache, setAssignmentCache] = useState<Assignment[]>([]);
  const [courseCache, setCourseCache] = useState<Course[]>([]);

  if (didMount === MountStatus.isFirstMounted) {
    axios
      .get(req('api/auth'))
      .then((r) => axios.all([
        r.data.user,
        axios.get(req(`api/user_assignments/${r.data.user.id}`)),
        axios.get(req(`api/user_courses/${r.data.user.id}`)),
        assignmentCache.length == 0 ? axios.get(req("api/assignments")) : null,
        courseCache.length == 0 ? axios.get(req("api/courses")) : null,
      ])).then(([_user, _uAssignment, _uCourse, _assignments, _courses]) => {
        if (!_uAssignment || !_uCourse || !_user) return;
        if (_assignments) setAssignmentCache(_assignments.data.data as Assignment[]);
        if (_courses) setCourseCache(_courses.data.data as Course[]);

        // set state doesn't update until next frame
        const assignments = _assignments ? _assignments.data.data as Assignment[] : assignmentCache;
        const courses = _courses ? _courses.data.data as Course[] : courseCache;
        const uAssignments = _uAssignment.data.data as User_Assignment[];
        const uCourses = _uCourse.data.data as User_Course[];
        const user = _user as User;

        const d: CourseListData [] = [];
        const today = new Date();

        uCourses.forEach((c) => {
          const course = courses.find(x => x.course_id == c.course_id)!;
          const validAssignments = assignments.filter(a => a.course_id == c.course_id);

          const due = c.due_date ? new Date(c.due_date) : undefined;

          d.push({
            name: course.course_name,
            id: course.course_id,
            dueDate: due ? due.toLocaleDateString('en-US', { timeZone: 'UTC' }) : 'No Due Date',
            assignDate: new Date(c.assigned_date).toLocaleDateString('en-US', { timeZone: 'UTC' }),
            assignments: uAssignments
              // all user assignments that are in valid assignments
              .filter(a => validAssignments.find(va => va.assignment_id == a.assignment_id) != undefined)
              .map((assignment) => {
                  const a = validAssignments.find(a => a.assignment_id == assignment.assignment_id)!;
                  return {
                    name: a.assignment_name,
                    id: a.assignment_id,
                    webgoat: a.webgoat_info,
                    status: assignment.completed ? 'done' : due ? due > today ? 'todo' : 'overdue' : 'todo'
                  };
              })
          });
        });

        setData(d);
      }).catch((e) => {
        console.error(e);
      });

    setMount(MountStatus.isMounted);
  }

  return (
    <div id="card-container" className="space-y-4">
      {data.map((courseData: CourseListData, courseIndex: number) => (
        <Card
          key={courseIndex}
          id={
            courseData.name +
            courseData.assignments.map((element) => element.name).join()
          }
          className="w-full p-0 shadow-md"
        >
          <CardHeader className="mb-4 pb-0">
            <CardTitle className="mb-4 pb-0 text-2xl font-bold">
              {courseData.name}
            </CardTitle>
            <div className="mt-2 flex flex-col space-y-1 text-gray-500">
              <div className="flex items-center space-x-1">
                <i className="ri-calendar-2-line"></i>
                <span>Assigned: {courseData.assignDate} | </span>
                <i className="ri-calendar-schedule-line"></i>
                <span>Due: {courseData.dueDate}</span>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {courseData.assignments.map(
              (assignment, assignmentIndex: number) => (
                <div
                  key={assignmentIndex}
                  className="flex items-center justify-between border-t border-gray-200 py-4"
                >
                  <div>
                    <p className="font-semibold">{assignment.name}</p>
                    <div className="mt-1 flex items-center space-x-2">
                      <span
                        className={`rounded-full px-2 py-1 text-sm font-semibold ${
                          assignment.status === "done"
                            ? "bg-green text-white"
                            : assignment.status === "overdue"
                              ? "bg-red text-white"
                              : "bg-yellow text-white"
                        }`}
                      >
                        {assignment.status === "done"
                          ? "Complete"
                          : assignment.status === "overdue"
                            ? "Overdue"
                            : "Incomplete"}
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-col items-end space-y-2">
                    <Button
                      className="w-32 rounded-md bg-blue px-16 py-5 text-sm text-white hover:bg-slate-300"
                      onClick={openModal}
                    >
                      Link to Lesson
                    </Button>
                  </div>
                </div>
              )
            )}
          </CardContent>
        </Card>
      ))}

      <SubmitModal isOpen={isModalOpen} onClose={closeModal} />
    </div>
  );
}

export default CourseList;
