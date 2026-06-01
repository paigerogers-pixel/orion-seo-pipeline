"""
KeywordFetcher — Phase 1a
Pulls search volume, difficulty, and SERP feature data for seed keywords.

Supported backends (set KEYWORD_BACKEND env var):
  - serpapi     → requires SERPAPI_KEY
  - dataforseo  → requires DATAFORSEO_LOGIN + DATAFORSEO_PASSWORD
  - mock        → no API key needed, returns realistic fake data
"""

import os
import json
import random
import requests
import base64
from typing import Any


MOCK_VOLUME_RANGES = {
    "head": (10_000, 90_000),
    "torso": (1_000, 9_999),
    "tail": (100, 999),
}


class KeywordFetcher:
    def __init__(self, dry_run: bool = False):
        self.backend = "mock" if dry_run else os.getenv("KEYWORD_BACKEND", "mock")
        self.serpapi_key = os.getenv("SERPAPI_KEY")
        self.dataforseo_login = os.getenv("DATAFORSEO_LOGIN")
        self.dataforseo_password = os.getenv("DATAFORSEO_PASSWORD")

    def fetch(self, seeds: list[str]) -> list[dict]:
        if self.backend == "serpapi":
            return self._fetch_serpapi(seeds)
        elif self.backend == "dataforseo":
            return self._fetch_dataforseo(seeds)
        else:
            return self._mock_data(seeds)

    # ─── SerpAPI ────────────────────────────────────────────────────────────

    def _fetch_serpapi(self, seeds: list[str]) -> list[dict]:
        """
        Uses SerpAPI Google Autocomplete + Related Searches to expand seeds,
        then fetches volume estimates via the Keywords API endpoint.
        """
        if not self.serpapi_key:
            raise ValueError("Set SERPAPI_KEY environment variable")

        results = []
        for seed in seeds:
            # Autocomplete expansion
            resp = requests.get("https://serpapi.com/search", params={
                "engine": "google_autocomplete",
                "q": seed,
                "api_key": self.serpapi_key,
            })
            data = resp.json()
            suggestions = [s["value"] for s in data.get("suggestions", [])]

            # Related searches from a real SERP
            serp_resp = requests.get("https://serpapi.com/search", params={
                "engine": "google",
                "q": seed,
                "api_key": self.serpapi_key,
                "num": 10,
            })
            serp_data = serp_resp.json()
            related = [r["query"] for r in serp_data.get("related_searches", [])]
            paa = [p["question"] for p in serp_data.get("related_questions", [])]

            # Has featured snippet? PAA? — these are AEO signals
            has_snippet = "answer_box" in serp_data
            has_paa = len(paa) > 0

            # Combine and dedup
            all_terms = list({seed, *suggestions[:5], *related[:5], *paa[:5]})

            for term in all_terms:
                results.append({
                    "keyword": term,
                    "volume": None,         # SerpAPI free tier lacks volume
                    "difficulty": None,
                    "serp_features": {
                        "featured_snippet": has_snippet if term == seed else None,
                        "paa": has_paa if term == seed else None,
                    },
                    "source": "serpapi",
                })

        return self._deduplicate(results)

    # ─── DataForSEO ─────────────────────────────────────────────────────────

    def _fetch_dataforseo(self, seeds: list[str]) -> list[dict]:
        """
        DataForSEO Keywords Data API — returns volume, CPC, competition,
        and SERP features. Most cost-effective at scale ($0.002 per keyword).
        """
        if not self.dataforseo_login or not self.dataforseo_password:
            raise ValueError("Set DATAFORSEO_LOGIN and DATAFORSEO_PASSWORD")

        creds = base64.b64encode(
            f"{self.dataforseo_login}:{self.dataforseo_password}".encode()
        ).decode()
        headers = {
            "Authorization": f"Basic {creds}",
            "Content-Type": "application/json",
        }

        # Batch seeds into groups of 100 (API limit)
        batches = [seeds[i:i+100] for i in range(0, len(seeds), 100)]
        results = []

        for batch in batches:
            payload = [{
                "keywords": batch,
                "language_name": "English",
                "location_name": "Canada",   # Change to your primary market
            }]
            resp = requests.post(
                "https://api.dataforseo.com/v3/keywords_data/google_ads/search_volume/live",
                headers=headers,
                json=payload,
            )
            data = resp.json()

            for item in data.get("tasks", [{}])[0].get("result", []):
                results.append({
                    "keyword": item["keyword"],
                    "volume": item.get("search_volume", 0),
                    "difficulty": item.get("competition_index"),  # 0–100
                    "cpc": item.get("cpc"),
                    "serp_features": {},
                    "source": "dataforseo",
                })

        return self._deduplicate(results)

    # ─── Mock data ──────────────────────────────────────────────────────────

    def _mock_data(self, seeds: list[str]) -> list[dict]:
        """Realistic mock data for development and testing."""
        random.seed(42)
        results = []

        expansions = {
            "intelligent investing": [
                "what is intelligent investing",
                "intelligent investing platform",
                "intelligent investor book",
                "AI-powered investing tools",
            ],
            "beat the S&P 500": [
                "how to beat the S&P 500 consistently",
                "stocks that beat the S&P 500",
                "can you beat the S&P 500 long term",
                "beat S&P 500 with value stocks",
            ],
            "value investing": [
                "value investing strategy",
                "value investing vs growth investing",
                "value investing stocks to buy",
                "how to find undervalued stocks",
                "value investing for beginners 2024",
            ],
        }

        for seed in seeds:
            terms = [seed] + expansions.get(seed, [])
            for term in terms:
                # Longer, question-form queries get tail volume
                word_count = len(term.split())
                if word_count <= 3:
                    vol_range = MOCK_VOLUME_RANGES["head"]
                elif word_count <= 5:
                    vol_range = MOCK_VOLUME_RANGES["torso"]
                else:
                    vol_range = MOCK_VOLUME_RANGES["tail"]

                results.append({
                    "keyword": term,
                    "volume": random.randint(*vol_range),
                    "difficulty": random.randint(20, 80),
                    "serp_features": {
                        "featured_snippet": word_count > 4 and random.random() > 0.5,
                        "paa": word_count > 4 and random.random() > 0.4,
                    },
                    "source": "mock",
                })

        return self._deduplicate(results)

    # ─── Utils ──────────────────────────────────────────────────────────────

    def _deduplicate(self, keywords: list[dict]) -> list[dict]:
        seen = set()
        unique = []
        for kw in keywords:
            key = kw["keyword"].lower().strip()
            if key not in seen:
                seen.add(key)
                unique.append(kw)
        return unique
