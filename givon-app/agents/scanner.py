"""
סוכן סריקה — Givon Defense Intelligence Scanner
סורק את כל המקורות ומחזיר רשימת פריטים גולמיים לניתוח
"""

import requests
import feedparser
import json
import time
import os
from datetime import datetime, timedelta
from typing import Optional
import xml.etree.ElementTree as ET

HEADERS = {
    "User-Agent": "Mozilla/5.0 (compatible; GivonIntelBot/1.0)"
}

def log(msg):
    print(f"[{datetime.now().strftime('%H:%M:%S')}] {msg}")

# ─── TIER 1: APIs רשמיות ────────────────────────────────────────────────────

def scan_sam_gov() -> list:
    """SAM.gov — מכרזי DoD דרך API רשמי"""
    log("סורק SAM.gov...")
    items = []
    try:
        api_key = os.environ.get("SAM_GOV_API_KEY", "DEMO_KEY")
        url = "https://api.sam.gov/prod/opportunities/v2/search"
        params = {
            "api_key": api_key,
            "limit": 20,
            "postedFrom": (datetime.now() - timedelta(days=30)).strftime("%m/%d/%Y"),
            "postedTo": datetime.now().strftime("%m/%d/%Y"),
            "ptype": "o,p,k",
            "ncode": "336414,336413,334511,334220",
        }
        resp = requests.get(url, params=params, headers=HEADERS, timeout=15)
        if resp.status_code == 200:
            data = resp.json()
            for opp in data.get("opportunitiesData", []):
                items.append({
                    "source": "SAM.gov",
                    "source_tier": 1,
                    "url": f"https://sam.gov/opp/{opp.get('noticeId', '')}/view",
                    "title": opp.get("title", ""),
                    "org": opp.get("fullParentPathName", opp.get("departmentName", "")),
                    "country": "ארה״ב",
                    "flag": "🇺🇸",
                    "description": opp.get("description", "")[:500],
                    "deadline": opp.get("responseDeadLine", ""),
                    "posted": opp.get("postedDate", ""),
                    "type": opp.get("baseType", ""),
                    "raw": opp,
                })
            log(f"  SAM.gov: {len(items)} פריטים")
        else:
            log(f"  SAM.gov: status {resp.status_code}")
    except Exception as e:
        log(f"  SAM.gov שגיאה: {e}")
    return items


def scan_sbir_gov() -> list:
    """DoD SBIR/STTR — API רשמי"""
    log("סורק SBIR.gov...")
    items = []
    try:
        url = "https://api.sbir.gov/solicitations"
        params = {"agency": "DOD", "open": True, "rows": 20}
        resp = requests.get(url, params=params, headers=HEADERS, timeout=15)
        if resp.status_code == 200:
            data = resp.json()
            for sol in data.get("docs", []):
                items.append({
                    "source": "DoD SBIR/STTR",
                    "source_tier": 1,
                    "url": sol.get("solicitation_topics_url", "https://sbir.defensesbirsttr.mil"),
                    "title": sol.get("program_title", ""),
                    "org": sol.get("agency", "DoD"),
                    "country": "ארה״ב",
                    "flag": "🇺🇸",
                    "description": sol.get("program_description", "")[:500],
                    "deadline": sol.get("close_date", ""),
                    "posted": sol.get("open_date", ""),
                    "type": sol.get("program", "SBIR"),
                    "raw": sol,
                })
            log(f"  SBIR: {len(items)} פריטים")
    except Exception as e:
        log(f"  SBIR שגיאה: {e}")
    return items


def scan_edf() -> list:
    log("סורק European Defence Fund...")
    items = []
    try:
        feed = feedparser.parse(
            "https://defence-industry-space.ec.europa.eu/funding-tenders/european-defence-fund_en.rss"
        )
        for entry in feed.entries[:10]:
            items.append({
                "source": "European Defence Fund",
                "source_tier": 1,
                "url": entry.get("link", ""),
                "title": entry.get("title", ""),
                "org": "European Defence Fund",
                "country": "אירופה",
                "flag": "🇪🇺",
                "description": entry.get("summary", "")[:500],
                "deadline": "",
                "posted": entry.get("published", ""),
                "type": "EDF",
                "raw": {},
            })
        log(f"  European Defence Fund: {len(items)} פריטים")
    except Exception as e:
        log(f"  EDF שגיאה: {e}")
    return items


def scan_nato_diana() -> list:
    log("סורק NATO DIANA...")
    items = []
    try:
        feed = feedparser.parse("https://www.diana.nato.int/rss.xml")
        for entry in feed.entries[:10]:
            items.append({
                "source": "NATO DIANA",
                "source_tier": 1,
                "url": entry.get("link", ""),
                "title": entry.get("title", ""),
                "org": "NATO DIANA",
                "country": "נאט״ו",
                "flag": "🏛️",
                "description": entry.get("summary", "")[:500],
                "deadline": "",
                "posted": entry.get("published", ""),
                "type": "Challenge",
                "raw": {},
            })
        log(f"  NATO DIANA: {len(items)} פריטים")
    except Exception as e:
        log(f"  NATO DIANA שגיאה: {e}")
    return items


def scan_uk_dasa() -> list:
    log("סורק UK DASA...")
    items = []
    try:
        feed = feedparser.parse("https://www.ukdasa.com/opportunities/feed/")
        for entry in feed.entries[:10]:
            items.append({
                "source": "UK DASA",
                "source_tier": 1,
                "url": entry.get("link", ""),
                "title": entry.get("title", ""),
                "org": "UK Defence & Security Accelerator",
                "country": "בריטניה",
                "flag": "🇬🇧",
                "description": entry.get("summary", "")[:500],
                "deadline": "",
                "posted": entry.get("published", ""),
                "type": "DASA",
                "raw": {},
            })
        log(f"  UK DASA: {len(items)} פריטים")
    except Exception as e:
        log(f"  UK DASA שגיאה: {e}")
    return items


def scan_horizon_europe() -> list:
    log("סורק Horizon Europe...")
    items = []
    try:
        url = "https://api.tech.ec.europa.eu/search-api/prod/rest/search"
        params = {
            "apiKey": "SEDIA",
            "text": "defence security dual-use",
            "pageSize": 10,
            "frameworkProgramme": "HORIZON",
        }
        resp = requests.get(url, params=params, headers=HEADERS, timeout=15)
        if resp.status_code == 200:
            data = resp.json()
            for result in data.get("results", []):
                md = result.get("metadata", {})
                items.append({
                    "source": "Horizon Europe",
                    "source_tier": 1,
                    "url": result.get("url", ""),
                    "title": result.get("title", ""),
                    "org": "European Commission",
                    "country": "אירופה",
                    "flag": "🇪🇺",
                    "description": result.get("excerpt", "")[:500],
                    "deadline": md.get("deadlineDate", [""])[0] if md.get("deadlineDate") else "",
                    "posted": md.get("startDate", [""])[0] if md.get("startDate") else "",
                    "type": "Horizon Europe",
                    "raw": {},
                })
        log(f"  Horizon Europe: {len(items)} פריטים")
    except Exception as e:
        log(f"  Horizon Europe שגיאה: {e}")
    return items


def scan_afwerx() -> list:
    log("סורק AFWERX...")
    items = []
    try:
        feed = feedparser.parse("https://afwerx.com/feed/")
        for entry in feed.entries[:10]:
            items.append({
                "source": "AFWERX",
                "source_tier": 1,
                "url": entry.get("link", ""),
                "title": entry.get("title", ""),
                "org": "AFWERX / USAF",
                "country": "ארה״ב",
                "flag": "🇺🇸",
                "description": entry.get("summary", "")[:500],
                "deadline": "",
                "posted": entry.get("published", ""),
                "type": "AFWERX",
                "raw": {},
            })
        log(f"  AFWERX: {len(items)} פריטים")
    except Exception as e:
        log(f"  AFWERX שגיאה: {e}")
    return items


# ─── RSS גנרי ────────────────────────────────────────────────────────────────

def scan_rss_source(name: str, url: str, org: str, country: str, flag: str, type_: str, tier: int = 2) -> list:
    log(f"סורק {name}...")
    items = []
    try:
        feed = feedparser.parse(url)
        for entry in feed.entries[:8]:
            items.append({
                "source": name,
                "source_tier": tier,
                "url": entry.get("link", url),
                "title": entry.get("title", ""),
                "org": org,
                "country": country,
                "flag": flag,
                "description": entry.get("summary", "")[:500],
                "deadline": "",
                "posted": entry.get("published", ""),
                "type": type_,
                "raw": {},
            })
        log(f"  {name}: {len(items)} פריטים")
    except Exception as e:
        log(f"  {name} שגיאה: {e}")
    return items


# ─── Runner ──────────────────────────────────────────────────────────────────

def load_sources(path: str = "sources.json") -> dict:
    try:
        with open(path, "r", encoding="utf-8") as f:
            return json.load(f)
    except FileNotFoundError:
        log(f"⚠️  {path} לא נמצא")
        return {}


def run_all_scans(sources_path: str = "sources.json") -> list:
    sources = load_sources(sources_path)
    all_items = []

    log(f"טוען מקורות מ-{sources_path}...")

    # ─ APIs ידועות ─
    api_handlers = {
        "sam_gov":    scan_sam_gov,
        "sbir_gov":   scan_sbir_gov,
        "edf":        scan_edf,
        "nato_diana": scan_nato_diana,
        "uk_dasa":    scan_uk_dasa,
        "eu_funding": scan_horizon_europe,
        "afwerx":     scan_afwerx,
    }

    for source in sources.get("tier1_apis", []):
        if not source.get("active", True):
            continue
        handler = api_handlers.get(source["id"])
        if handler:
            all_items += handler()
            time.sleep(1)

    # ─ RSS — כל הקבוצות הנכונות לפי sources.json ─
    rss_tier_keys = [
        ("tier1_rss",                  1),
        ("tier2_procurement",          2),
        ("tier2_vc_defense",           2),
        ("tier2_civil_infrastructure", 2),
        ("tier3_industry_signals",     3),
    ]

    for tier_key, tier_num in rss_tier_keys:
        for source in sources.get(tier_key, []):
            if not source.get("active", True):
                log(f"  ⏭ מדולג: {source['name']}")
                continue
            # מקורות עם type מיוחד
            src_type = source.get("type", tier_key)
            if src_type in ("api", "sam_search"):
                # טיפול מיוחד ב-SAM search
                if source.get("id") == "socom_sam":
                    all_items += scan_sam_gov()  # ישתמש ב-API הרגיל
                continue
            all_items += scan_rss_source(
                name    = source["name"],
                url     = source["url"],
                org     = source["name"],
                country = source.get("country", "גלובלי"),
                flag    = source.get("flag", "🌐"),
                type_   = src_type,
                tier    = tier_num,
            )
            time.sleep(0.4)

    # ─ LinkedIn manual ─
    linkedin_items = []
    for source in sources.get("manual_linkedin", []):
        if source.get("active", True):
            linkedin_items.append({
                "source": "LinkedIn", "source_tier": 1,
                "url": source["url"],
                "title": f"[LinkedIn] {source['name']} — בדיקה ידנית נדרשת",
                "org": source["name"], "country": "גלובלי", "flag": "💼",
                "description": f"יש לבדוק ידנית את דף LinkedIn של {source['name']}.",
                "deadline": "", "posted": datetime.now().isoformat(),
                "type": "LinkedIn", "manual_check": True, "raw": {},
            })
    all_items += linkedin_items

    log(f"\nסה״כ: {len(all_items)} פריטים גולמיים נסרקו ({len(linkedin_items)} LinkedIn ידני)")
    return all_items


if __name__ == "__main__":
    items = run_all_scans()
    with open("raw_scan.json", "w", encoding="utf-8") as f:
        json.dump(items, f, ensure_ascii=False, indent=2, default=str)
    log(f"נשמר ל-raw_scan.json")
