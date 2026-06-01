"""
BriefWriter — Phase 3
Writes the scored keyword brief to output/keyword_brief_YYYY-MM-DD.json
This file is the handoff artifact to the Content Agent.
"""

import json
from datetime import datetime
from pathlib import Path
from collections import defaultdict


OUTPUT_DIR = Path(__file__).parent.parent / "output"


class BriefWriter:
    def write(self, keywords: list[dict]) -> Path:
        OUTPUT_DIR.mkdir(exist_ok=True)
        date_str = datetime.now().strftime("%Y-%m-%d")
        output_path = OUTPUT_DIR / f"keyword_brief_{date_str}.json"

        # Group keywords by page type for the Content Agent
        by_page_type = defaultdict(list)
        for kw in keywords:
            page_type = kw.get("page_type", "cluster_article")
            by_page_type[page_type].append(kw)

        # Build the brief structure
        brief = {
            "generated_at": datetime.now().isoformat(),
            "total_keywords": len(keywords),
            "aeo_candidates": sum(1 for kw in keywords if kw.get("aeo_flag")),
            "top_priorities": [
                {
                    "keyword": kw["keyword"],
                    "score": kw["score"],
                    "intent": kw.get("intent"),
                    "job_cluster": kw.get("job_cluster"),
                    "aeo_flag": kw.get("aeo_flag", False),
                    "aeo_reason": kw.get("aeo_reason"),
                    "page_type": kw.get("page_type"),
                    "volume": kw.get("volume"),
                    "difficulty": kw.get("difficulty"),
                    "source": kw.get("source"),
                }
                for kw in keywords[:50]  # top 50 for the Content Agent
            ],
            "by_page_type": {
                page_type: [
                    {
                        "keyword": kw["keyword"],
                        "score": kw["score"],
                        "aeo_flag": kw.get("aeo_flag", False),
                    }
                    for kw in sorted(kws, key=lambda x: x["score"], reverse=True)[:10]
                ]
                for page_type, kws in by_page_type.items()
            },
            "content_agent_instructions": self._build_instructions(keywords),
            "all_keywords": keywords,
        }

        with open(output_path, "w") as f:
            json.dump(brief, f, indent=2)

        return output_path

    def _build_instructions(self, keywords: list[dict]) -> dict:
        """
        Auto-generate instructions for the Content Agent based on patterns
        in the keyword data.
        """
        pillar_candidates = [
            kw for kw in keywords
            if kw.get("page_type") == "pillar" and kw["score"] >= 70
        ]
        aeo_clusters = [
            kw for kw in keywords
            if kw.get("aeo_flag") and kw["score"] >= 60
        ]
        quick_wins = [
            kw for kw in keywords
            if kw.get("difficulty", 100) < 35 and kw["score"] >= 55
        ]

        return {
            "immediate_priorities": [kw["keyword"] for kw in keywords[:5]],
            "pillar_pages_to_create": [kw["keyword"] for kw in pillar_candidates[:3]],
            "aeo_content_clusters": [kw["keyword"] for kw in aeo_clusters[:10]],
            "quick_win_opportunities": [kw["keyword"] for kw in quick_wins[:8]],
            "notes": (
                "AEO content should open with a direct 40-60 word answer to the query. "
                "Pillar pages need comprehensive coverage with clear H2/H3 structure. "
                "All pages should include schema markup (Article, FAQPage, or HowTo). "
                "Target 1500+ words for pillar, 800-1200 for cluster articles, 300-500 for FAQ."
            ),
        }
