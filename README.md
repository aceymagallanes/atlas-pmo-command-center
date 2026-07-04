# Atlas PMO Command Center

**An AI-powered project management command center for PMs, program managers and PMO leads who juggle multiple projects at once.**

Atlas replaces the spreadsheet sprawl of multi-project management with a clean, executive-grade web dashboard: portfolio-wide health visibility, automated RAID tracking, meeting-notes intelligence, and one-click executive status reports.

> Built as a portfolio MVP for **AceLiora AI** — _Accelerate Change. Sustain Excellence._

![Stack](https://img.shields.io/badge/Next.js-14-black) ![Stack](https://img.shields.io/badge/React-18-blue) ![Stack](https://img.shields.io/badge/TypeScript-5-blue) ![Stack](https://img.shields.io/badge/Tailwind-3-teal)

---

## The problem

A newly hired or overloaded PM running 5+ projects spends most of their week on **admin, not delivery**: rebuilding status decks, chasing risks across spreadsheets, re-typing meeting notes into actions, and manually assembling reports for sponsors. Visibility is poor and nothing is standardised.

## The solution

Atlas gives the PM a single command center:

- **Portfolio dashboard** — every project's RAG health, overdue work, critical risks, open issues, pending sponsor decisions and upcoming milestones in one view.
- **Guided project setup** — a wizard that auto-generates starter phases, tasks, RAID items and stakeholder records based on the project type.
- **RAID log** — structured Risks / Assumptions / Issues / Dependencies tracking per project.
- **Meeting Notes Assistant** — paste messy notes; get a summary plus extracted action items, risks, issues, decisions and escalations.
- **Weekly Status Report Generator** — an executive-ready report assembled from live project data in one click.

---

## Core pages

| # | Page | What it does |
|---|------|--------------|
| 1 | **Home Dashboard** | Portfolio KPIs, RAG donut, projects needing attention, upcoming milestones |
| 2 | **Portfolio** | Filterable board of all projects |
| 3 | **Start New Project** | 3-step wizard that generates a fully-populated project |
| 4 | **Project Workspace** | Overview: problem, outcome, sponsor, phases, milestones, health signals |
| 5 | **Tasks & Milestones** | Interactive task tracker with status, priority, due dates |
| 6 | **RAID Log** | Add/track/close risks, assumptions, issues, dependencies |
| 7 | **Meeting Notes Assistant** | Mock-AI extraction of structure from raw notes |
| 8 | **Status Report Generator** | Executive weekly report from template + rules |
| 9 | **Settings** | Profile, demo-data reset, production roadmap |

---

## Tech stack

- **Next.js 14** (App Router) + **React 18** + **TypeScript**
- **Tailwind CSS 3** with the AceLiora brand design system (emerald / navy / gold, Playfair + Montserrat)
- **Zustand** for state, persisted to **localStorage** via a swappable repository
- **lucide-react** icons, pure-SVG charts (no chart dependency)

This MVP intentionally uses **mock data and mock AI** with clean seams so that Supabase and the Claude API can be dropped in later **without touching the UI**. See [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md).

---

## Getting started

```bash
# Node 20 LTS required
npm install
npm run dev
# open http://localhost:3000
```

The app seeds **5 sample projects** on first load so the dashboard is populated immediately. Data persists in your browser's localStorage; reset it any time from **Settings → Demo Data**.

### Available scripts

| Command | Description |
|---|---|
| `npm run dev` | Start the dev server |
| `npm run build` | Production build |
| `npm run start` | Serve the production build |
| `npm run lint` | Lint |

---

## Documentation

- [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) — layered architecture, data model, and the Supabase / AI swap points
- [`docs/DEMO_SCRIPT.md`](docs/DEMO_SCRIPT.md) — a 5-minute walkthrough for interviews and client demos
- [`docs/PORTFOLIO_CASE_STUDY.md`](docs/PORTFOLIO_CASE_STUDY.md) — the business problem, solution and value story

---

## Roadmap

- [ ] Swap the localStorage repository for **Supabase** (auth + multi-tenant)
- [ ] Replace mock AI functions with the **Claude API** (`claude-opus-4-8` / `claude-sonnet-4-6`)
- [ ] Email/PDF export of status reports
- [ ] Sponsor-facing read-only portal

---

_© AceLiora AI — portfolio project. Sample data is fictional._
