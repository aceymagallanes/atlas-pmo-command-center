import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/** Class combiner that also resolves conflicting Tailwind classes,
 *  so a passed-in override (e.g. `p-0`) wins over a component default. */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Short unique id — good enough for a client-side MVP. */
export function uid(prefix = "id"): string {
  return `${prefix}_${Math.random().toString(36).slice(2, 9)}${Date.now()
    .toString(36)
    .slice(-4)}`;
}

export function todayISO(): string {
  return new Date().toISOString().slice(0, 10);
}

export function addDays(dateISO: string, days: number): string {
  const d = new Date(dateISO + "T00:00:00");
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}

export function daysBetween(fromISO: string, toISO: string): number {
  const a = new Date(fromISO + "T00:00:00").getTime();
  const b = new Date(toISO + "T00:00:00").getTime();
  return Math.round((b - a) / 86_400_000);
}

/** True when an ISO date is strictly before today. */
export function isOverdue(dateISO?: string): boolean {
  if (!dateISO) return false;
  return dateISO < todayISO();
}

export function formatDate(dateISO?: string): string {
  if (!dateISO) return "—";
  return new Date(dateISO + "T00:00:00").toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function formatShort(dateISO?: string): string {
  if (!dateISO) return "—";
  return new Date(dateISO + "T00:00:00").toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

/** Monday of the current week, ISO. */
export function mondayOfThisWeek(): string {
  const d = new Date();
  const day = d.getDay(); // 0 Sun .. 6 Sat
  const diff = (day === 0 ? -6 : 1) - day;
  d.setDate(d.getDate() + diff);
  return d.toISOString().slice(0, 10);
}
