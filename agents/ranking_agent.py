"""
Ranking + Visibility Agent — monitors Google Search Console for keyword
position changes, and tracks AEO visibility trends over time.

Inputs:
  - Google Search Console API (requires OAuth service account)
  - Previous AEO monitor outputs (tracks Orion mention rate over time)

Outputs: output/ranking_report_YYYY-MM-DD.json
"""

import os
import json
import random
from datetime import datetime, timedelta
from pathlib import Path

OUTPUT_DIR = Path(__file__).parent.parent / "output"

try:
    from google.oauth2 import service_account
    from googleapiclient.discovery import build
    GSC_AVAILABLE = True
except ImportError:
    GSC_AVAILABLE = False


class RankingAgent:
    def __init__(self, dry_run=False):
        self.dry_run = dry_run
        self.site_url = os.environ.get("GSC_SITE_URL", "https://orion.com")
        self.gsc_service = self._init_gsc() if not dry_run else None

    def run(self) -> Path:
        print("  Fetching Google Search Console data...")
        gsc_data = self._mock_gsc_data() if self.dry_run else self._fetch_gsc()

        print("  Loading AEO trend history...")
        aeo_trend = self._load_aeo_trend()

        print("  Computing deltas vs last week...")
        report = self._build_report(gsc_data, aeo_trend)

        return self._write_output(report)

    def _init_gsc(self):
        """
        Initialise Google Search Console API client.
        Requires: GSC_SERVICE_ACCOUNT_JSON env var (path to JSON key file)
        Or set up via: https://developers.google.com/webmaster-tools/v1/how-tos/authorizing
        """
        if not GSC_AVAILABLE:
            print("  ⚠ google-auth not installed. Run: pip install google-auth google-api-python-client")
            return None

        key_path = os.environ.get("GSC_SERVICE_ACCOUNT_JSON")
        if not key_path:
            print("  ⚠ GSC_SERVICE_ACCOUNT_JSON not set — falling back to mock data")
            return None

        try:
            creds = service_account.Credentials.from_service_account_file(
                key_path,
                scopes=["https://www.googleapis.com/auth/webmasters.readonly"]
            )
            return build("searchconsole", "v1", credentials=creds)
        except Exception as e:
            print(f"  ⚠ GSC auth failed: {e}")
            return None

    def _fetch_gsc(self) -> list[dict]:
        if not self.gsc_service:
            return self._mock_gsc_data()

        end_date = datetime.now().strftime("%Y-%m-%d")
        start_date = (datetime.now() - timedelta(days=28)).strftime("%Y-%m-%d")

        try:
            response = self.gsc_service.searchanalytics().query(
                siteUrl=self.site_url,
                body={
                    "startDate": start_date,
                    "endDate": end_date,
                    "dimensions": ["query", "date"],
                    "rowLimit": 500,
                    "dataState": "final",
                }
            ).execute()

            rows = response.get("rows", [])
            return [
                {
                    "keyword": r["keys"][0],
                    "date": r["keys"][1],
                    "clicks": r["clicks"],
                    "impressions": r["impressions"],
                    "position": round(r["position"], 1),
                    "ctr": round(r["ctr"] * 100, 2),
                }
                for r in rows
            ]
        except Exception as e:
            print(f"  ⚠ GSC fetch failed: {e}. Using mock data.")
            return self._mock_gsc_data()

    def _mock_gsc_data(self) -> list[dict]:
        random.seed(42)
        keywords = [
            ("value investing for beginners", 45, 1200, 3.75),
            ("how to find undervalued stocks", 38, 890, 4.27),
            ("intelligent investing platform", 12, 340, 3.53),
            ("beat the S&P 500 strategy", 28, 750, 3.73),
            ("value investing tools", 19, 520, 3.65),
            ("stock intrinsic value calculator", 8, 210, 3.81),
            ("best stock screener value investing", 31, 820, 3.78),
            ("Benjamin Graham investing method", 22, 480, 4.58),
            ("portfolio management for value investors", 15, 390, 3.85),
            ("margin of safety investing", 11, 290, 3.79),
        ]

        today = datetime.now()
        rows = []
        for kw, clicks, impressions, position in keywords:
            # Simulate 28 days of data with slight variance
            for days_ago in range(28):
                date = (today - timedelta(days=days_ago)).strftime("%Y-%m-%d")
                rows.append({
                    "keyword": kw,
                    "date": date,
                    "clicks": max(0, clicks + random.randint(-5, 8)),
                    "impressions": max(0, impressions + random.randint(-50, 80)),
                    "position": round(max(1, position + random.uniform(-0.5, 0.5)), 1),
                    "ctr": round(max(0.5, (clicks / impressions * 100) + random.uniform(-0.3, 0.3)), 2),
                })
        return rows

    def _load_aeo_trend(self) -> list[dict]:
        """Load previous AEO monitor outputs to build a trend."""
        trend = []
        for path in sorted(OUTPUT_DIR.glob("aeo_monitor_*.json"), reverse=True)[:8]:
            try:
                with open(path) as f:
                    data = json.load(f)
                trend.append({
                    "date": path.stem.replace("aeo_monitor_", ""),
                    "visibility_rate": data.get("orion_visibility_rate", 0),
                    "total_queries": data.get("total_queries", 0),
                    "orion_mentioned": data.get("orion_mentioned_count", 0),
                })
            except Exception:
                pass
        return trend

    def _build_report(self, gsc_data: list[dict], aeo_trend: list[dict]) -> dict:
        # Aggregate GSC: last 7 days vs prior 7 days
        today = datetime.now()
        last7 = (today - timedelta(days=7)).strftime("%Y-%m-%d")
        prior7_start = (today - timedelta(days=14)).strftime("%Y-%m-%d")

        def aggregate(rows, from_date, to_date):
            filtered = [r for r in rows if from_date <= r["date"] <= to_date]
            by_keyword = {}
            for r in filtered:
                kw = r["keyword"]
                if kw not in by_keyword:
                    by_keyword[kw] = {"clicks": 0, "impressions": 0, "positions": [], "ctr": []}
                by_keyword[kw]["clicks"] += r["clicks"]
                by_keyword[kw]["impressions"] += r["impressions"]
                by_keyword[kw]["positions"].append(r["position"])
                by_keyword[kw]["ctr"].append(r["ctr"])
            return {
                kw: {
                    "clicks": v["clicks"],
                    "impressions": v["impressions"],
                    "avg_position": round(sum(v["positions"]) / len(v["positions"]), 1),
                    "avg_ctr": round(sum(v["ctr"]) / len(v["ctr"]), 2),
                }
                for kw, v in by_keyword.items()
            }

        current = aggregate(gsc_data, last7, today.strftime("%Y-%m-%d"))
        previous = aggregate(gsc_data, prior7_start, last7)

        deltas = []
        for kw, curr in current.items():
            prev = previous.get(kw, {})
            click_delta = curr["clicks"] - prev.get("clicks", 0)
            pos_delta = round(curr["avg_position"] - prev.get("avg_position", curr["avg_position"]), 1)
            deltas.append({
                "keyword": kw,
                "clicks_this_week": curr["clicks"],
                "clicks_delta": click_delta,
                "impressions": curr["impressions"],
                "avg_position": curr["avg_position"],
                "position_delta": pos_delta,
                "trending": "up" if click_delta > 5 else "down" if click_delta < -5 else "stable",
            })

        deltas.sort(key=lambda x: x["clicks_this_week"], reverse=True)

        return {
            "gsc_summary": {
                "total_clicks_7d": sum(d["clicks_this_week"] for d in deltas),
                "total_impressions_7d": sum(d["impressions"] for d in deltas),
                "keywords_tracked": len(deltas),
                "rising_keywords": [d for d in deltas if d["trending"] == "up"][:5],
                "falling_keywords": [d for d in deltas if d["trending"] == "down"][:5],
                "all_keywords": deltas,
            },
            "aeo_trend": aeo_trend,
            "aeo_current_visibility": aeo_trend[0]["visibility_rate"] if aeo_trend else None,
            "alerts": self._generate_alerts(deltas, aeo_trend),
        }

    def _generate_alerts(self, deltas: list[dict], aeo_trend: list[dict]) -> list[str]:
        alerts = []
        for d in deltas:
            if d["position_delta"] > 3:
                alerts.append(f"⚠ '{d['keyword']}' dropped {d['position_delta']} positions")
            if d["position_delta"] < -3:
                alerts.append(f"✓ '{d['keyword']}' gained {abs(d['position_delta'])} positions")
        if len(aeo_trend) >= 2:
            delta = aeo_trend[0]["visibility_rate"] - aeo_trend[1]["visibility_rate"]
            if delta < -10:
                alerts.append(f"⚠ AEO visibility dropped {abs(delta):.0f}% vs last week")
            elif delta > 10:
                alerts.append(f"✓ AEO visibility up {delta:.0f}% vs last week")
        return alerts

    def _write_output(self, report: dict) -> Path:
        OUTPUT_DIR.mkdir(exist_ok=True)
        date_str = datetime.now().strftime("%Y-%m-%d")
        path = OUTPUT_DIR / f"ranking_report_{date_str}.json"
        report["generated_at"] = datetime.now().isoformat()
        with open(path, "w") as f:
            json.dump(report, f, indent=2)
        return path
