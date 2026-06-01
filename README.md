# Orion Research Agent

Phase 1 of the Orion AEO/SEO pipeline. Runs weekly to produce a scored keyword
brief for the Content Agent.

## Quickstart with Claude Code

Open this folder in Claude Code and say:

> "Set up the research agent, install dependencies, and do a dry run"

Claude will run:
```bash
pip install -r requirements.txt
cp .env.example .env
python src/research_agent.py --dry-run
```

## First live run

1. Copy `.env.example` to `.env`
2. Add your `ANTHROPIC_API_KEY`
3. Choose a keyword backend (start with `mock`, then `dataforseo` for production)
4. Run:

```bash
python src/research_agent.py
```

Or with custom seeds:
```bash
python src/research_agent.py --seeds "value investing,beat S&P,intelligent portfolio"
```

## Output

Creates `output/keyword_brief_YYYY-MM-DD.json` with:

- **top_priorities** — top 50 keywords scored and classified
- **by_page_type** — keywords grouped by pillar / cluster / faq / comparison / landing
- **aeo_candidates** — count of question-form queries flagged for AI retrieval
- **content_agent_instructions** — auto-generated brief for the Content Agent

## Score formula

```
score = volume_score(log) × 40
      + intent_weight × 20        # commercial=1.4, informational=1.0
      + aeo_bonus × 15            # 1.3× multiplier if question-form
      + relevance × 20            # ICP fit scored by Claude
      - difficulty_penalty        # up to -10 for competitive terms
      + serp_feature_boost        # +5 if SERP has featured snippet or PAA
```

## Adding to a weekly cron

```bash
# In your crontab (runs every Monday at 7am)
0 7 * * 1 cd /path/to/orion-research-agent && python src/research_agent.py
```

Or as a GitHub Actions workflow — see `.github/workflows/research_agent.yml` (coming soon).

## Files

```
src/
  research_agent.py    ← entry point, run this
  keyword_fetcher.py   ← Phase 1a: SerpAPI / DataForSEO / mock
  community_scraper.py ← Phase 1b: Reddit ICP language
  claude_analyst.py    ← Phase 2: Claude intent + AEO scoring
  brief_writer.py      ← Phase 3: JSON brief output

output/
  keyword_brief_YYYY-MM-DD.json   ← handoff to Content Agent
```

## Next agents

- **AEO Monitor Agent** — checks if Orion appears in Claude/ChatGPT answers
- **Content Agent** — reads this brief and drafts optimised pages
- **Ranking Agent** — monitors Google Search Console + AI appearances
