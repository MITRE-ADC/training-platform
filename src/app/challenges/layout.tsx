import type { Metadata } from "next";
import "@/app/globals.css";
import "remixicon/fonts/remixicon.css";
import { getCurrentUser } from "@/lib/auth-middleware";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { RequestCookies } from "next/dist/compiled/@edge-runtime/cookies";

export const metadata: Metadata = {
  title: "Challenges",
};

export default async function ChallengeLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const readonlyCookies = cookies();
  const headers = new Headers();

  readonlyCookies.getAll().forEach(({ name, value }) => {
    headers.append("cookie", `${name}=${value}`);
  });

  const user = await getCurrentUser(new RequestCookies(headers));

  if (!user || !user.user) {
    if (user && user.user) {
      redirect("/signin");
    }
  }
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
