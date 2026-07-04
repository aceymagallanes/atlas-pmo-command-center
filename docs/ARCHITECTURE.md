# Architecture

Atlas PMO Command Center is a **client-rendered Next.js 14 application** built in four clean layers. The guiding principle: **the UI depends only on stable interfaces (types), never on where data or intelligence comes from.** That is what makes the app "Supabase-ready" and "AI-ready" without a rewrite.

```
┌─────────────────────────────────────────────────────────────┐
│  UI LAYER            app/*  ·  components/*                   │  what the PM sees
│  Pages + presentational components. Read/write only via the  │
│  store and typed domain objects.                             │
├─────────────────────────────────────────────────────────────┤
│  STATE               lib/store.ts  (Zustand)                 │  one source of truth
│  Holds projects in memory; every mutation is persisted       │
│  through the repository.                                     │
├─────────────────────────────────────────────────────────────┤
│  DATA LAYER          lib/data/repository.ts                  │  ← Supabase swap point
│  loadProjects / saveProjects / resetProjects.                │
│  Today: localStorage. Tomorrow: Supabase. UI never changes.  │
├─────────────────────────────────────────────────────────────┤
│  DOMAIN              lib/types.ts · lib/generators/*          │  framework-free logic
│                      lib/ai/*  ← Claude API swap point        │
│  Types, project generators, selectors, and the mock AI       │
│  functions. Pure TypeScript, independently testable.         │
└─────────────────────────────────────────────────────────────┘
```

---

## Directory map

```
app/
  layout.tsx                 App shell (fonts + <AppShell/>)
  page.tsx                   Home Dashboard
  portfolio/page.tsx         Portfolio board
  projects/new/page.tsx      Start New Project wizard
  projects/[id]/page.tsx     Project Workspace (tabbed)
  settings/page.tsx          Settings
components/
  shell/                     Sidebar, Topbar, AppShell (hydration)
  ui/                        Card, Button, Badge, Field, PageHeader, States
  dashboard/                 StatCard, HealthDonut, ProjectCard
  project/                   OverviewTab, TasksTab, RaidTab, MeetingsTab,
                             ReportsTab, PhaseTracker
lib/
  types.ts                   Domain model (single source of truth)
  utils.ts                   Dates, ids, class merging
  labels.ts                  Enum → display label + Tailwind class maps
  selectors.ts               Portfolio metrics + per-project derivations
  store.ts                   Zustand store
  data/
    repository.ts            Persistence boundary  (⇄ Supabase later)
    seed.ts                  5 sample projects
  generators/
    project.ts               Assemble a Project from wizard input
    phases.ts  tasks.ts  raid.ts   Type-specific starter content
  ai/
    parseMeetingNotes.ts     Mock AI  (⇄ Claude later)
    generateStatusReport.ts  Template + rules engine  (⇄ Claude later)
docs/
```

---

## Data model

The domain is a single `Project` aggregate that owns everything about a project:

```
Project
├── metadata        name, type, businessProblem, desiredOutcome,
│                   sponsorName/Email, targetGoLive, constraints, health
├── phases[]        Phase        (5, one in_progress)
├── tasks[]         Task         (status, priority, dueDate, phaseId)
├── milestones[]    Milestone    (dueDate, status)
├── raid[]          RaidItem     (risk|assumption|issue|dependency)
├── stakeholders[]  Stakeholder
├── meetingNotes[]  MeetingNote  (rawNotes + MeetingExtract)
├── statusReports[] StatusReport
└── sponsorDecisions[]
```

All enums (`Health`, `TaskStatus`, `RaidCategory`, …) live in `lib/types.ts`. Display strings and colors are mapped centrally in `lib/labels.ts`, so RAG semantics are consistent everywhere and easy to restyle.

---

## Key flows

### Creating a project

```
Wizard (app/projects/new)
  → store.addProject(input)
      → createProjectFromInput(input)      (lib/generators/project.ts)
          → generatePhases(type)
          → generateTasks(type, phases)
          → generateRaid(type) + generateMilestones(goLive)
          → parseStakeholders(...)
      → persist to repository
  → router.push(/projects/{id})
```

Starter content is **type-aware**: an "AI Automation" project gets prompt-engineering and accuracy-validation tasks and a model-accuracy risk; a "CRM Automation" project gets data-migration tasks and a data-quality issue, etc.

### Portfolio metrics

`lib/selectors.ts → computeMetrics(projects)` derives every dashboard number (RAG counts, overdue tasks, critical risks, open issues, sponsor decisions, reports due this week, upcoming milestones, and a ranked "needs attention" list). The dashboard is a pure function of state — no numbers are stored.

---

## The two swap points

### 1. Supabase-ready (`lib/data/repository.ts`)

The entire app touches persistence through **four functions**:

```ts
loadProjects(): Project[]
saveProjects(projects: Project[]): void
resetProjects(): Project[]
```

To migrate: reimplement these against Supabase (making them `async`), add auth, and scope queries by `org_id`. The store and every component stay the same. A `projects` table with JSONB columns for the nested arrays is the fastest path; normalising into child tables is a later optimisation.

### 2. AI-ready (`lib/ai/*`)

Both AI features are functions with **LLM-shaped async signatures** returning typed results:

```ts
parseMeetingNotes(raw: string): Promise<MeetingExtract>
generateStatusReport(project: Project): Promise<StatusReport>
```

Today they use heuristics and templates. To go live, replace each body with a Claude API call (recommended models: `claude-opus-4-8` for quality, `claude-sonnet-4-6` for cost/latency) that returns the **same shape**. Because callers depend only on `MeetingExtract` / `StatusReport`, no UI changes are required. This is best done from a Next.js **route handler / server action** so the API key stays server-side.

---

## Rendering & state notes

- Pages that read state are Client Components; the store hydrates once in `AppShell` via `useEffect`, so localStorage is only read in the browser (no SSR mismatch).
- Charts are hand-rolled SVG (`HealthDonut`) to avoid a charting dependency and guarantee identical server/client output.
- Tailwind's `content` globs are resolved from the project root — when running the dev server, ensure the working directory **is** the project root (see `.claude/launch.json`).

---

## Design system

Colors, typography, spacing, radii and component styles follow the **AceLiora AI** brand:
emerald `#0D6B4F` (primary), midnight navy `#0A1D37` (secondary), soft gold `#D4AF37` (accent),
Playfair Display (headings) + Montserrat (body). Tokens live in `tailwind.config.ts` and `app/globals.css`.
