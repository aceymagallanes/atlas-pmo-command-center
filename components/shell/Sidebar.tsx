"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/", label: "Home Dashboard", exact: true },
  { href: "/portfolio", label: "Portfolio" },
  { href: "/projects/new", label: "Start New Project" },
  { href: "/settings", label: "Settings" },
];

const TOOLS = [
  { href: "/raid", label: "RAID Log" },
  { href: "/reports", label: "Status Reports" },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="sticky top-0 hidden h-screen w-[248px] shrink-0 flex-col border-r border-navy-border bg-navy-deep text-white lg:flex">
      {/* Brand */}
      <div className="flex items-center gap-3 px-5 pb-[18px] pt-5">
        <div className="flex h-[34px] w-[34px] items-center justify-center rounded-[9px] bg-grad-gold text-[15px] font-bold text-navy">
          A
        </div>
        <div className="flex flex-col gap-px">
          <div className="text-[14.5px] font-bold tracking-[-0.01em] text-[#F3F1EC]">
            Atlas PMO
          </div>
          <div className="text-[10px] font-semibold tracking-[0.12em] text-[#6C8199]">
            COMMAND CENTER
          </div>
        </div>
      </div>

      {/* Workspace nav */}
      <nav className="flex flex-col gap-0.5 px-3 py-2">
        <div className="px-3 pb-1.5 pt-2 text-[10.5px] font-semibold tracking-[0.12em] text-[#6C8199]">
          WORKSPACE
        </div>
        {NAV.map((item) => {
          const active = item.exact
            ? pathname === item.href
            : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-2.5 rounded-[8px] px-3 py-[9px] text-[13.5px] transition-colors",
                active
                  ? "bg-navy-active font-semibold text-white"
                  : "font-medium text-[#B8C4D2] hover:bg-white/[0.06] hover:text-white",
              )}
            >
              <span
                className={cn(
                  "h-1.5 w-1.5 shrink-0 rounded-[2px]",
                  active ? "bg-emerald" : "bg-[#33465C]",
                )}
              />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Portfolio tools */}
      <nav className="flex flex-col gap-0.5 px-3 py-3">
        <div className="px-3 pb-1.5 pt-2 text-[10.5px] font-semibold tracking-[0.12em] text-[#6C8199]">
          PORTFOLIO TOOLS
        </div>
        {TOOLS.map((item) => {
          const active = pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-2.5 rounded-[8px] px-3 py-[9px] text-[13.5px] transition-colors",
                active
                  ? "bg-navy-active font-semibold text-white"
                  : "font-medium text-[#B8C4D2] hover:bg-white/[0.06] hover:text-white",
              )}
            >
              <span
                className={cn(
                  "h-1.5 w-1.5 shrink-0 rounded-full",
                  active ? "bg-emerald" : "bg-[#33465C]",
                )}
              />
              <span>{item.label}</span>
            </Link>
          );
        })}
        <p className="px-3 pt-2.5 text-[12px] leading-[1.55] text-[#6C8199]">
          Portfolio-wide views. Open any project for its own tasks, RAID log,
          notes and reports.
        </p>
      </nav>

      {/* User footer */}
      <div className="mt-auto flex items-center gap-2.5 border-t border-navy-border px-5 py-4">
        <div className="flex h-[30px] w-[30px] items-center justify-center rounded-full bg-emerald text-[11px] font-semibold text-white">
          PM
        </div>
        <div className="flex flex-col">
          <div className="text-[12.5px] font-semibold text-[#F3F1EC]">
            Acey Magallanes
          </div>
          <div className="text-[11px] text-[#6C8199]">PMO Lead</div>
        </div>
      </div>
    </aside>
  );
}
