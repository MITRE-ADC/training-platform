import type { Metadata } from "next";
import "@/app/globals.css";
import "remixicon/fonts/remixicon.css";
import { getCurrentUser } from '@/lib/auth-middleware';
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Dashboard",
};

const admin_id = "admin@mitre.com";

export default async function DashboardLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {

  const user = await getCurrentUser(cookies() as any);

  // const resp = await fetch('/api/auth/usercheck', {
  //   method: "GET"
  // });

  // fudgy solution
  if(!user || !user.user || user.user.email != admin_id) {
    redirect("/signin");
  }




  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
