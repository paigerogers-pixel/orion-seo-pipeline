"""
ClaudeAnalyst — Phase 2
The intelligence layer. Sends keyword batches to Claude for:
  1. Intent classification (informational / commercial / navigational)
  2. ICP job cluster (learn / compare / evaluate / act)
  3. AEO suitability flag
  4. Priority score (0–100)
  5. Recommended page type

Uses claude-sonnet-4-20250514 via the Anthropic API.
Set ANTHROPIC_API_KEY in your environment.
"""

import os
import json
import math
import anthropic
from typing import Any


SYSTEM_PROMPT = """You are a keyword strategy expert for Orion, an intelligent investing platform 
that helps value investors find undervalued stocks and outperform the S&P 500.

Orion's ICP: self-directed investors aged 30–55, serious about long-term wealth building, 
familiar with Warren Buffett / Benjamin Graham style investing, frustrated with generic 
robo-advisors and index funds, willing to pay for serious research tools.

For each keyword I provide, return a JSON array where each object has:
  - keyword: (string, unchanged)
  - intent: "informational" | "commercial" | "navigational"
  - job_cluster: "learn" | "compare" | "evaluate" | "act"
  - aeo_flag: true if question-form, definitional, or "how to" — high AI retrieval potential
  - aeo_reason: brief explanation if aeo_flag is true, else null
  - page_type: "pillar" | "cluster_article" | "comparison" | "faq" | "landing"
  - relevance_to_orion: 0.0–1.0 — how directly relevant to Orion's product
  - score_adjustments: object with keys intent_weight, aeo_multiplier, relevance_weight

Rules:
- commercial intent = user is evaluating tools / ready to buy → intent_weight: 1.4
- informational intent = user is learning → intent_weight: 1.0
- navigational = branded query → intent_weight: 0.8
- aeo_flag true → aeo_multiplier: 1.3, else 1.0
- pillar pages: broad topics (4+ subtopics can branch from it), 1500+ word guides
- comparison pages: "X vs Y", "best X for Y" queries
- faq pages: single-question short-answer queries
- cluster_article: specific subtopic, 800–1200 words
- landing pages: high-commercial-intent product queries

Return ONLY the JSON array. No markdown, no explanation."""


class ClaudeAnalyst:
    def __init__(self):
        self.client = anthropic.Anthropic(api_key=os.environ.get("ANTHROPIC_API_KEY"))
        self.batch_size = 30  # keywords per Claude call

    def analyse(self, keywords: list[dict]) -> list[dict]:
        """
        Sends keywords to Claude in batches, merges analysis back,
        then calculates final priority scores.
        """
        # Split into batches
        batches = [
            keywords[i:i + self.batch_size]
            for i in range(0, len(keywords), self.batch_size)
        ]

        all_analyses = []
        for i, batch in enumerate(batches):
            print(f"  → Analysing batch {i+1}/{len(batches)} ({len(batch)} keywords)...")
            analyses = self._analyse_batch(batch)
            all_analyses.extend(analyses)

        # Merge original data + Claude analysis + compute final score
        analysis_map = {a["keyword"].lower(): a for a in all_analyses}
        results = []

        for kw in keywords:
            key = kw["keyword"].lower()
            analysis = analysis_map.get(key, {})
            merged = {**kw, **analysis}
            merged["score"] = self._compute_score(merged)
            results.append(merged)

        return sorted(results, key=lambda x: x["score"], reverse=True)

    def _analyse_batch(self, batch: list[dict]) -> list[dict]:
        keyword_list = "\n".join(
            f"- {kw['keyword']}" + (f" (volume: {kw['volume']})" if kw.get('volume') else "")
            for kw in batch
        )

        try:
            message = self.client.messages.create(
                model="claude-sonnet-4-20250514",
                max_tokens=4096,
                system=SYSTEM_PROMPT,
                messages=[{
                    "role": "user",
                    "content": f"Analyse these keywords for Orion:\n\n{keyword_list}"
                }]
            )

            raw = message.content[0].text.strip()
            # Strip any accidental markdown fences
            if raw.startswith("```"):
                raw = raw.split("```")[1]
                if raw.startswith("json"):
                    raw = raw[4:]
            return json.loads(raw)

        except json.JSONDecodeError as e:
            print(f"  ⚠ JSON parse error: {e}. Returning unscored batch.")
            return [{"keyword": kw["keyword"]} for kw in batch]
        except Exception as e:
            print(f"  ⚠ Claude API error: {e}")
            return []

    def _compute_score(self, kw: dict) -> int:
        """
        Final priority score 0–100.

        Formula:
          base = normalise(volume) × 40          # up to 40 pts from volume
          + intent_weight × 20                   # up to 28 pts from intent
          + aeo_multiplier_bonus × 15            # up to 19.5 pts from AEO
          + relevance × 20                       # up to 20 pts from ICP fit
          - difficulty_penalty                   # up to -10 pts from competition
        """
        volume = kw.get("volume") or 500
        difficulty = kw.get("difficulty") or 50
        adjustments = kw.get("score_adjustments", {})

        # Volume: log scale normalised to 0–1 across 100–100k range
        volume_score = min(1.0, math.log10(max(volume, 100)) / math.log10(100_000))

        intent_weight = adjustments.get("intent_weight", 1.0)
        aeo_multiplier = adjustments.get("aeo_multiplier", 1.0)
        relevance = kw.get("relevance_to_orion", 0.5)

        # Difficulty penalty: 0 at difficulty=0, 10 at difficulty=100
        difficulty_penalty = (difficulty / 100) * 10

        # SERP features boost — if Google already shows snippets/PAA,
        # the query is AEO-ready
        serp = kw.get("serp_features", {})
        serp_boost = 5 if (serp.get("featured_snippet") or serp.get("paa")) else 0

        raw = (
            volume_score * 40
            + intent_weight * 20
            + (aeo_multiplier - 1.0) * 50  # bonus for AEO (0 or 15)
            + relevance * 20
            - difficulty_penalty
            + serp_boost
        )

        return max(0, min(100, round(raw)))
