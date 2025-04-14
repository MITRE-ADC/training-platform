import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import "remixicon/fonts/remixicon.css";
import { Input } from "@/components/ui/input";
import { CourseListData } from "./courseDefinitions";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { DialogClose, DialogTrigger } from "@radix-ui/react-dialog";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { ScrollArea } from "@/components/ui/scroll-area";
import axios from "axios";
import { req } from "@/lib/utils";
import {
  updateWebgoatUserCredentials,
  updateWebgoatUserCredentialsAndData,
} from "./courseServer";
import { User } from "@/db/schema";

export function WebGoatCredentialPopup ({
  user,
} : {
  user: User;
}) {

  function openWG(){
    const url = `http://localhost:8090/WebGoat/login`;
    window.open(url);
  }

  return (
    <div>
      <VisuallyHidden>
        <DialogDescription>WebGoat Credentials</DialogDescription>
      </VisuallyHidden>
      <DialogTitle>WebGoat Credentials</DialogTitle>
      <div className="pb-2 text-sm text-muted-foreground">
      </div>
      <div className="pb-2 flex space-x-2">
        <Button onClick={() => openWG()}>
          To access WebGoat, click here
        </Button>
      </div>
      <div className="mb-4">
      <label className="text-sm font-medium text-foreground">Username</label>
      <div className="mt-1 rounded-md bg-gray-100 px-4 py-3 text-lg text-foreground">
        <code>{user.webgoatusername}</code>
      </div>
    </div>

    <div className="mb-4">
      <label className="text-sm font-medium text-foreground">Password</label>
      <div className="mt-1 rounded-md bg-gray-100 px-4 py-3 text-lg text-foreground">
        <code>{user.webgoatpassword}</code>
      </div>
    </div>

    <div className="flex space-x-2">
      <DialogClose asChild>
        <Button className="w-full rounded-md bg-slate-800 px-16 py-5 text-sm text-white hover:bg-slate-600">
          Close
        </Button>
      </DialogClose>
    </div>
  </div>
  );
}

export function CourseList({
  data,
  user,
}: {
  data: CourseListData[];
  user: User;
}) {
  const [credentialsOpen, setCredentialsOpen] = useState(false);

  function linkToLesson(assignment_index: number) {
    const username = user.webgoatusername;

    // data holds all the assignments for the course assigned, which is why this filtering is needed
    const assignment_link =
      data[0]["assignments"][assignment_index]["webgoat_link"];
    const url = `http://localhost:8090/WebGoat/start.mvc?username=${username}${assignment_link}`;
    window.open(url);
  }

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
                      <div className="flex items-center justify-center gap-3">
                        <div className="text-center font-semibold">
                          {assignment.name}
                        </div>
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
                        <Button
                          onClick={() => linkToLesson(assignmentIndex)}
                          className="w-32 rounded-md bg-blue px-16 py-5 text-sm text-white hover:bg-slate-300"
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
        </div>
      </ScrollArea>
    </div>
  );
}

export default CourseList;
