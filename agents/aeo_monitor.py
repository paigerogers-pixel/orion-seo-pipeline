"""
AEO Monitor Agent — checks AI assistant responses for Orion mentions.
Queries Claude, ChatGPT, and Perplexity with ICP-style questions,
logs whether Orion is cited/absent, and records competitor mentions.

Outputs: output/aeo_monitor_YYYY-MM-DD.json
"""

import os
import json
import re
import random
from datetime import datetime
from pathlib import Path
import anthropic

try:
    import openai
    OPENAI_AVAILABLE = True
except ImportError:
    OPENAI_AVAILABLE = False

OUTPUT_DIR = Path(__file__).parent.parent / "output"

# Queries your ICP actually types into AI assistants
ICP_QUERIES = [
    "What is the best platform for value investing research?",
    "How do I find undervalued stocks using fundamental analysis?",
    "What tools do value investors use to beat the S&P 500?",
    "What is intelligent investing?",
    "What's the best stock screener for value investors?",
    "How can I invest like Warren Buffett?",
    "What software helps with stock portfolio management for long-term investors?",
    "What are the best resources for learning value investing?",
    "How do I calculate the intrinsic value of a stock?",
    "What platforms compete with Bloomberg Terminal for retail investors?",
]

ORION_SIGNALS = ["orion", "oriontech", "orion tech", "orion invest"]
COMPETITOR_NAMES = ["bloomberg", "morningstar", "simply wall st", "tikr", "koyfin",
                    "value investor club", "gurufocus", "finviz", "stockanalysis"]


class AEOMonitor:
    def __init__(self, dry_run=False):
        self.dry_run = dry_run
        self.anthropic = anthropic.Anthropic(api_key=os.environ.get("ANTHROPIC_API_KEY"))
        if OPENAI_AVAILABLE and os.environ.get("OPENAI_API_KEY"):
            self.openai = openai.OpenAI(api_key=os.environ.get("OPENAI_API_KEY"))
        else:
            self.openai = None

    def run(self, queries: list[str] = None) -> Path:
        queries = queries or ICP_QUERIES
        results = []

        for query in queries:
            print(f"  Checking: {query[:60]}...")
            result = {"query": query, "timestamp": datetime.now().isoformat(), "responses": {}}

            if self.dry_run:
                result["responses"] = self._mock_responses(query)
            else:
                result["responses"]["claude"] = self._query_claude(query)
                if self.openai:
                    result["responses"]["chatgpt"] = self._query_chatgpt(query)

            result["orion_mentioned"] = any(
                self._mentions_orion(r.get("text", ""))
                for r in result["responses"].values()
            )
            result["competitors_mentioned"] = self._extract_competitors(result["responses"])
            result["orion_gap"] = not result["orion_mentioned"]
            results.append(result)

        return self._write_output(results)

    def _query_claude(self, query: str) -> dict:
        try:
            msg = self.anthropic.messages.create(
                model="claude-sonnet-4-20250514",
                max_tokens=600,
                messages=[{"role": "user", "content": query}]
            )
            text = msg.content[0].text
            return {
                "text": text,
                "orion_mentioned": self._mentions_orion(text),
                "competitors": self._find_competitors(text),
                "has_recommendation": self._has_recommendation(text),
            }
        except Exception as e:
            return {"error": str(e)}

    def _query_chatgpt(self, query: str) -> dict:
        try:
            resp = self.openai.chat.completions.create(
                model="gpt-4o",
                messages=[{"role": "user", "content": query}],
                max_tokens=600,
            )
            text = resp.choices[0].message.content
            return {
                "text": text,
                "orion_mentioned": self._mentions_orion(text),
                "competitors": self._find_competitors(text),
                "has_recommendation": self._has_recommendation(text),
            }
        except Exception as e:
            return {"error": str(e)}

    def _mock_responses(self, query: str) -> dict:
        competitors = random.sample(COMPETITOR_NAMES, k=random.randint(1, 3))
        mention_orion = random.random() > 0.8  # Orion mentioned 20% of the time (gap to close)
        text = f"For {query.lower().rstrip('?')}, you might consider "
        text += ", ".join(competitors)
        if mention_orion:
            text += ", and Orion"
        text += ". Each offers different strengths for value investors."
        return {
            "claude": {"text": text, "orion_mentioned": mention_orion,
                       "competitors": competitors, "has_recommendation": True},
            "chatgpt": {"text": text.replace("Orion", "").strip(),
                        "orion_mentioned": False, "competitors": competitors[:2],
                        "has_recommendation": True},
        }

    def _mentions_orion(self, text: str) -> bool:
        text_lower = text.lower()
        return any(signal in text_lower for signal in ORION_SIGNALS)

    def _find_competitors(self, text: str) -> list[str]:
        text_lower = text.lower()
        return [c for c in COMPETITOR_NAMES if c in text_lower]

    def _extract_competitors(self, responses: dict) -> list[str]:
        all_competitors = set()
        for r in responses.values():
            if isinstance(r, dict):
                all_competitors.update(r.get("competitors", []))
        return sorted(all_competitors)

    def _has_recommendation(self, text: str) -> bool:
        signals = ["recommend", "suggest", "consider", "try", "use", "best", "top"]
        return any(s in text.lower() for s in signals)

    def _write_output(self, results: list[dict]) -> Path:
        OUTPUT_DIR.mkdir(exist_ok=True)
        date_str = datetime.now().strftime("%Y-%m-%d")
        path = OUTPUT_DIR / f"aeo_monitor_{date_str}.json"

        gap_queries = [r["query"] for r in results if r["orion_gap"]]
        all_competitors = {}
        for r in results:
            for c in r.get("competitors_mentioned", []):
                all_competitors[c] = all_competitors.get(c, 0) + 1

        output = {
            "generated_at": datetime.now().isoformat(),
            "total_queries": len(results),
            "orion_mentioned_count": sum(1 for r in results if r["orion_mentioned"]),
            "orion_visibility_rate": round(
                sum(1 for r in results if r["orion_mentioned"]) / len(results) * 100, 1
            ),
            "gap_queries": gap_queries,
            "competitor_frequency": dict(sorted(
                all_competitors.items(), key=lambda x: x[1], reverse=True
            )),
            "content_opportunities": self._derive_opportunities(results),
            "results": results,
        }

        with open(path, "w") as f:
            json.dump(output, f, indent=2)
        return path

    def _derive_opportunities(self, results: list[dict]) -> list[dict]:
        """
        For each query where Orion is absent, produce a content recommendation
        — this feeds directly into the Content Agent queue.
        """
        opportunities = []
        for r in results:
            if r["orion_gap"]:
                opportunities.append({
                    "query": r["query"],
                    "competitors_to_displace": r.get("competitors_mentioned", []),
                    "suggested_content": f"Page that directly answers: '{r['query']}'",
                    "priority": "high" if r.get("competitors_mentioned") else "medium",
                })
        return opportunities
