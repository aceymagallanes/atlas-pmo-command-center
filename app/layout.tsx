import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AppShell } from "@/components/shell/AppShell";

// One professional UI typeface across the entire app.
const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Atlas PMO Command Center",
  description:
    "AI-powered project management command center for PMs, program managers and PMO leads. Multi-project portfolio visibility, RAID tracking, meeting-notes intelligence and executive status reporting.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="min-h-screen bg-offwhite text-ink antialiased">
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
