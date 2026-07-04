# Demo Script — Atlas PMO Command Center

A tight **5-minute walkthrough** for interviews, client demos, or a screen-recording. Each step lists what to click and what to say.

> **Setup:** run `npm run dev`, open `http://localhost:3000`. The app auto-seeds 5 sample projects. If you've been clicking around, go to **Settings → Demo Data → Reset** for a clean start.

---

## 0. Framing (20 sec)

> "This is Atlas PMO Command Center — a tool for a project manager who's suddenly running five or six projects and is drowning in status admin. Instead of managing spreadsheets, they manage from one dashboard. Everything you'll see runs on mock data and mock AI, but it's architected to drop in a real database and the Claude API without changing the interface."

---

## 1. The portfolio dashboard (60 sec)

**Land on the Home Dashboard.**

> "First thing the PM sees every morning — the whole portfolio at a glance."

Point to:
- **Top KPI row** — active projects, RAG counts (3 on track, 1 at risk, 1 off track), overdue tasks, critical risks.
- **Second row** — open issues, sponsor decisions, reports due this week, upcoming milestones.
- **Portfolio Health donut** — the RAG mix.
- **Projects Needing Attention** — *"This is the magic: it's ranked. The red 'Finance Reporting Automation' floats to the top, with the reasons — 3 overdue tasks, 2 critical risks, 2 sponsor decisions pending."*

---

## 2. Into a project workspace (60 sec)

**Click "Finance Reporting Automation"** (the red one).

> "One click into the project workspace."

Point to:
- Header: type, current phase, and a **click-to-set RAG health** control.
- **Business Problem / Desired Outcome** cards — the why.
- **Delivery Phases** tracker — where we are in the lifecycle.
- **Sponsor** and **Health Signals** on the right.

Click the **Tasks & Milestones** tab:
> "Interactive task tracking — change a status inline, add a task, overdue items are flagged in red."

Click the **RAID Log** tab:
> "A proper RAID log — risks, assumptions, issues, dependencies — filterable, with impact and mitigation. This was auto-generated when the project was created."

---

## 3. Meeting Notes Assistant (60 sec)

**Click the "Meeting Notes" tab → "Load sample" → "Extract with AI".**

> "Here's the first AI feature. The PM just came out of a steering call with messy notes. They paste them in and hit extract."

After it runs, point to:
- **Summary**
- **Action Items** (with owners auto-detected — David, Priya)
- **Risks, Issues, Decisions, Escalations** — each separated out.

> "In seconds, unstructured notes become structured project intelligence. Click 'Save to Project' and it's on the record. Right now this is a heuristic function — in production it's one Claude API call behind the exact same interface."

---

## 4. Weekly Status Report (60 sec)

**Click the "Status Report" tab → "Generate Report".**

> "The thing every PM hates doing on a Friday afternoon."

Point to:
- The **executive banner** — overall status + a one-paragraph summary written from live data.
- The **Timeline / Scope / Budget** RAG strip.
- **Completed this week · Planned next week · Key risks · Open issues · Decisions needed · Sponsor support required · Recommended next actions.**
- Hit **Copy** — *"paste straight into an email or deck."*

> "This is assembled from the project's real tasks, risks and decisions — not typed by hand. Again: template and rules today, Claude for richer narrative tomorrow."

---

## 5. Create a new project (50 sec)

**Click "New Project" (top-right) → run the 3-step wizard.**

Fill in quickly:
- Name, **Project Type** (e.g. *AI Automation*), business problem, desired outcome.
- Sponsor + go-live date.
- (Skip stakeholders/constraints.) Hit **Create Project**.

> "Watch what happens on create —"

Land on the new workspace:
> "It didn't just save a name. It generated five delivery phases, about a dozen starter tasks *specific to AI Automation*, a starter RAID log, milestones and the sponsor record. The PM goes from a blank page to a running project in fifteen seconds — and it shows up on the dashboard immediately."

---

## 6. Close (20 sec)

> "So: multi-project visibility, standardised setup, automated RAID, AI meeting notes, and one-click exec reporting — the whole weekly admin load of a PM, in one command center. And every piece is built so the mock data becomes Supabase and the mock AI becomes Claude without rebuilding the front end."

---

### Quick-reference click path

`Dashboard → Finance Reporting Automation → Tasks tab → RAID tab → Meeting Notes (Load sample → Extract) → Status Report (Generate → Copy) → New Project (wizard → Create) → back to Dashboard`
