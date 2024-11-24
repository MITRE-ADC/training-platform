import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { _DATA, Course, courseAssignment } from "./courseDefinitions";
import { Checkbox } from "@/components/ui/checkbox";
import "remixicon/fonts/remixicon.css";

const SubmitModal = ({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [honorPledge, setHonorPledge] = useState(false);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      setFile(files[0]);
    }
  };

  const handleCheckboxChange = (checked: "indeterminate" | boolean) => {
    setHonorPledge(checked === true);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/20">
      <Card className="w-[480px]">
        <CardHeader className="pb-2">
          <CardTitle>File Upload</CardTitle>
          <p className="text-sm text-muted-foreground">
            Ready to submit? Attach your screenshots here!
          </p>
        </CardHeader>
        <CardContent>
          <div className="mb-4 rounded-lg border-2 border-dashed border-gray-200 p-8">
            <label
              htmlFor="file-upload"
              className="flex w-full cursor-pointer flex-col items-center"
            >
              <i className="ri-upload-cloud-2-line mb-2 text-4xl text-gray-400"></i>
              <span className="text-sm text-gray-500">
                Upload .pdf, .jpeg, and .png files only
              </span>
              <input
                id="file-upload"
                type="file"
                accept=".pdf,.jpeg,.jpg,.png"
                className="hidden"
                onChange={handleFileChange}
              />
            </label>
          </div>
          <div className="mb-6">
            <div className="flex items-start space-x-2">
              <Checkbox
                id="honorPledge"
                checked={honorPledge}
                onCheckedChange={handleCheckboxChange}
                className="mt-1"
              />
              <div>
                <label
                  htmlFor="honorPledge"
                  className="cursor-pointer font-medium"
                >
                  Accept honor pledge
                </label>
                <p className="text-sm text-muted-foreground">
                  This is my original work.
                </p>
              </div>
            </div>
          </div>
          <div className="flex space-x-2">
            <Button
              className="w-1/2 rounded-md bg-slate-800 px-16 py-5 text-sm text-white hover:bg-slate-100"
              disabled={!file || !honorPledge}
            >
              Submit
            </Button>
            <Button
              onClick={onClose}
              className="w-1/2 rounded-md bg-slate-400 px-16 py-5 text-sm text-white hover:bg-slate-100"
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

  return (
    <div id="card-container" className="space-y-4">
      {_DATA.map((courseData: Course, courseIndex: number) => (
        <Card
          key={courseIndex}
          id={
            courseData.course +
            courseData.assignments.map((element) => element.name).join()
          }
          className="w-full p-4 shadow-md"
        >
          <CardHeader className="mb-0 pb-0">
            <CardTitle className="mb-4 pb-0 text-2xl font-bold">
              {courseData.course}
            </CardTitle>
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
                    <div className="mt-2 flex flex-col space-y-1 text-gray-500">
                      <div className="flex items-center space-x-1">
                        <i className="ri-calendar-2-line"></i>
                        <span>Assigned: {assignment.assigned}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <i className="ri-calendar-schedule-line"></i>
                        <span>Due: {assignment.due || "No due date"}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col items-end space-y-2">
                    <Button className="w-32 rounded-md bg-blue px-16 py-5 text-sm text-white hover:bg-slate-100">
                      Link to Lesson
                    </Button>
                    <Button
                      className={`w-32 rounded-md px-16 py-5 text-sm ${
                        assignment.status === "done"
                          ? "cursor-not-allowed bg-slate-400 text-white"
                          : "bg-slate-800 text-white hover:bg-slate-100"
                      }`}
                      disabled={assignment.status === "done"}
                      onClick={openModal}
                    >
                      {assignment.status === "done" ? "Submitted" : "Submit"}
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
