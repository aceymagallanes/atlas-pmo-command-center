import { cn } from "@/lib/utils";

/* Redesign card: 14px radius, warm #E9E4DB border, flat (no shadow), airy padding. */
export function Card({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={cn("rounded-lg border border-line bg-white", className)}>
      {children}
    </div>
  );
}

export function CardHeader({
  title,
  subtitle,
  action,
  icon,
}: {
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  action?: React.ReactNode;
  icon?: React.ReactNode;
}) {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-line-soft px-6 pb-4 pt-6">
      <div className="flex items-center gap-3">
        {icon && (
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px] bg-emerald-soft text-emerald">
            {icon}
          </span>
        )}
        <div className="min-w-0">
          <h3 className="text-[15px] font-bold leading-snug text-navy">
            {title}
          </h3>
          {subtitle && (
            <p className="mt-0.5 text-[12.5px] leading-snug text-muted">{subtitle}</p>
          )}
        </div>
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}

export function CardBody({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  // Non-responsive default so an override like `p-0` (used for full-width
  // lists/tables) can cleanly win via tailwind-merge in cn().
  return <div className={cn("p-6", className)}>{children}</div>;
}
