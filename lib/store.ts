import { create } from "zustand";
import {
  MeetingNote,
  NewProjectInput,
  Project,
  RaidItem,
  StatusReport,
  Task,
} from "@/lib/types";
import { createProjectFromInput } from "@/lib/generators/project";
import { loadProjects, resetProjects, saveProjects } from "@/lib/data/repository";

interface StoreState {
  projects: Project[];
  hydrated: boolean;

  hydrate: () => void;
  reset: () => void;

  addProject: (input: NewProjectInput) => Project;
  updateProject: (id: string, updater: (p: Project) => Project) => void;

  // Convenience mutations scoped to a project.
  addTask: (projectId: string, task: Task) => void;
  updateTask: (projectId: string, taskId: string, patch: Partial<Task>) => void;
  addRaid: (projectId: string, item: RaidItem) => void;
  updateRaid: (projectId: string, raidId: string, patch: Partial<RaidItem>) => void;
  addMeetingNote: (projectId: string, note: MeetingNote) => void;
  addStatusReport: (projectId: string, report: StatusReport) => void;
}

function persist(projects: Project[]): Project[] {
  saveProjects(projects);
  return projects;
}

export const useStore = create<StoreState>((set, get) => ({
  projects: [],
  hydrated: false,

  hydrate: () => {
    if (get().hydrated) return;
    set({ projects: loadProjects(), hydrated: true });
  },

  reset: () => set({ projects: resetProjects(), hydrated: true }),

  addProject: (input) => {
    const project = createProjectFromInput(input);
    set((s) => ({ projects: persist([project, ...s.projects]) }));
    return project;
  },

  updateProject: (id, updater) =>
    set((s) => ({
      projects: persist(s.projects.map((p) => (p.id === id ? updater(p) : p))),
    })),

  addTask: (projectId, task) =>
    get().updateProject(projectId, (p) => ({ ...p, tasks: [task, ...p.tasks] })),

  updateTask: (projectId, taskId, patch) =>
    get().updateProject(projectId, (p) => ({
      ...p,
      tasks: p.tasks.map((t) => (t.id === taskId ? { ...t, ...patch } : t)),
    })),

  addRaid: (projectId, item) =>
    get().updateProject(projectId, (p) => ({ ...p, raid: [item, ...p.raid] })),

  updateRaid: (projectId, raidId, patch) =>
    get().updateProject(projectId, (p) => ({
      ...p,
      raid: p.raid.map((r) => (r.id === raidId ? { ...r, ...patch } : r)),
    })),

  addMeetingNote: (projectId, note) =>
    get().updateProject(projectId, (p) => ({
      ...p,
      meetingNotes: [note, ...p.meetingNotes],
    })),

  addStatusReport: (projectId, report) =>
    get().updateProject(projectId, (p) => ({
      ...p,
      statusReports: [report, ...p.statusReports],
    })),
}));
