import {
  Health,
  MilestoneStatus,
  PhaseStatus,
  RaidCategory,
  RaidImpact,
  RaidStatus,
  TaskPriority,
  TaskStatus,
} from "@/lib/types";

// Health / RAG ---------------------------------------------------------------
export const HEALTH_LABEL: Record<Health, string> = {
  green: "On Track",
  amber: "At Risk",
  red: "Off Track",
};

/** Tailwind classes for a pill background+text per health (redesign tokens). */
export const HEALTH_PILL: Record<Health, string> = {
  green: "bg-emerald-soft text-emerald",
  amber: "bg-gold-soft text-gold-text",
  red: "bg-[#F7E7E4] text-health-redtext",
};

export const HEALTH_DOT: Record<Health, string> = {
  green: "bg-health-green",
  amber: "bg-health-amberdot",
  red: "bg-health-red",
};

// Tasks ----------------------------------------------------------------------
export const TASK_STATUS_LABEL: Record<TaskStatus, string> = {
  todo: "To Do",
  in_progress: "In Progress",
  blocked: "Blocked",
  done: "Done",
};

export const TASK_STATUS_PILL: Record<TaskStatus, string> = {
  todo: "bg-surface text-muted-dark border border-line",
  in_progress: "bg-[#EAF0F6] text-[#2E5A8F] border border-[#D5E1EE]",
  blocked: "bg-[#F7E7E4] text-health-redtext border border-[#EED3CF]",
  done: "bg-emerald-soft text-emerald border border-emerald-tint",
};

export const PRIORITY_LABEL: Record<TaskPriority, string> = {
  low: "Low",
  medium: "Medium",
  high: "High",
  critical: "Critical",
};

export const PRIORITY_PILL: Record<TaskPriority, string> = {
  low: "bg-surface text-muted border border-line",
  medium: "bg-surface text-muted-dark border border-line",
  high: "bg-gold-soft text-gold-text border border-[#EAE0C2]",
  critical: "bg-[#F7E7E4] text-health-redtext border border-[#EED3CF]",
};

// Phases ---------------------------------------------------------------------
export const PHASE_STATUS_LABEL: Record<PhaseStatus, string> = {
  not_started: "Not Started",
  in_progress: "In Progress",
  complete: "Complete",
};

// Milestones -----------------------------------------------------------------
export const MILESTONE_STATUS_LABEL: Record<MilestoneStatus, string> = {
  on_track: "On Track",
  at_risk: "At Risk",
  slipped: "Slipped",
  achieved: "Achieved",
};

export const MILESTONE_PILL: Record<MilestoneStatus, string> = {
  on_track: "bg-emerald-soft text-emerald",
  at_risk: "bg-gold-soft text-gold-text",
  slipped: "bg-[#F7E7E4] text-health-redtext",
  achieved: "bg-surface text-muted-dark border border-line",
};

// RAID -----------------------------------------------------------------------
export const RAID_CATEGORY_LABEL: Record<RaidCategory, string> = {
  risk: "Risk",
  assumption: "Assumption",
  issue: "Issue",
  dependency: "Dependency",
};

export const RAID_CATEGORY_PILL: Record<RaidCategory, string> = {
  risk: "bg-[#F7E7E4] text-health-redtext border border-[#EED3CF]",
  assumption: "bg-[#EAF0F6] text-[#2E5A8F] border border-[#D5E1EE]",
  issue: "bg-gold-soft text-gold-text border border-[#EAE0C2]",
  dependency: "bg-[#EFEAF6] text-[#5B4A8A] border border-[#DFD6EE]",
};

export const RAID_IMPACT_LABEL: Record<RaidImpact, string> = {
  low: "Low",
  medium: "Medium",
  high: "High",
  critical: "Critical",
};

export const RAID_IMPACT_PILL: Record<RaidImpact, string> = {
  low: "bg-surface text-muted border border-line",
  medium: "bg-surface text-muted-dark border border-line",
  high: "bg-gold-soft text-gold-text border border-[#EAE0C2]",
  critical: "bg-[#F7E7E4] text-health-redtext border border-[#EED3CF]",
};

export const RAID_STATUS_LABEL: Record<RaidStatus, string> = {
  open: "Open",
  monitoring: "Monitoring",
  mitigating: "Mitigating",
  closed: "Closed",
};
