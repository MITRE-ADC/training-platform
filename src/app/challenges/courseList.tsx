import React, { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { _DATA, Course, courseAssignment } from "./courseDefinitions";
import "remixicon/fonts/remixicon.css";
import { req } from "@/lib/utils";
import axios from "axios";
import {
  MountStatus,
  employeeOverview,
} from "../admin/dashboard/employeeDefinitions";
import { getAllUserAssignments, getCoursesByUser } from "@/db/queries";
import { Input } from "@/components/ui/input";

const SubmitModal = ({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) => {
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
      setErrorMessage("Please fill out all required fields");
      return;
    }
    if (password.length < 6 || password.length > 10) {
      setErrorMessage("Password must be between 6 and 10 characters");
      setFieldErrors({ ...errors, password: true });
      return;
    }
    if (username.length < 6 || username.length > 45) {
      setErrorMessage("Username must be between 6 and 45 characters");
      setFieldErrors({ ...errors, username: true });
      return;
    }
    const allowed = [
      "a",
      "b",
      "c",
      "d",
      "e",
      "f",
      "g",
      "h",
      "i",
      "j",
      "k",
      "l",
      "m",
      "n",
      "o",
      "p",
      "q",
      "r",
      "s",
      "t",
      "u",
      "v",
      "w",
      "x",
      "y",
      "z",
      "1",
      "2",
      "3",
      "4",
      "5",
      "6",
      "7",
      "8",
      "9",
      "0",
      "-",
    ];
    for (const i of username) {
      if (!allowed.includes(i)) {
        setErrorMessage(
          "Username must only contain lowercase letters, numbers, and hypens"
        );
        setFieldErrors({ ...errors, username: true });
        return;
      }
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

export function CourseList() {
  const [isModalOpen, setModalOpen] = useState(false);
  const openModal = () => setModalOpen(true);
  const closeModal = () => setModalOpen(false);
  // IN PROGRESS API CALLS
  // Trying to fetch data to replace the hard coded data which is currently being used for this page
  const [data, setData] = useState<employeeOverview[]>([]);
  const [didMount, setMount] = useState<MountStatus>(MountStatus.isNotMounted);
  const [placeholder, setPlaceholder] = useState<string>("Loading...");
  useEffect(() => setMount(MountStatus.isFirstMounted), []);

  if (didMount === MountStatus.isFirstMounted && data.length === 0) {
    axios
      .get(req("api/auth"))
      .then((r) => {
        const id = r.data.user.id;
        const formatted: Course[] = [];
        return axios.get(req(`api/user_assignments?userId=${id}`));
      })
      .then((assignmentsResponse) => {
        const assignments = assignmentsResponse.data;
        console.log(assignments);
        setData(assignments);
      })
      .catch(() => {
        setPlaceholder("No Results.");
      });

    setMount(MountStatus.isMounted);
  }

  return (
    <div id="card-container" className="space-y-4">
      {_DATA.map((courseData: Course, courseIndex: number) => (
        <Card
          key={courseIndex}
          id={
            courseData.course +
            courseData.assignments.map((element) => element.name).join()
          }
          className="w-full p-0 shadow-md"
        >
          <CardHeader className="mb-4 pb-0">
            <CardTitle className="mb-4 pb-0 text-2xl font-bold">
              {courseData.course}
            </CardTitle>
            <div className="mt-2 flex flex-col space-y-1 text-gray-500">
              <div className="flex items-center space-x-1">
                <i className="ri-calendar-2-line"></i>
                <span>Assigned: {courseData.assigned} | </span>
                <i className="ri-calendar-schedule-line"></i>
                <span>Due: {courseData.due || "No due date"}</span>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {courseData.assignments.map(
              (assignment: courseAssignment, assignmentIndex: number) => (
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
