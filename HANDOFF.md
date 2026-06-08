# Orion SEO/AEO Pipeline — Handoff Document

> Drop this file into a fresh Claude Code session to pick up exactly where we left off.

---

## Goal

Build and run a fully agentic weekly SEO/AEO content pipeline for **Intelligent Investing (II)** — a Canadian investing platform by Orion Digital Corp. (NASDAQ/TSX: ORIO). The pipeline runs every Monday, produces 10 doctrine-aligned content pages, monitors AI assistant visibility, and auto-updates Confluence + Jira. No Python, no runtime — Claude IS the pipeline.

---

## What's been built

### The pipeline
- **Location:** `C:\Users\Paige.Rogers\Desktop\claude codes\.claude-workflow\orion-seo-pipeline.js`
- **Trigger:** Say **"run the Orion pipeline"** in Claude Code
- **GitHub:** https://github.com/paigerogers-pixel/orion-seo-pipeline (public repo, master branch)
- **GitHub Actions:** Every Monday 07:00 UTC — needs `ANTHROPIC_API_KEY` secret added at github.com/paigerogers-pixel/orion-seo-pipeline/settings/secrets/actions

### 8 pipeline phases
1. **P0 Gate** — checks which of 10 foundation pages exist; missing ones go to front of queue
2. **Research Agent** — 5 parallel web searches, Canada-first ICP, scores 40–66 keywords per run
3. **AEO Monitor** — 15 ICP queries audited for AI visibility (Claude, ChatGPT, Perplexity)
4. **Content Agent** — drafts 10 pages, doctrine-aligned, 8-section structure, approved CTAs only
5. **CIRO Compliance Review** — Axl Villapaz's Rule 3602 prompt, 6 drift type checks, overwrites drafts
6. **Ranking Agent** — GSC position tracking (connect GSC: set `GSC_SERVICE_ACCOUNT_JSON` in `.env`)
7. **Insight Agent** — weekly report + The Edge newsletter draft + 25 categorised seeds
8. **Jira + Confluence** — 1 Jira ticket per page + Confluence pipeline page + social media state

### Outputs per run
```
output/keyword_brief_YYYY-MM-DD.json
output/aeo_monitor_YYYY-MM-DD.json
output/content_drafts/YYYY-MM-DD/*.md   ← 10 pages, compliance-revised
output/compliance_report_YYYY-MM-DD.json
output/ranking_report_YYYY-MM-DD.json
output/weekly_report_YYYY-MM-DD.md
output/content_briefs/YYYY-MM-DD/content_briefs_YYYY-MM-DD.md  ← for Tarsila + Miguel
queue/next_research_seeds.json
```

---

## Confluence pages (mogofintech.atlassian.net — Cloud ID: 7830fa63-7783-433f-b6d1-84e8c6995068)

| Page | ID | URL |
|------|----|-----|
| SEO/AEO — Automated Agent Flow (parent) | 3417702418 | /spaces/MO1/pages/3417702418 |
| Orion SEO/AEO — Automated Agent Pipeline | 3420782599 | /spaces/MO1/pages/3420782599 |
| Site Structure — Keyword-Based Architecture | 3435495466 | /spaces/MO1/pages/3435495466 |
| Compliance Guidance — Agent Content Rules | 3425370122 | /spaces/MO1/pages/3425370122 |
| Weekly Report — 2026-06-05 | (latest — check space) | /spaces/MO1 |
| SOC Performance Summary (social state) | 3428450308 | — |
| The Edge Newsletter | 3417866270 | — |

### Key Confluence space
- Space: **MO1 (Marketing Operations)** — Space ID: 3409674244
- All SEO/AEO pages live under parent 3417702418

---

## Jira
- Project: **MKTG** (Cloud ID: 7830fa63-7783-433f-b6d1-84e8c6995068)
- 10 content review tickets auto-created per pipeline run
- Board: https://mogofintech.atlassian.net/jira/software/projects/MKTG/boards

---

## Dave Feller doctrine (governs ALL content)

The pipeline embeds this fully. Key rules for any new content:
- **The allocator is the product. The portfolio is the artifact.**
- Always **"most of us"** — never "most investors"
- **Five claims** every page must reduce to one of:
  1. The market humbles everyone.
  2. The few who endure operate a specific way.
  3. We make that way operationally possible.
  4. You will know exactly where you stand.
  5. Most of us prefer not to know.
- **Forbidden words:** elite, exclusive, premium, luxury, smart money, beat the market, alpha, outperform, expert picks
- **Approved CTAs only:** "Proceed deliberately." / "See the system." / "Compare decisions to the benchmark." / "Review the process."
- **6 drift types to avoid:** Guru, Activity, Educational, Pronoun, Identity, Status
- **4 content categories:** 01 System Failure / 02 Behavioural Edge / 03 Capital Discipline / 04 Identity
- **ICP:** Confused Improver — 28–42, $25K–$250K, Wealthsimple/Questrade user, no clear system

---

## CIRO compliance status

- **8 Known Unknowns (KU-1 to KU-8) pending Axl Villapaz** — target June 15, 2026
- Until resolved: all 10 pages per run flagged "Needs revision — awaiting compliance guidance"
- All pages require Supervisor sign-off before publishing
- Confluence compliance page: https://mogofintech.atlassian.net/wiki/spaces/MO1/pages/3425370122
- When Axl fills in the page, tag Paige — pipeline updates automatically

---

## Site structure (56 pages mapped)

Built from Google Ads Keyword Planner data (Canada, CAD, May 2025–April 2026):
- **P0 (10):** Foundation pages — must exist before P1/P2/P3. Pipeline prioritises these.
- **P1 (28):** AI investing cluster, value investing, Canadian accounts (TFSA/RRSP), platform comparisons
- **P2 (13):** Stock screening, behavioural content
- **P3 (10):** AEO definition pages
- **~270,000/mo** total addressable Canadian searches
- Full structure: Confluence page 3435495466

### Do NOT build:
Penny stocks, individual stock tickers, day trading, swing trading, short selling, options, "stocks to buy now", GIC rate comparisons — all attract the wrong ICP or create drift.

---

## Pipeline run history

| Date | Keywords | AEO % | Pages | Notes |
|------|----------|--------|-------|-------|
| 2026-06-01 | 66 | 0% | 10 | First run, baseline established |
| 2026-06-02 | 53 | 0% | 10 | First CIRO compliance review |
| 2026-06-05 | 51 | 0% | 10 | Canada-first ICP, correct competitors (Wealthsimple/Questrade) |

### AEO target: 40% visibility by week 8

---

## Current blockers

1. **GSC not connected** — ranking data is modelled. Fix: add `GSC_SERVICE_ACCOUNT_JSON=/path/to/key.json` to `.env`
2. **ANTHROPIC_API_KEY missing from GitHub** — GitHub Actions automation won't run until key added at github.com/paigerogers-pixel/orion-seo-pipeline/settings/secrets/actions. Key from console.anthropic.com.
3. **KU-1 through KU-8 unresolved** — all pages blocked from publish until Axl fills in compliance guidance page by June 15
4. **P0 pages not published** — 10 foundation pages drafted but not live. Publishing = prerequisite for any AEO visibility gain.

---

## Next steps (priority order)

1. **Publish P0 foundation pages** — Tarsila review → Miguel implements → submit to GSC
2. **Connect GSC** — add `GSC_SERVICE_ACCOUNT_JSON` to `.env`
3. **Quick win: intrinsic value calculator** (position 11.8, difficulty 32) — add interactive widget, Graham example, 2–3 internal links → page 1 in 3–4 weeks
4. **Publish "what is a kill line in investing"** — zero competition, II owns the term, no incumbent can replicate
5. **Chase Axl for KU resolution** — June 15 deadline, all 20 drafted pages unlock on completion
6. **Get Anthropic API key** — try console.anthropic.com, or ask Aidan/Euan Feller or IT team
7. **Run the pipeline weekly** — say "run the Orion pipeline" in Claude Code every Monday, or add API key to unlock GitHub Actions automation

---

## How to run the pipeline

```
Say: "run the Orion pipeline"
```

Claude will execute all 8 phases, write outputs to `output/`, create Jira tickets, update Confluence, draft The Edge newsletter, and update the social media state page. ~45–90 minutes.

---

## Key files

| File | Purpose |
|------|---------|
| `.claude-workflow/orion-seo-pipeline.js` | Main pipeline script (v3) |
| `.github/workflows/weekly_pipeline.yml` | GitHub Actions Monday trigger |
| `.env` | Local env vars (never commit) |
| `.env.example` | Template |
| `CLAUDE.md` | Branching workflow and project guide |
| `START_HERE.md` | Fresh session setup guide |
| `docs/index.html` | GitHub Pages dashboard |
| `output/` | All pipeline outputs (gitignored) |
| `queue/next_research_seeds.json` | Seeds for next run (auto-loaded) |

---

## Branching workflow

```
master        ← stable, production-ready
  └── develop ← integration branch
        └── feature/xyz ← one branch per change
```

To make a change: `git checkout develop && git checkout -b feature/your-change` → PR to develop → PR to master.

GitHub CLI is installed at `C:\Users\Paige.Rogers\gh-cli\bin\gh.exe` and authenticated.

---

*Handoff written June 5, 2026. Pipeline v3. Last successful run: 2026-06-05.*
