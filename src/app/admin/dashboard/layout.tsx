import type { Metadata } from "next";
import { RequestCookies } from "next/dist/compiled/@edge-runtime/cookies";
import "@/app/globals.css";
import "remixicon/fonts/remixicon.css";
import { getCurrentUserAndAdmin } from "@/lib/auth-middleware";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Dashboard",
};

const admin_email = "admin@mitre.com";

export default async function DashboardLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const readonlyCookies = await cookies();
  const headers = new Headers();

  readonlyCookies.getAll().forEach(({ name, value }) => {
    headers.append("cookie", `${name}=${value}`);
  });

  const user = await getCurrentUserAndAdmin(new RequestCookies(headers));

  if (!user || !user.user || user.user.email != admin_email) {
    if (user.isAdmin) {
      redirect("/challenges");
    }
    redirect("/signin");
  }

  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
