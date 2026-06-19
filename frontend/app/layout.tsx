import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "tinyChanges - Task Management for Families",
  description: "Help your children stay organized with tasks, rewards, and achievements.",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-slate-50 dark:bg-slate-950">
        {children}
      </body>
    </html>
  );
}
