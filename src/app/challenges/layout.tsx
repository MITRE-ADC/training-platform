import type { Metadata } from "next";
import "@/app/globals.css";
import "remixicon/fonts/remixicon.css";

export const metadata: Metadata = {
  title: "Challenges",
};

export default function ChallengeLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
