"use server"

import axios from "axios";
import { MountStatus, employeeOverview } from "./employeeDefinitions";
import { Dispatch, SetStateAction } from "react";
import { User } from "@/db/schema";
import { req } from "@/lib/utils";

export async function updateUser(id: string, email: string, name: string) {
    return;
    console.log("received", id, email, name);
    // TODO replace with id get
    axios.get(req('api/users')).then((u) => {
        const users: User[] = u.data.data;
        const user = users.find((x) => x.id == id);

        if (!user) return;

        axios.post(req('api/users/[id]'), {
            user_id: id,
            name: name,
            email: email,
            pass: user?.pass
        }).then((e) => console.log(e.data)).catch(console.log);
    })
}

export async function assignCourse(user_id: string, course_id: string) {
    const d = new Date();

    axios.post(req('api/user_courses'), {
        user_id: user_id,
        course_id: course_id,
        assigned_date: new Date().toISOString(),
        due_date: new Date(d.setMonth(d.getMonth() + 1)).toISOString(),
    }).catch((e) => console.log(e.data));
}

export async function assignAssignments(user_id: string, assignment_id: string) {
    axios.post(req('api/user_assignments'), {
        user_id: user_id,
        assignment_id: assignment_id,
    }).catch((e) => console.log(e.data));
}
