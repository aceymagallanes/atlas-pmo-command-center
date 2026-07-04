import { Phase, ProjectType } from "@/lib/types";
import { uid } from "@/lib/utils";

// A pragmatic phase model per delivery type. The first phase is marked
// in_progress so a freshly created project has a sensible "current phase".
const PHASE_TEMPLATES: Record<ProjectType, string[]> = {
  "AI Automation": [
    "Discovery & Use-Case Definition",
    "Solution Design",
    "Build & Prompt Engineering",
    "Testing & Validation",
    "Deployment & Handover",
  ],
  "CRM Automation": [
    "Discovery & Process Mapping",
    "CRM Configuration Design",
    "Build & Integration",
    "Data Migration & UAT",
    "Go-Live & Adoption",
  ],
  "Reporting Automation": [
    "Requirements & Data Sources",
    "Data Modelling",
    "Report Build",
    "Validation & Sign-off",
    "Rollout & Training",
  ],
  "Dashboard Implementation": [
    "Discovery & KPI Definition",
    "Data Integration",
    "Dashboard Build",
    "UAT & Refinement",
    "Launch & Enablement",
  ],
  "Business Process Improvement": [
    "Define & Baseline",
    "Measure & Analyze",
    "Improve & Redesign",
    "Pilot & Validate",
    "Control & Sustain",
  ],
  "Software Implementation": [
    "Discovery & Requirements",
    "Solution Design",
    "Configuration & Build",
    "Testing & UAT",
    "Deployment & Hypercare",
  ],
};

export function generatePhases(type: ProjectType): Phase[] {
  const names = PHASE_TEMPLATES[type];
  return names.map((name, i) => ({
    id: uid("phase"),
    name,
    order: i,
    status: i === 0 ? "in_progress" : "not_started",
  }));
}
