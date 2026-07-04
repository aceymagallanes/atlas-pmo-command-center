export function PageHeader({
  eyebrow,
  title,
  description,
  action,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div className="flex min-w-0 flex-col gap-2">
        {eyebrow && (
          <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-emerald">
            {eyebrow}
          </p>
        )}
        <h1 className="text-[26px] font-bold leading-[1.15] tracking-[-0.02em] text-navy sm:text-[28px]">
          {title}
        </h1>
        {description && (
          <p className="max-w-[560px] text-[14px] leading-[1.6] text-muted-dark">
            {description}
          </p>
        )}
      </div>
      {action && <div className="shrink-0 pb-1">{action}</div>}
    </div>
  );
}
