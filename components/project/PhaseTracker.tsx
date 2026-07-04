import { Check } from "lucide-react";
import { Phase } from "@/lib/types";
import { cn } from "@/lib/utils";
import { PHASE_STATUS_LABEL } from "@/lib/labels";

export function PhaseTracker({ phases }: { phases: Phase[] }) {
  const ordered = [...phases].sort((a, b) => a.order - b.order);
  return (
    <div className="flex flex-wrap gap-2">
      {ordered.map((p) => (
        <div
          key={p.id}
          className={cn(
            "flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-medium",
            p.status === "complete" && "border-emerald-tint bg-emerald-soft text-emerald-deep",
            p.status === "in_progress" && "border-navy bg-navy text-white",
            p.status === "not_started" && "border-line bg-white text-muted",
          )}
        >
          {p.status === "complete" && <Check size={13} />}
          {p.name}
          <span className="opacity-60">· {PHASE_STATUS_LABEL[p.status]}</span>
        </div>
      ))}
    </div>
  );
}
