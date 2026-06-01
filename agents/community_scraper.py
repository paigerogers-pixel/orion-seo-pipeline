"""
CommunityScraper — Phase 1b
Extracts natural ICP language from Reddit and finance communities.
These phrases are gold for AEO — they're exactly how your ICP talks to AI assistants.

Subreddits to scrape:
  r/ValueInvesting, r/investing, r/personalfinance, r/stocks, r/Bogleheads
"""

import os
import re
import random
import requests
from collections import Counter


TARGET_SUBREDDITS = [
    "ValueInvesting",
    "investing",
    "personalfinance",
    "stocks",
    "Bogleheads",
]

# Posts/comments that match these patterns often map to high-intent queries
QUESTION_PATTERNS = [
    r"how (do|can|should|to) .{5,60}\?",
    r"what (is|are|the best) .{5,60}\?",
    r"(best|top|recommended) .{5,40} (for|to) .{5,40}",
    r"(looking for|trying to find|need) .{5,60}",
    r"(vs|versus|or) .{3,30} (which|what)",
]


class CommunityScraper:
    def __init__(self, dry_run: bool = False):
        self.dry_run = dry_run
        self.headers = {"User-Agent": "OrionResearchAgent/1.0"}

    def scrape(self, seeds: list[str]) -> list[dict]:
        if self.dry_run:
            return self._mock_community_terms(seeds)

        results = []
        for subreddit in TARGET_SUBREDDITS[:3]:  # limit API calls
            posts = self._fetch_hot_posts(subreddit, limit=25)
            phrases = self._extract_phrases(posts, seeds)
            results.extend(phrases)

        return results

    # ─── Reddit API (no auth needed for public read) ─────────────────────

    def _fetch_hot_posts(self, subreddit: str, limit: int = 25) -> list[dict]:
        """
        Reddit's public JSON API — no auth needed for read-only access.
        Rate limited to ~60 req/min. Add REDDIT_CLIENT_ID + SECRET for higher limits.
        """
        url = f"https://www.reddit.com/r/{subreddit}/hot.json"
        try:
            resp = requests.get(url, headers=self.headers, params={"limit": limit}, timeout=10)
            data = resp.json()
            posts = data.get("data", {}).get("children", [])
            return [p["data"] for p in posts]
        except Exception as e:
            print(f"  ⚠ Reddit fetch failed for r/{subreddit}: {e}")
            return []

    def _extract_phrases(self, posts: list[dict], seeds: list[str]) -> list[dict]:
        """
        Extract question phrases from post titles + top comments.
        Filter to posts that are topically relevant to seed keywords.
        """
        seed_words = set(w.lower() for s in seeds for w in s.split())
        results = []

        for post in posts:
            title = post.get("title", "")
            text = post.get("selftext", "")
            combined = f"{title} {text}".lower()

            # Only process posts related to our topic
            if not any(word in combined for word in seed_words):
                continue

            # Extract question-pattern phrases from title
            for pattern in QUESTION_PATTERNS:
                matches = re.findall(pattern, combined, re.IGNORECASE)
                for match in matches:
                    phrase = match if isinstance(match, str) else " ".join(match)
                    phrase = phrase.strip().rstrip("?").lower()
                    if 4 <= len(phrase.split()) <= 10:
                        results.append({
                            "keyword": phrase,
                            "volume": None,       # no volume data from Reddit
                            "difficulty": None,
                            "source": "reddit",
                            "subreddit": post.get("subreddit"),
                            "upvotes": post.get("score", 0),
                            "serp_features": {"paa": True},  # question-form = AEO candidate
                        })

        return results

    # ─── Mock data ───────────────────────────────────────────────────────

    def _mock_community_terms(self, seeds: list[str]) -> list[dict]:
        """Real-sounding ICP phrases from finance communities."""
        mock_phrases = [
            "how do I find undervalued stocks before everyone else",
            "what tools do value investors actually use",
            "how to tell if a stock is undervalued or a value trap",
            "is it possible to consistently beat the S&P 500",
            "best screener for finding value stocks",
            "how to research a company like Warren Buffett",
            "what does a margin of safety mean in investing",
            "how long does value investing take to pay off",
            "value investing vs index funds which is better long term",
            "what financial ratios matter most for value investors",
            "how to build a concentrated value portfolio",
            "when should you sell a value stock",
            "how to calculate intrinsic value of a stock",
            "is value investing dead in today's market",
            "what software do professional investors use for research",
        ]

        return [
            {
                "keyword": phrase,
                "volume": random.randint(100, 2000),
                "difficulty": random.randint(10, 45),  # community terms easier to rank
                "source": "reddit_mock",
                "subreddit": random.choice(TARGET_SUBREDDITS),
                "upvotes": random.randint(50, 500),
                "serp_features": {"paa": True},
            }
            for phrase in mock_phrases
        ]
