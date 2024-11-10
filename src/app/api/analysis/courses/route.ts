import { aggregateUserCoursesStatusByUser } from "@/db/queries";
import { HttpStatusCode } from "axios";
import { NextResponse } from "next/dist/server/web/spec-extension/response";

// return number of completed/in progress/not started for every user
export async function GET() {
  const data = await aggregateUserCoursesStatusByUser();

  interface Analysis {
    completed: number;
    in_progress: number;
    not_started: number;
  }
  
  interface Entry {
    user_id: number;
    analysis: Analysis;
  }

  const res: Entry[] = [];
  let lastId: number | null = null;
  data.forEach((element) => {
    if (Number(element["user_id"]) != lastId) {
      lastId = Number(element["user_id"]);
      const newEntry = {
        user_id: Number(element["user_id"]),
        analysis: {
          completed: 0,
          in_progress: 0,
          not_started: 0,
        },
      };

      switch (element["course_status"]) {
        case "Completed": {
          newEntry["analysis"]["completed"] = Number(element["count"]);
          break;
        }
        case "In Progress": {
          newEntry["analysis"]["in_progress"] = Number(element["count"]);
          break;
        }
        case "Not Started": {
          newEntry["analysis"]["not_started"] = Number(element["count"]);
          break;
        }
      }

      res.push(newEntry);
    } else {
      const entry = res[res.length - 1];

      switch (element["course_status"]) {
        case "Completed": {
          entry["analysis"]["completed"] = Number(element["count"]);
          break;
        }
        case "In Progress": {
          entry["analysis"]["in_progress"] = Number(element["count"]);
          break;
        }
        case "Not Started": {
          entry["analysis"]["not_started"] = Number(element["count"]);
          break;
        }
      }
    }
  });

  return NextResponse.json({ data: res }, { status: HttpStatusCode.Ok });
}
