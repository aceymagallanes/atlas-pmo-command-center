import { Health } from "@/lib/types";
import { HEALTH_DOT, HEALTH_LABEL, HEALTH_PILL } from "@/lib/labels";
import { cn } from "@/lib/utils";

/** Generic pill. Pass the color classes via `className`. */
export function Pill({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-[9px] py-[3px] text-[11px] font-semibold leading-[1.4]",
        className,
      )}
    >
      {children}
    </span>
  );
}

/** RAG health badge with a status dot. */
export function HealthBadge({ health, className }: { health: Health; className?: string }) {
  return (
    <Pill className={cn(HEALTH_PILL[health], className)}>
      <span className={cn("h-1.5 w-1.5 rounded-full", HEALTH_DOT[health])} />
      {HEALTH_LABEL[health]}
    </Pill>
  );
}
