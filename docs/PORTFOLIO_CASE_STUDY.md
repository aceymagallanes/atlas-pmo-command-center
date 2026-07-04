# Portfolio Case Study — Atlas PMO Command Center

**Role:** Product owner, designer & full-stack developer
**Type:** Self-directed portfolio MVP for AceLiora AI
**Stack:** Next.js 14 · React · TypeScript · Tailwind CSS · Zustand
**Status:** Working, demoable MVP (mock data + mock AI, production-ready architecture)

---

## 1. The problem

Project managers, program managers and PMO leads increasingly run **many projects in parallel**. The pain isn't the delivery work — it's the **management overhead**:

- Status is scattered across spreadsheets, decks and inboxes; nobody has a portfolio view.
- Risks and issues live in different formats per project, so nothing rolls up.
- Meeting notes are captured but rarely converted into tracked actions.
- Weekly status reports are rebuilt by hand — hours of copy-paste every week.
- A newly hired PM inheriting several projects has **no standard way to spin one up**.

The net effect: senior, expensive people spend their week on administration instead of leadership, and sponsors still lack timely visibility.

> This maps directly to AceLiora AI's thesis — **use AI and automation to remove low-value manual work from operations-heavy roles.**

---

## 2. The target user

A **PM / program manager / PMO lead / transformation or operations manager** managing **multiple concurrent projects**, who:

- needs portfolio-level visibility, not another single-project to-do app;
- reports upward to sponsors and steering committees;
- is often newly hired or overloaded, and wants **standardisation and speed**, not configuration.

---

## 3. The solution

**Atlas PMO Command Center** — a browser-based command center that turns multi-project chaos into a single, structured, AI-assisted workflow.

| Capability | What it removes |
|---|---|
| **Portfolio dashboard** with ranked "needs attention" | Manual status roll-ups across projects |
| **Guided project wizard** that auto-generates phases, tasks, RAID & stakeholders by project type | The blank-page problem; inconsistent setup |
| **RAID log** per project | Ad-hoc risk tracking in spreadsheets |
| **Meeting Notes Assistant** (AI) | Re-typing notes into actions/risks/decisions |
| **Weekly Status Report Generator** (AI) | Hours of manual report assembly |

---

## 4. Design decisions

**Executive, on-brand visual language.** The UI uses the AceLiora design system — emerald / navy / gold, Playfair Display headings, Montserrat body — to read as a premium SaaS product a PMO would actually put in front of a sponsor, not a toy.

**Type-aware generation, not generic templates.** Creating an *AI Automation* project produces prompt-engineering and accuracy-validation tasks plus a model-accuracy risk; a *CRM Automation* project produces data-migration tasks and a data-quality issue. The starter content demonstrates real domain knowledge (Lean Six Sigma / delivery lifecycle thinking), which is the differentiator.

**AI as a swappable capability, not a hard dependency.** The two AI features ship as heuristic/template functions with **LLM-shaped async interfaces**. This let me build and prove the entire UX without an API key or cost, while keeping a one-file path to the Claude API. It also makes the product honest in a demo: *"this is where Claude plugs in."*

**A real persistence seam.** All data flows through a four-function repository. The MVP uses localStorage so a live demo persists across refresh; the same interface becomes Supabase for production. No UI rework required.

---

## 5. Architecture at a glance

Four layers — UI → State (Zustand) → Data (repository) → Domain (types, generators, AI) — with the UI depending only on typed domain objects. Two deliberate swap points:

- `lib/data/repository.ts` → **Supabase**
- `lib/ai/*` → **Claude API**

Full detail in [`ARCHITECTURE.md`](ARCHITECTURE.md).

---

## 6. What it demonstrates (skills evidenced)

- **Product thinking** — framing a real operational pain around a specific user and reducing it to a shippable MVP scope.
- **Domain expertise** — PMO / delivery lifecycle, RAID discipline, executive status reporting, RAG governance.
- **Full-stack execution** — a working Next.js/TypeScript app with clean componentisation, derived-state selectors, and responsive, branded UI.
- **AI-automation instinct** — identifying the two highest-value automation points (notes → structure, data → report) and architecting for them.
- **Forward-compatible engineering** — designing seams for database and AI so the MVP is a foundation, not a throwaway.

---

## 7. Business value (the pitch)

For an SME or an operations-heavy team, a tool like this targets the **single most expensive inefficiency in project delivery: the PM's admin time.** Conservatively, a PM running 5 projects spends **4–6 hours/week** on status roll-ups, note processing and reporting. Automating the bulk of that is roughly **half a day per PM per week returned to delivery** — plus better sponsor visibility and standardised governance.

For AceLiora AI, Atlas doubles as a **productised offering**: a template that can be configured and deployed for clients as an "AI PMO in a box," billed as setup + recurring SaaS.

---

## 8. Roadmap

1. **Supabase** — auth, multi-tenant workspaces, real persistence.
2. **Claude API** — richer meeting extraction and narrative reports.
3. **Export** — PDF / email status reports; sponsor read-only portal.
4. **Integrations** — pull tasks/risks from Jira, Asana, or email.

---

_Built by Acey Magallanes · AceLiora AI — Accelerate Change. Sustain Excellence._
