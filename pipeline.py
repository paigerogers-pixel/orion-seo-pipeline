#!/usr/bin/env python3
"""
Orion AEO/SEO Pipeline — full weekly run
Runs all 5 agents in sequence with rich terminal output.

Usage:
  python pipeline.py                  # full live run
  python pipeline.py --dry-run        # mock data, no API calls
  python pipeline.py --agent research # run a single agent
  python pipeline.py --limit 3        # draft only 3 content pages

Agents:
  1. research   → keyword discovery + scoring
  2. aeo        → AI assistant visibility monitoring
  3. content    → page drafting
  4. ranking    → GSC + position tracking
  5. insight    → synthesis + next-week seeds
"""

import argparse
import sys
import json
from datetime import datetime
from pathlib import Path

# Add agents dir to path
sys.path.insert(0, str(Path(__file__).parent / "agents"))

from research_agent import run as run_research, DEFAULT_SEEDS
from aeo_monitor import AEOMonitor
from content_agent import ContentAgent
from ranking_agent import RankingAgent
from insight_agent import InsightAgent

OUTPUT_DIR = Path(__file__).parent / "output"
QUEUE_DIR = Path(__file__).parent / "queue"

BANNER = """
╔══════════════════════════════════════════════════════════╗
║          Orion AEO/SEO Pipeline                         ║
║          Intelligent Investing — Organic Growth         ║
╚══════════════════════════════════════════════════════════╝"""


def header(text: str):
    print(f"\n{'─'*60}")
    print(f"  {text}")
    print(f"{'─'*60}")


def run_pipeline(dry_run: bool, agent: str | None, content_limit: int):
    print(BANNER)
    print(f"  Started: {datetime.now().strftime('%Y-%m-%d %H:%M')}")
    print(f"  Mode: {'DRY RUN' if dry_run else 'LIVE'}")

    run_all = agent is None

    # ── Agent 1: Research ─────────────────────────────────────────────────
    if run_all or agent == "research":
        header("① Research Agent — keyword discovery")

        # Use seeds from previous Insight Agent run if available
        seeds_path = QUEUE_DIR / "next_research_seeds.json"
        if seeds_path.exists():
            with open(seeds_path) as f:
                seeds = json.load(f).get("seeds", DEFAULT_SEEDS)
            print(f"  Using {len(seeds)} seeds from Insight Agent")
        else:
            seeds = DEFAULT_SEEDS
            print(f"  Using {len(seeds)} default seeds")

        run_research(seeds=seeds, dry_run=dry_run)

    # ── Agent 2: AEO Monitor ──────────────────────────────────────────────
    if run_all or agent == "aeo":
        header("② AEO Monitor — AI assistant visibility")
        monitor = AEOMonitor(dry_run=dry_run)
        aeo_path = monitor.run()
        print(f"\n  → Report: {aeo_path.name}")

        # Print quick summary
        with open(aeo_path) as f:
            aeo = json.load(f)
        print(f"  → Orion visible in {aeo['orion_visibility_rate']}% of AI responses")
        print(f"  → {len(aeo['gap_queries'])} queries where Orion is absent")
        if aeo.get("competitor_frequency"):
            top_comp = list(aeo["competitor_frequency"].items())[:3]
            print(f"  → Top competitors: {', '.join(f'{c}({n})' for c, n in top_comp)}")

    # ── Agent 3: Content ──────────────────────────────────────────────────
    if run_all or agent == "content":
        header("③ Content Agent — drafting pages")

        brief_path = sorted(OUTPUT_DIR.glob("keyword_brief_*.json"), reverse=True)
        brief_path = brief_path[0] if brief_path else None

        aeo_path = sorted(OUTPUT_DIR.glob("aeo_monitor_*.json"), reverse=True)
        aeo_path = aeo_path[0] if aeo_path else None

        if not brief_path:
            print("  ⚠ No keyword brief found. Run research agent first.")
        else:
            agent_obj = ContentAgent(dry_run=dry_run)
            drafted = agent_obj.run(brief_path=brief_path, aeo_path=aeo_path, limit=content_limit)
            print(f"\n  → {len(drafted)} pages drafted")
            print(f"  → Ready for human compliance + brand review")
            print(f"  → Location: output/content_drafts/{datetime.now().strftime('%Y-%m-%d')}/")

    # ── Agent 4: Ranking ──────────────────────────────────────────────────
    if run_all or agent == "ranking":
        header("④ Ranking + Visibility Agent")
        ranking = RankingAgent(dry_run=dry_run)
        report_path = ranking.run()

        with open(report_path) as f:
            report = json.load(f)

        gsc = report.get("gsc_summary", {})
        print(f"\n  → GSC clicks (7d): {gsc.get('total_clicks_7d', 0)}")
        print(f"  → Keywords tracked: {gsc.get('keywords_tracked', 0)}")
        if report.get("alerts"):
            print(f"  → Alerts:")
            for alert in report["alerts"]:
                print(f"    {alert}")
        print(f"  → Report: {report_path.name}")

    # ── Agent 5: Insight ──────────────────────────────────────────────────
    if run_all or agent == "insight":
        header("⑤ Insight Agent — synthesis + next-week seeds")
        insight = InsightAgent(dry_run=dry_run)
        report_path, seeds_path = insight.run()

        with open(report_path) as f:
            content = f.read()
        # Print the wins section
        in_wins = False
        for line in content.split("\n"):
            if "## Wins" in line:
                in_wins = True
            elif line.startswith("## ") and in_wins:
                break
            elif in_wins and line.startswith("- "):
                print(f"  ✓ {line[2:]}")

        with open(seeds_path) as f:
            seeds = json.load(f)
        print(f"\n  → {len(seeds['seeds'])} seeds queued for next Monday's Research Agent run")
        print(f"  → Weekly report: {report_path.name}")

    # ── Done ──────────────────────────────────────────────────────────────
    print(f"\n{'═'*60}")
    print(f"  Pipeline complete — {datetime.now().strftime('%H:%M')}")
    print(f"  Outputs in: {OUTPUT_DIR}/")
    print(f"  Next step: review output/content_drafts/ → compliance → publish")
    print(f"{'═'*60}\n")


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Orion AEO/SEO Pipeline")
    parser.add_argument("--dry-run", action="store_true", help="Use mock data, no API calls")
    parser.add_argument("--agent", choices=["research", "aeo", "content", "ranking", "insight"],
                        help="Run a single agent")
    parser.add_argument("--limit", type=int, default=5, help="Max content pages to draft")
    args = parser.parse_args()

    run_pipeline(dry_run=args.dry_run, agent=args.agent, content_limit=args.limit)
