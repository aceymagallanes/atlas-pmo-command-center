import { cn } from "@/lib/utils";

export function LoadingBlock({ label = "Loading workspace…" }: { label?: string }) {
  return (
    <div className="flex min-h-[40vh] flex-col items-center justify-center gap-3 text-muted">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-line border-t-emerald" />
      <p className="text-sm">{label}</p>
    </div>
  );
}

export function EmptyState({
  icon,
  title,
  description,
  action,
  className,
}: {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-3 rounded-lg border border-dashed border-line bg-white/60 px-6 py-12 text-center",
        className,
      )}
    >
      {icon && (
        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-soft text-emerald">
          {icon}
        </span>
      )}
      <h3 className="font-head text-lg font-semibold text-navy">{title}</h3>
      {description && <p className="max-w-sm text-sm text-muted">{description}</p>}
      {action}
    </div>
  );
}
