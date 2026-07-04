"use client";

import { useEffect } from "react";
import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";
import { useStore } from "@/lib/store";

export function AppShell({ children }: { children: React.ReactNode }) {
  const hydrate = useStore((s) => s.hydrate);

  // Load projects from the repository (localStorage) once, on the client.
  useEffect(() => {
    hydrate();
  }, [hydrate]);

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar />
        <main className="mx-auto w-full max-w-[1304px] flex-1 px-5 pb-16 pt-7 sm:px-8 sm:pt-10">
          {children}
        </main>
      </div>
    </div>
  );
}
