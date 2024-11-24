"use server"

import { req } from "@/lib/utils";
import axios from "axios";
import { Course } from "./courseDefinitions";

export async function getAssignmentDataTest(): Promise<Course[]> {
    try {
      const authResponse = await axios.get(req("api/auth"));
      const id = authResponse.data.user.id;
  
      console.log("User ID:", id);
      const assignmentsResponse = await axios.get(req("api/user_assignments"), {
        params: { userId: id },
      });
      const assignments: Course[] = assignmentsResponse.data; 
      console.log("Assignments:", assignments);
      return assignments;
    } catch (error) {
      console.error("Error fetching assignment data:", error);
      return [];
    }
  }