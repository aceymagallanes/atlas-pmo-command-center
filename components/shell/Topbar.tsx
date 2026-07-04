"use client";

import Link from "next/link";
import { Plus, Search } from "lucide-react";
import { Button } from "@/components/ui/Button";

export function Topbar() {
  return (
    <header className="sticky top-0 z-20 flex h-16 shrink-0 items-center gap-4 border-b border-line bg-white px-5 sm:px-8">
      {/* Mobile brand (sidebar hidden) */}
      <div className="flex items-center gap-2.5 lg:hidden">
        <span className="flex h-8 w-8 items-center justify-center rounded-[9px] bg-grad-gold text-[14px] font-bold text-navy">
          A
        </span>
        <span className="text-[14.5px] font-bold tracking-[-0.01em] text-navy">
          Atlas PMO
        </span>
      </div>

      {/* Search */}
      <div className="hidden h-[38px] max-w-[520px] flex-1 items-center gap-2.5 rounded-[10px] border border-line bg-offwhite px-3.5 text-muted md:flex">
        <Search size={14} className="shrink-0 text-muted-light" />
        <span className="truncate text-[13px]">Search projects, risks, tasks…</span>
        <kbd className="ml-auto shrink-0 rounded-[5px] border border-line-input bg-white px-1.5 py-0.5 text-[11px] font-semibold text-muted-light">
          ⌘K
        </kbd>
      </div>

      <div className="ml-auto flex items-center gap-3">
        <Link href="/projects/new">
          <Button size="sm">
            <Plus size={16} strokeWidth={2.5} /> New Project
          </Button>
        </Link>
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-navy text-[12px] font-semibold text-white">
          PM
        </div>
      </div>
    </header>
  );
}
