"""
Orion Research Agent — AEO/SEO Keyword Discovery
Runs weekly, outputs a scored keyword brief JSON for the Content Agent.

Usage:
  python src/research_agent.py
  python src/research_agent.py --seeds "value investing,beat S&P,intelligent portfolio"
  python src/research_agent.py --dry-run   # uses mock data, no API calls
"""

import argparse
import json
import os
from datetime import datetime
from pathlib import Path

from keyword_fetcher import KeywordFetcher
from community_scraper import CommunityScraper
from claude_analyst import ClaudeAnalyst
from brief_writer import BriefWriter


DEFAULT_SEEDS = [
    "intelligent investing",
    "beat the S&P 500",
    "value investing",
    "value investing for beginners",
    "how to pick stocks",
    "outperform the market",
    "best stock portfolio tracker",
    "what is value investing",
    "long term investing strategy",
    "Warren Buffett investing strategy",
    "undervalued stocks how to find",
    "passive vs active investing",
    "intelligent investor book summary",
    "how to analyse a stock",
    "portfolio management software",
]


def run(seeds: list[str], dry_run: bool = False):
    print(f"\n{'='*60}")
    print(f"  Orion Research Agent  |  {datetime.now().strftime('%Y-%m-%d %H:%M')}")
    print(f"  Mode: {'DRY RUN (mock data)' if dry_run else 'LIVE'}")
    print(f"{'='*60}\n")

    # Phase 1: Data ingestion
    print("[ Phase 1 ] Fetching keyword data...")
    fetcher = KeywordFetcher(dry_run=dry_run)
    keyword_data = fetcher.fetch(seeds)
    print(f"  → {len(keyword_data)} keywords collected\n")

    print("[ Phase 1 ] Scraping community language...")
    scraper = CommunityScraper(dry_run=dry_run)
    community_terms = scraper.scrape(seeds[:5])  # limit to top 5 seeds
    print(f"  → {len(community_terms)} community phrases extracted\n")

    all_keywords = keyword_data + community_terms

    # Phase 2: Claude analysis
    print("[ Phase 2 ] Running Claude analysis...")
    analyst = ClaudeAnalyst()
    scored_keywords = analyst.analyse(all_keywords)
    print(f"  → {len(scored_keywords)} keywords scored\n")

    # Phase 3: Write brief
    print("[ Phase 3 ] Writing keyword brief...")
    writer = BriefWriter()
    output_path = writer.write(scored_keywords)
    print(f"  → Brief written to: {output_path}\n")

    # Summary
    top_10 = sorted(scored_keywords, key=lambda x: x.get("score", 0), reverse=True)[:10]
    print("TOP 10 KEYWORDS BY PRIORITY SCORE")
    print("-" * 60)
    print(f"{'Keyword':<38} {'Score':>5}  {'Intent':<12} AEO")
    print("-" * 60)
    for kw in top_10:
        aeo = "✓" if kw.get("aeo_flag") else " "
        intent = kw.get("intent", "—")
        print(f"{kw['keyword']:<38} {kw['score']:>5}  {intent:<12} {aeo}")
    print()
    print(f"Full brief: {output_path}")
    print(f"Pass this to the Content Agent: content_agent.py --brief {output_path}\n")


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Orion Research Agent")
    parser.add_argument("--seeds", help="Comma-separated seed keywords")
    parser.add_argument("--dry-run", action="store_true", help="Use mock data")
    args = parser.parse_args()

    seeds = [s.strip() for s in args.seeds.split(",")] if args.seeds else DEFAULT_SEEDS
    run(seeds=seeds, dry_run=args.dry_run)
