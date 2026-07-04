import { cn } from "@/lib/utils";

type Tone = "default" | "green" | "amber" | "red" | "gold";

/** Value color per tone (redesign: only the number carries status color). */
const TONE: Record<Tone, string> = {
  default: "text-navy",
  green: "text-health-green",
  amber: "text-health-amber",
  red: "text-health-red",
  gold: "text-navy",
};

export function StatCard({
  label,
  value,
  tone = "default",
  hint,
}: {
  label: string;
  value: React.ReactNode;
  tone?: Tone;
  hint?: string;
}) {
  return (
    <div className="flex min-h-[118px] flex-col gap-2.5 rounded-lg border border-line bg-white px-5 py-[18px]">
      {/* Fixed 2-line label slot so every card's number sits on one baseline
          regardless of label wrapping. */}
      <div className="min-h-[29px] text-[11px] font-semibold uppercase leading-[1.3] tracking-[0.1em] text-muted">
        {label}
      </div>
      <div className={cn("text-[30px] font-bold leading-none tracking-[-0.02em]", TONE[tone])}>
        {value}
      </div>
      <div className="mt-auto min-h-[15px] text-[12px] font-medium text-muted-light">
        {hint}
      </div>
    </div>
  );
}
