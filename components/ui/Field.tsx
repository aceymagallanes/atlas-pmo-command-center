import { cn } from "@/lib/utils";

export function Field({
  label,
  hint,
  required,
  error,
  children,
}: {
  label: string;
  hint?: string;
  required?: boolean;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-[7px] flex items-center gap-1 text-[12.5px] font-semibold text-navy">
        {label}
        {required && <span className="text-health-red">*</span>}
      </span>
      {children}
      {hint && !error && <span className="mt-1 block text-xs text-muted">{hint}</span>}
      {error && <span className="mt-1 block text-xs text-health-red">{error}</span>}
    </label>
  );
}

const base =
  "w-full rounded-[10px] border border-line-input bg-surface px-3.5 py-2.5 text-[13.5px] text-ink " +
  "outline-none transition-colors placeholder:text-muted-light focus:border-emerald focus:bg-white " +
  "focus:ring-2 focus:ring-emerald/15";

export function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={cn(base, props.className)} />;
}

export function Textarea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea {...props} className={cn(base, "min-h-[96px] resize-y", props.className)} />;
}

export function Select(props: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return <select {...props} className={cn(base, "appearance-none pr-9", props.className)} />;
}
