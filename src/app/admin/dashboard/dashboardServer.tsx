// "use server"

import axios from "axios";
import { req } from "@/lib/utils";

export async function updateUser(id: string, email: string, name: string) {
  await axios.post(
    req("api/users/" + id),
    {
      name: name,
      email: email,
    },
    { params: { id: id } }
  );
}

export async function assignCourse(user_id: string, course_id: string) {
  const d = new Date();
  d.setMonth(d.getMonth() + 1);

  await axios
    .post(req("api/user_courses"), {
      user_id: user_id,
      course_id: course_id,
      assigned_date: new Date(),
      due_date: d,
    })
    .catch((e) => console.log(e.data));
}

export async function assignAssignments(
  user_id: string,
  assignment_id: string
) {
  await axios
    .post(req("api/user_assignments"), {
      user_id: user_id,
      assignment_id: assignment_id,
    })
    .catch((e) => console.log(e.data));
}

export async function deleteCourse(user_id: string, course_id: string) {
  await axios
    .delete(req("api/user_courses/" + user_id), {
      params: { id: user_id },
      data: { course_id: course_id },
    })
    .catch((e) => console.log(e.data));
}

export async function deleteAssignment(user_id: string, assignment_id: string) {
  await axios
    .delete(req("api/user_assignments/" + user_id), {
      params: { id: user_id },
      data: { assignment_id: assignment_id },
    })
    .catch((e) => console.log(e.data));
}

export async function updateCourseDueDate(
  user_id: string,
  course_id: string,
  due_date: Date
) {
  await axios
    .put(req("api/user_courses/" + user_id), {
      params: { id: user_id },
      course_id: course_id,
      due_date: due_date,
    })
    .catch((e) => console.log(e.data));
}
