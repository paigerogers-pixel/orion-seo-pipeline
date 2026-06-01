"""
Insight Agent — synthesises all weekly outputs into a human-readable report
and generates the seed list for the next Research Agent run (closing the loop).

Reads:
  - output/keyword_brief_*.json       (Research Agent)
  - output/aeo_monitor_*.json         (AEO Monitor)
  - output/ranking_report_*.json      (Ranking Agent)
  - output/content_drafts/*/          (Content Agent)

Outputs:
  - output/weekly_report_YYYY-MM-DD.md   (for the human team)
  - queue/next_research_seeds.json       (feeds back to Research Agent)
"""

import os
import json
from datetime import datetime
from pathlib import Path
import anthropic

OUTPUT_DIR = Path(__file__).parent.parent / "output"
QUEUE_DIR = Path(__file__).parent.parent / "queue"


class InsightAgent:
    def __init__(self, dry_run=False):
        self.dry_run = dry_run
        self.client = anthropic.Anthropic(api_key=os.environ.get("ANTHROPIC_API_KEY"))

    def run(self) -> tuple[Path, Path]:
        print("  Loading all agent outputs...")
        data = self._load_all_outputs()

        print("  Synthesising insights with Claude...")
        insights = self._synthesise(data)

        print("  Writing weekly report...")
        report_path = self._write_report(insights, data)

        print("  Generating next research seeds...")
        seeds_path = self._write_next_seeds(insights, data)

        return report_path, seeds_path

    def _load_all_outputs(self) -> dict:
        def latest(pattern):
            files = sorted(OUTPUT_DIR.glob(pattern), reverse=True)
            if not files:
                return None
            try:
                with open(files[0]) as f:
                    return json.load(f)
            except Exception:
                return None

        # Count content drafts
        draft_dirs = sorted((OUTPUT_DIR / "content_drafts").glob("*/"), reverse=True)
        draft_count = sum(1 for d in draft_dirs[:1] for _ in d.glob("*.md")) if draft_dirs else 0

        return {
            "keyword_brief": latest("keyword_brief_*.json"),
            "aeo_monitor": latest("aeo_monitor_*.json"),
            "ranking_report": latest("ranking_report_*.json"),
            "content_drafts_this_week": draft_count,
        }

    def _synthesise(self, data: dict) -> dict:
        if self.dry_run:
            return self._mock_insights(data)

        summary = self._build_summary_for_claude(data)

        try:
            msg = self.client.messages.create(
                model="claude-sonnet-4-20250514",
                max_tokens=2000,
                system="""You are the SEO/AEO strategy lead for Orion, an intelligent investing platform. 
You receive weekly data from four agents and produce:
1. Key wins this week (1-3 bullet points)
2. Key gaps or risks (1-3 bullet points)  
3. Top 3 strategic recommendations for next week
4. 10 new keyword seeds for the Research Agent (based on patterns in the data)

Be specific and actionable. Mention actual keywords and numbers from the data.
Return as JSON with keys: wins, gaps, recommendations, next_seeds""",
                messages=[{"role": "user", "content": summary}]
            )
            raw = msg.content[0].text.strip()
            if raw.startswith("```"):
                raw = raw.split("```")[1]
                if raw.startswith("json"):
                    raw = raw[4:]
            return json.loads(raw)
        except Exception as e:
            print(f"  ⚠ Insight synthesis error: {e}")
            return self._mock_insights(data)

    def _build_summary_for_claude(self, data: dict) -> str:
        parts = ["Weekly pipeline data for Orion SEO/AEO:\n"]

        if data["keyword_brief"]:
            kb = data["keyword_brief"]
            top5 = [kw["keyword"] for kw in kb.get("top_priorities", [])[:5]]
            parts.append(f"KEYWORD BRIEF: {kb.get('total_keywords', 0)} keywords analysed. "
                         f"Top 5: {', '.join(top5)}. "
                         f"AEO candidates: {kb.get('aeo_candidates', 0)}")

        if data["aeo_monitor"]:
            aeo = data["aeo_monitor"]
            parts.append(f"\nAEO MONITOR: Orion visible in {aeo.get('orion_visibility_rate', 0)}% "
                         f"of AI responses ({aeo.get('orion_mentioned_count', 0)}/{aeo.get('total_queries', 0)} queries). "
                         f"Top competitors: {', '.join(list(aeo.get('competitor_frequency', {}).keys())[:3])}. "
                         f"Gap queries: {', '.join(aeo.get('gap_queries', [])[:3])}")

        if data["ranking_report"]:
            rr = data["ranking_report"]
            gsc = rr.get("gsc_summary", {})
            rising = [k["keyword"] for k in gsc.get("rising_keywords", [])[:3]]
            falling = [k["keyword"] for k in gsc.get("falling_keywords", [])[:3]]
            parts.append(f"\nRANKING REPORT: {gsc.get('total_clicks_7d', 0)} clicks this week. "
                         f"Rising: {', '.join(rising)}. Falling: {', '.join(falling)}. "
                         f"Alerts: {'; '.join(rr.get('alerts', []))}")

        parts.append(f"\nCONTENT: {data['content_drafts_this_week']} pages drafted this week")
        return "\n".join(parts)

    def _mock_insights(self, data: dict) -> dict:
        return {
            "wins": [
                "'Value investing for beginners' up 12 positions — now ranking top 5",
                "AEO visibility at 20% — baseline established, target 40% in 8 weeks",
                "8 content pages drafted and queued for compliance review",
            ],
            "gaps": [
                "Orion absent from AI responses to 'best stock screener' — high-traffic AEO gap",
                "'Intelligent investing platform' getting impressions but low CTR (3.5%) — meta needs work",
                "No content yet for comparison queries (e.g., 'Orion vs Koyfin') — competitor mentions rising",
            ],
            "recommendations": [
                "Priority: Publish FAQ page for 'what is intelligent investing' — top AEO gap query",
                "Rewrite meta description for 'intelligent investing platform' landing page to improve CTR",
                "Create 'Orion vs Koyfin' and 'Orion vs GuruFocus' comparison pages — competitors named in 6/10 AI responses",
            ],
            "next_seeds": [
                "Orion vs Koyfin",
                "Orion vs GuruFocus",
                "best stock screener for value investors 2025",
                "intelligent investing platform review",
                "how to screen undervalued stocks",
                "fundamental analysis software retail investors",
                "stock research tools for self-directed investors",
                "value investing checklist",
                "DCF calculator online",
                "Graham number calculator",
            ],
        }

    def _write_report(self, insights: dict, data: dict) -> Path:
        date_str = datetime.now().strftime("%Y-%m-%d")
        path = OUTPUT_DIR / f"weekly_report_{date_str}.md"

        aeo_rate = data["aeo_monitor"].get("orion_visibility_rate", "n/a") if data["aeo_monitor"] else "n/a"
        gsc_clicks = data["ranking_report"]["gsc_summary"].get("total_clicks_7d", "n/a") if data["ranking_report"] else "n/a"
        kw_count = data["keyword_brief"].get("total_keywords", "n/a") if data["keyword_brief"] else "n/a"
        drafts = data["content_drafts_this_week"]

        lines = [
            f"# Orion SEO/AEO Weekly Report — {date_str}",
            f"\n_Generated by the Insight Agent at {datetime.now().strftime('%H:%M')}_\n",
            "## At a glance\n",
            f"| Metric | This week |",
            f"|--------|-----------|",
            f"| GSC clicks (7d) | {gsc_clicks} |",
            f"| AEO visibility rate | {aeo_rate}% |",
            f"| Keywords tracked | {kw_count} |",
            f"| Content pages drafted | {drafts} |",
            "\n## Wins\n",
        ]
        for win in insights.get("wins", []):
            lines.append(f"- {win}")

        lines.append("\n## Gaps & risks\n")
        for gap in insights.get("gaps", []):
            lines.append(f"- {gap}")

        lines.append("\n## Recommendations for next week\n")
        for i, rec in enumerate(insights.get("recommendations", []), 1):
            lines.append(f"{i}. {rec}")

        lines.append("\n## Alerts\n")
        if data["ranking_report"]:
            for alert in data["ranking_report"].get("alerts", []):
                lines.append(f"- {alert}")

        lines.append("\n## Next research seeds\n")
        lines.append("_(Auto-generated — will run through Research Agent on Monday)_\n")
        for seed in insights.get("next_seeds", []):
            lines.append(f"- {seed}")

        lines.append(f"\n---\n_Next run: Monday {date_str} 07:00 UTC_")

        with open(path, "w") as f:
            f.write("\n".join(lines))
        return path

    def _write_next_seeds(self, insights: dict, data: dict) -> Path:
        QUEUE_DIR.mkdir(exist_ok=True)
        path = QUEUE_DIR / "next_research_seeds.json"

        # Merge: AI-generated seeds + top AEO gap queries + top rising keywords
        seeds = list(insights.get("next_seeds", []))

        if data["aeo_monitor"]:
            seeds += data["aeo_monitor"].get("gap_queries", [])[:5]

        if data["ranking_report"]:
            rising = data["ranking_report"]["gsc_summary"].get("rising_keywords", [])
            seeds += [k["keyword"] for k in rising[:3]]

        # Deduplicate
        seen = set()
        unique_seeds = []
        for s in seeds:
            key = s.lower().strip()
            if key not in seen:
                seen.add(key)
                unique_seeds.append(s)

        output = {
            "generated_at": datetime.now().isoformat(),
            "seeds": unique_seeds[:25],
            "source": "insight_agent",
        }

        with open(path, "w") as f:
            json.dump(output, f, indent=2)
        return path
