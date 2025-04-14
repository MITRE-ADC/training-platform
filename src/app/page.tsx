"use client";
import { redirect } from "next/navigation";

const NotFoundPage = () => {
  return redirect("/signin");
};

export default NotFoundPage;
