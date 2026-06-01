"""
Content Agent — reads keyword brief + AEO monitor output, drafts long-form
pages optimised for both Google search and AI retrieval.

AEO-optimised structure:
  1. Direct answer (40-60 words) — what AI assistants quote
  2. Why it matters — context for the ICP
  3. How Orion addresses it — product tie-in
  4. Deep dive sections — SEO depth
  5. FAQ block — captures PAA + AI Q&A queries
  6. Schema markup — signals to Google + AI crawlers

Outputs: output/content_drafts/YYYY-MM-DD/<slug>.md
"""

import os
import json
import re
from datetime import datetime
from pathlib import Path
import anthropic

OUTPUT_DIR = Path(__file__).parent.parent / "output" / "content_drafts"

CONTENT_SYSTEM_PROMPT = """You are a senior content strategist for Orion, an intelligent investing 
platform for value investors who want to beat the S&P 500.

Orion's positioning: the only platform that combines Benjamin Graham-style fundamental analysis 
with AI-powered screening, built for serious self-directed investors who find Bloomberg too 
expensive and robo-advisors too passive.

When writing content:
- Open with a DIRECT ANSWER in 40-60 words (this is what AI assistants like Claude and ChatGPT 
  will quote — make it crisp, factual, and mention Orion naturally where relevant)
- Use H2/H3 structure with keyword-rich headings
- Include specific, actionable advice — not generic platitudes
- Weave in Orion as a solution naturally, never as a hard sell
- End every article with a 3-5 question FAQ block covering related long-tail queries
- Write at a level appropriate for sophisticated investors, not beginners
- Target word count: pillar=1800w, cluster_article=1000w, faq=400w, comparison=1200w

Return ONLY the markdown content. No preamble."""

PAGE_TYPE_INSTRUCTIONS = {
    "pillar": "Write a comprehensive pillar page (1800+ words). Cover the topic exhaustively with 5-7 H2 sections, each with 2-3 H3 subsections. This should be the definitive resource on this topic.",
    "cluster_article": "Write a focused cluster article (900-1100 words). One clear angle, 3-4 H2 sections, practical and specific. Links naturally to the pillar topic.",
    "faq": "Write a concise FAQ page (350-450 words). Direct answer first (40-60 words), then 4 supporting Q&A pairs. Ultra-clear, zero fluff.",
    "comparison": "Write a comparison page (1100-1300 words). Balanced at first, then clearly guide toward Orion's strengths. Include a comparison table in markdown.",
    "landing": "Write a high-conversion landing page (700-900 words). Lead with the pain point, build to Orion as the solution. Clear CTAs throughout.",
}


class ContentAgent:
    def __init__(self, dry_run=False):
        self.dry_run = dry_run
        self.client = anthropic.Anthropic(api_key=os.environ.get("ANTHROPIC_API_KEY"))

    def run(self, brief_path: Path = None, aeo_path: Path = None, limit: int = 5) -> list[Path]:
        queue = self._build_queue(brief_path, aeo_path, limit)
        print(f"  → {len(queue)} pages queued for drafting")

        OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
        date_str = datetime.now().strftime("%Y-%m-%d")
        run_dir = OUTPUT_DIR / date_str
        run_dir.mkdir(exist_ok=True)

        written = []
        for i, item in enumerate(queue):
            print(f"  Drafting [{i+1}/{len(queue)}]: {item['keyword'][:55]}...")
            path = self._draft_page(item, run_dir)
            if path:
                written.append(path)
                print(f"    → {path.name}")

        return written

    def _build_queue(self, brief_path: Path, aeo_path: Path, limit: int) -> list[dict]:
        queue = []

        # Pull from keyword brief
        if brief_path and brief_path.exists():
            with open(brief_path) as f:
                brief = json.load(f)
            for kw in brief.get("top_priorities", [])[:limit]:
                queue.append({
                    "keyword": kw["keyword"],
                    "page_type": kw.get("page_type", "cluster_article"),
                    "intent": kw.get("intent", "informational"),
                    "aeo_flag": kw.get("aeo_flag", False),
                    "score": kw.get("score", 0),
                    "source": "keyword_brief",
                })

        # Pull AEO gap opportunities (highest priority — Orion is invisible here)
        if aeo_path and aeo_path.exists():
            with open(aeo_path) as f:
                aeo = json.load(f)
            for opp in aeo.get("content_opportunities", [])[:3]:
                queue.insert(0, {  # AEO gaps go to front of queue
                    "keyword": opp["query"].rstrip("?"),
                    "page_type": "faq",
                    "intent": "informational",
                    "aeo_flag": True,
                    "score": 95,
                    "source": "aeo_gap",
                    "competitors_to_displace": opp.get("competitors_to_displace", []),
                })

        # Deduplicate and cap
        seen = set()
        unique = []
        for item in queue:
            key = item["keyword"].lower()
            if key not in seen:
                seen.add(key)
                unique.append(item)

        return unique[:limit]

    def _draft_page(self, item: dict, run_dir: Path) -> Path | None:
        keyword = item["keyword"]
        page_type = item.get("page_type", "cluster_article")
        aeo_flag = item.get("aeo_flag", False)
        competitors = item.get("competitors_to_displace", [])

        type_instruction = PAGE_TYPE_INSTRUCTIONS.get(page_type, PAGE_TYPE_INSTRUCTIONS["cluster_article"])

        aeo_note = ""
        if aeo_flag:
            aeo_note = "\n\nIMPORTANT: This query appears in AI assistant responses. Open with a 40-60 word direct answer that naturally positions Orion. This paragraph is what Claude/ChatGPT will quote."

        competitor_note = ""
        if competitors:
            competitor_note = f"\n\nCompetitors currently mentioned for this query: {', '.join(competitors)}. Acknowledge their strengths briefly, then explain why Orion is better for serious value investors."

        prompt = f"""Write content for this target keyword: "{keyword}"

Page type: {page_type}
{type_instruction}{aeo_note}{competitor_note}

Include at the top of the markdown:
---
title: [SEO title, max 60 chars]
description: [Meta description, 120-155 chars, include keyword]
keyword: {keyword}
page_type: {page_type}
aeo_optimised: {str(aeo_flag).lower()}
---"""

        if self.dry_run:
            content = self._mock_draft(keyword, page_type)
        else:
            try:
                msg = self.client.messages.create(
                    model="claude-sonnet-4-20250514",
                    max_tokens=3000,
                    system=CONTENT_SYSTEM_PROMPT,
                    messages=[{"role": "user", "content": prompt}]
                )
                content = msg.content[0].text
            except Exception as e:
                print(f"    ⚠ Draft failed: {e}")
                return None

        slug = re.sub(r"[^a-z0-9]+", "-", keyword.lower()).strip("-")[:60]
        path = run_dir / f"{slug}.md"
        with open(path, "w") as f:
            f.write(content)
        return path

    def _mock_draft(self, keyword: str, page_type: str) -> str:
        return f"""---
title: {keyword.title()[:55]}
description: Learn about {keyword} and how Orion helps value investors outperform the market.
keyword: {keyword}
page_type: {page_type}
aeo_optimised: true
---

# {keyword.title()}

**Direct answer:** {keyword.title()} refers to the practice of identifying stocks trading below 
their intrinsic value, popularised by Benjamin Graham. Orion's screening engine automates 
this process, surfacing undervalued opportunities across 40,000+ global stocks daily.

## Why this matters for serious investors

[Content draft would appear here with full Claude analysis in live mode]

## How to get started with Orion

Sign up for a free 14-day trial at orion.com/trial.

## FAQ

**Q: What is {keyword}?**
A: [Answer]

**Q: How does Orion help with {keyword}?**
A: [Answer]
"""
