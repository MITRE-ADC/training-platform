import { employee } from "@/app/admin/dashboard/employeeDefinitions";
import {
  Assignment,
  Course,
  User,
  User_Assignment,
  User_Course,
} from "@/db/schema";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function uuid() {
  return crypto.getRandomValues(new Uint32Array(1))[0].toString();
}

export function req(req: string) {
  if (req.startsWith("/")) req = req.substring(1);
  return process.env.NEXT_PUBLIC_DOMAIN + req;
}
