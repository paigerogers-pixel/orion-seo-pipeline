# Orion SEO/AEO Pipeline — Claude Code Guide

## Branching workflow

**Always follow this pattern:**

```
master        ← stable, production-ready
  └── develop ← integration branch (PRs merge here first)
        └── feature/xyz ← one branch per change
```

### Starting a new change

```
git checkout develop
git pull
git checkout -b feature/your-change-name
```

### Finishing a change

```
git add .
git commit -m "describe what changed and why"
git push -u origin feature/your-change-name
# Then open a PR: feature/xyz → develop
```

### Releasing to master

When `develop` is stable and reviewed:
```
# Open a PR: develop → master
```

## How to run the pipeline

Say: **"run the Orion pipeline"** in Claude Code.

This runs the workflow script at:
`.claude-workflow/orion-seo-pipeline.js`

All 5 agents run in sequence → Jira tickets created → Confluence page updated.

## Key files

| File | Purpose |
|------|---------|
| `.claude-workflow/orion-seo-pipeline.js` | Main pipeline (v2) — edit this to change agent behaviour |
| `.github/workflows/weekly_pipeline.yml` | GitHub Actions Monday 07:00 UTC trigger |
| `agents/` | Python agent modules (reference only) |
| `.env` | Local env vars (never commit — in .gitignore) |
| `.env.example` | Template for all supported env vars |

## Outputs (gitignored)

```
output/
  keyword_brief_YYYY-MM-DD.json
  aeo_monitor_YYYY-MM-DD.json
  ranking_report_YYYY-MM-DD.json
  weekly_report_YYYY-MM-DD.md
  content_drafts/YYYY-MM-DD/*.md   ← review before publishing
queue/
  next_research_seeds.json          ← auto-loaded on next run
```

## Confluence

Pipeline page: https://mogofintech.atlassian.net/wiki/spaces/MO1/pages/3420782599

## Jira

Content review tickets auto-created in: MKTG project
