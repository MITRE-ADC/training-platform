import { NextRequest, NextResponse } from "next/server";
import { HttpStatusCode } from "axios";
import { login_user, logout_user, URL_webgoat_lessonmenu } from "../util";
import {
  error,
  processCreateAssignment,
  processCreateCourse,
  processLinkAssignment,
} from "../../util";
import {
  assignmentWebgoatIdExists,
  courseNameExists,
  getAssignmentByWebgoatId,
  getCompleteUser,
  getCompleteUserByName,
  getCourseByName,
  getUserAssignmentByWebgoatId,
  getUserByName,
  updateUserAssignment,
  userAssignmentWebgoatIdExists,
  userNameExists,
} from "@/db/queries";
import { CHECK_UNAUTHORIZED, CHECK_UNAUTHORIZED_BY_UID } from "../../auth";

// export const autopopulate_courses_from_webgoat = true;
// export const assign_all_assignments_in_webgoat = true;

/**
 * Updates data in the DB for a user's progress
 * @param request
 * @returns
 */
export async function POST(request: NextRequest) {
  try {
    console.log("rithvik is cool");
    let user_id = request.nextUrl.searchParams?.get("user_id");
    if (!user_id) user_id = (await request.json()).user_id;
    if (!user_id) return error("Please provide a user_id query parameter");
    const err = await CHECK_UNAUTHORIZED_BY_UID(user_id);
    if (err) return err;
    const user = await getCompleteUser(user_id);
    if (user instanceof NextResponse) return user;

    // const autopopulate_courses_from_webgoat = request.nextUrl.searchParams?.get(
    //   "autopopulate_courses"
    // );
    const autopopulate_courses_from_webgoat = true;
    // console.log("autopopulate_courses_from_webgoat: ", autopopulate_courses_from_webgoat);
    // autopopulate_courses_from_webgoat = true;
    const assign_all_assignments_in_webgoat =
      request.nextUrl.searchParams?.get("assign_all");

    const { cookie, response } = await login_user(
      user.webgoatusername,
      user.webgoatpassword
    );
    console.log(cookie);
    if (response) return response;
    const response2 = await fetch(URL_webgoat_lessonmenu, {
      method: "POST",
      redirect: "follow",
      headers: {
        "Content-Type": "application/application-json",
        Cookie: cookie,
      },
    });
    let changes = 0;
    let assignment_linkages = 0;
    let assignment_creations = 0;
    let course_creations = 0;

    const courses = await response2.json();
    console.log(courses);
    for (const course in courses) {
      // UPDATE COURSE RECORD
      if (
        autopopulate_courses_from_webgoat &&
        !(await courseNameExists(courses[course].name))
      ) {
        console.log("entered processCreateCourse");
        const res = await processCreateCourse(courses[course].name);
        if (res.status != HttpStatusCode.Created) {
          console.error(res);
          return res;
        }
        console.log(
          `\t[AUTOPOPULATE] CREATE: "${courses[course].name}" not previously present in DB, added`
        );
        course_creations++;
      }
      const course_id = autopopulate_courses_from_webgoat
        ? (await getCourseByName(courses[course].name)).course_id
        : 1;
      for (const assignment in courses[course].children) {
        // UDPATE ASSIGNMENT RECORD
        const webgoat_name: string = courses[course].children[assignment].name;
        const complete: boolean = courses[course].children[assignment].complete;

        if (!(await assignmentWebgoatIdExists(webgoat_name))) {
          const res = await processCreateAssignment(
            webgoat_name,
            webgoat_name,
            course_id
          ); // assignment is created with webgoat_name as name as well as id by default
          if (res.status != HttpStatusCode.Created) {
            console.error(res);
            return res;
          }
          console.log(
            `\tCREATE: "${webgoat_name}" not previously present in DB, added`
          );
          assignment_creations++;
        }
        const resp = await getAssignmentByWebgoatId(webgoat_name);
        if (resp instanceof NextResponse) return resp;
        const assignment_id = resp.assignment_id;
        if (
          assign_all_assignments_in_webgoat &&
          !(await userAssignmentWebgoatIdExists(user_id, webgoat_name))
        ) {
          const res = await processLinkAssignment(user_id, assignment_id);
          if (res.status != HttpStatusCode.Created) {
            console.error(res);
            return res;
          }

          console.log(
            `\t[AUTOASSIGN] LINK: "${webgoat_name}" not previously assigned to user ${user_id}, assigned`
          );
          assignment_linkages++;
        }

        // const assignmentObj = await getAssignmentByWebgoatId(webgoat_name);
        const user_assignment = await getUserAssignmentByWebgoatId(
          user_id,
          webgoat_name
        );
        if (user_assignment instanceof NextResponse) return user_assignment;

        if (user_assignment && complete != user_assignment.completed) {
          const response = await updateUserAssignment(
            user_assignment.user_id,
            user_assignment.assignment_id,
            complete
          );

          if (response instanceof NextResponse) return response;

          changes++;
        }
      }
    }

    const res = await logout_user();
    if (res.status != HttpStatusCode.Ok)
      return error(
        `Error while logging user out: ${res.statusText}`,
        HttpStatusCode.InternalServerError
      );

    return NextResponse.json({
      message: `Updated all user assignment statuses associated with user ${user_id}. \n${changes} assignments changed state\n${assignment_linkages} assignments assigned to user\n\n${course_creations} courses autolinked to assignments based on WebGoat records\n${assignment_creations} assignments autocreated based on WebGoat records`,
    });
  } catch (ex) {
    return error(`${ex}`);
  }
}
