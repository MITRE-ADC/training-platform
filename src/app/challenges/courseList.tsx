import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import "remixicon/fonts/remixicon.css";
import { Input } from "@/components/ui/input";
import { CourseListData } from "./courseDefinitions";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { DialogClose, DialogTrigger } from "@radix-ui/react-dialog";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { ScrollArea } from "@/components/ui/scroll-area";

function SubmitModal() {
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

  return (
    <div>
      <VisuallyHidden>
        <DialogDescription>WebGoat login</DialogDescription>
      </VisuallyHidden>
      <DialogTitle>WebGoat Login</DialogTitle>
      <div className="text-sm text-muted-foreground pb-2">Input your WebGoat credentials here:</div>
      <div className="flex gap-4">
        <Input
          className={`mb-4 py-6 text-lg ${fieldErrors.username ? "border-red border-2" : ""}`}
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
      </div>
      <div className="flex gap-4">
        <Input
          className={`mb-4 py-6 text-lg ${fieldErrors.password ? "border-red border-2" : ""}`}
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>
      {errorMessage && (
        <div className="text-red mb-4">{errorMessage}</div>
      )}
      <div className="flex space-x-2">
        <Button className="w-1/2 rounded-md bg-slate-800 px-16 py-5 text-sm text-white hover:bg-slate-600" onClick={handleSignIn}>
          Submit
        </Button>
        <DialogClose asChild>
          <Button className="w-1/2 rounded-md bg-slate-400 px-16 py-5 text-sm text-white hover:bg-slate-300">Close</Button>
        </DialogClose>
      </div>
    </div>
  );
};

export function CourseList({ data }: { data: CourseListData[] }) {
  return (
    <div>
      <ScrollArea className="h-[calc(100vh-300px)] drop-shadow-md">
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
                <CardTitle className="text-2xl font-bold">
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
              <CardContent className="pb-2">
                {courseData.assignments.map(
                  (assignment, assignmentIndex: number) => (
                    <div
                      key={assignmentIndex}
                      className="flex items-center justify-between border-t border-gray-200 py-4"
                    >
                      <div className="flex gap-3 justify-center items-center">
                        <div className="font-semibold text-center">{assignment.name}</div>
                        <div className="flex items-center space-x-2">
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
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button className="w-32 rounded-md bg-blue px-16 py-5 text-sm text-white hover:bg-slate-300">
                              Link to Lesson
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <SubmitModal/>
                            </DialogHeader>
                          </DialogContent>
                        </Dialog>
                      </div>
                    </div>
                  )
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}

export default CourseList;
