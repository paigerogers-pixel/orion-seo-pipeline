# Orion SEO/AEO Pipeline — Start Here

This file is your entry point in a fresh Claude Code session.
Open this folder, read this file, then say **"run the Orion pipeline"**.

---

## What this is

A fully AI-agentic SEO/AEO pipeline for Orion. Six Claude-powered agents run in sequence:

```
Research → AEO Monitor → Content → CIRO Compliance Review → Ranking → Insight
                                                                           ↓
                                              Jira tickets + Confluence update + ↺ seeds
```

No Python. No Node.js. No servers. Claude is the runtime.

---

## First-time setup (2 minutes)

### 1. Copy your environment file
```
cp .env.example .env
```
Open `.env` and fill in your `ANTHROPIC_API_KEY` (everything else is optional).

### 2. Run the pipeline
In Claude Code, say:
```
run the Orion pipeline
```

That's it. All 6 agents fire automatically.

---

## What happens on each run

| Phase | Agent | What it does | Output |
|-------|-------|-------------|--------|
| ① | Research | 5 parallel web searches: SERP, competitors, community language, AEO signals, trends. Scores 40–60 keywords. | `output/keyword_brief_YYYY-MM-DD.json` |
| ② | AEO Monitor | Audits 10 ICP queries — what Claude/ChatGPT says today, which competitors are cited, where Orion is absent | `output/aeo_monitor_YYYY-MM-DD.json` |
| ③ | Content | Drafts 10 publish-ready pages. AEO gap pages first. Each opens with a 40–60 word direct answer for AI retrieval. | `output/content_drafts/YYYY-MM-DD/*.md` |
| ③b | CIRO Compliance | Line-by-line CIRO Rule 3602 review of every draft. Flags problematic wording, provides rewrites, marks supervisor requirements. | `output/compliance_report_YYYY-MM-DD.json` |
| ④ | Ranking | GSC position tracking, 7d vs prior-7d deltas, AEO trend, alerts | `output/ranking_report_YYYY-MM-DD.json` |
| ⑤ | Insight | Weekly report + 25 keyword seeds for next run. Jira tickets created. Confluence updated. | `output/weekly_report_YYYY-MM-DD.md` + `queue/next_research_seeds.json` |

---

## All run options

| Command | What it does |
|---------|-------------|
| `run the Orion pipeline` | Full pipeline, all 6 phases |
| `run the Orion pipeline for [date]` | Run with a specific date (e.g. `for 2026-06-09`) |
| `show me this week's results` | Summary of the latest output files |
| `update the pipeline to follow [instructions]` | Modify agent behaviour |
| `export to Confluence` | Push latest weekly report as a child page |

---

## Outputs (auto-generated, gitignored)

```
output/
  keyword_brief_2026-06-02.json        ← 40–60 scored keywords
  aeo_monitor_2026-06-02.json          ← AI visibility audit
  compliance_report_2026-06-02.json    ← CIRO 3602 review results
  ranking_report_2026-06-02.json       ← position tracking + alerts
  weekly_report_2026-06-02.md          ← share with team
  content_drafts/
    2026-06-02/
      margin-of-safety-investing-meaning.md
      how-to-calculate-intrinsic-value-of-a-stock.md
      ... (10 pages total, compliance-revised)

queue/
  next_research_seeds.json             ← auto-loads on next run
```

---

## Key files (do not delete)

| File | Purpose |
|------|---------|
| `.claude-workflow/orion-seo-pipeline.js` | Main pipeline script (v2) — edit to change agent behaviour |
| `.github/workflows/weekly_pipeline.yml` | GitHub Actions schedule — Monday 07:00 UTC |
| `CLAUDE.md` | Branching workflow instructions for this repo |
| `.env.example` | All supported environment variables |

---

## Integrations

All are optional. The pipeline falls back gracefully if not configured.

### Jira (auto-configured)
- Cloud: `mogofintech.atlassian.net`
- Project: `MKTG`
- One Task ticket created per content draft, with CIRO compliance verdict included

### Confluence (auto-configured)
- Space: `MO1` (Marketing Operations)
- Pipeline page: https://mogofintech.atlassian.net/wiki/spaces/MO1/pages/3420782599
- Weekly report pages auto-created as children after each run

### Google Search Console (optional)
Set in `.env`:
```
GSC_SITE_URL=https://orion.com
GSC_SERVICE_ACCOUNT_JSON=/path/to/service-account.json
```

### Real keyword volumes (optional)
```
DATAFORSEO_LOGIN=your-login
DATAFORSEO_PASSWORD=your-password
```

---

## Branching workflow

```
master        ← stable, production-ready
  └── develop ← integration branch
        └── feature/xyz ← one branch per change
```

Pipeline updates should go to a `feature/` branch → PR to `develop` → merge to `master`.

---

## Compliance

All drafted pages pass through an automated CIRO Rule 3602 compliance review (authored by Axl Villapaz).

- Verdict per page: `Likely compliant` / `Needs revision` / `High risk`
- Supervisor approval flagged where required
- No page should be published without human compliance sign-off
- Compliance guidance: https://mogofintech.atlassian.net/wiki/spaces/MO1/pages/3425370122

---

## GitHub Pages dashboard

Live at: **https://paigerogers-pixel.github.io/orion-seo-pipeline/**

Shows latest metrics, AEO gap table, quick wins, competitor frequency, and starter kit instructions.

---

_Pipeline v2 · Claude-powered, fully agentic · Next Monday run: 2026-06-08 07:00 UTC_
