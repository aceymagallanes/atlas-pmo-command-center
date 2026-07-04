import { Project } from "@/lib/types";
import { seedProjects } from "./seed";

// ============================================================================
// DATA LAYER — Repository
// ----------------------------------------------------------------------------
// The single boundary between the app and where data lives. Today it is
// browser localStorage seeded with sample projects. To move to Supabase later,
// reimplement these four functions with async Supabase queries — the store and
// UI never need to change. See docs/ARCHITECTURE.md → "Supabase-ready".
// ============================================================================

const STORAGE_KEY = "atlas.pmo.projects.v1";

function isBrowser(): boolean {
  return typeof window !== "undefined";
}

/** Load all projects. Seeds sample data on first run. */
export function loadProjects(): Project[] {
  if (!isBrowser()) return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      const seeded = seedProjects();
      saveProjects(seeded);
      return seeded;
    }
    return JSON.parse(raw) as Project[];
  } catch {
    return seedProjects();
  }
}

/** Persist the full project list. */
export function saveProjects(projects: Project[]): void {
  if (!isBrowser()) return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
}

/** Wipe stored data and re-seed with the sample portfolio. */
export function resetProjects(): Project[] {
  if (isBrowser()) window.localStorage.removeItem(STORAGE_KEY);
  const seeded = seedProjects();
  saveProjects(seeded);
  return seeded;
}
