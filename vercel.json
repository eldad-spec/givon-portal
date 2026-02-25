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
        # API key נדרש — חינמי ב-sam.gov/api
        api_key = os.environ.get("SAM_GOV_API_KEY", "DEMO_KEY")  # הגדר: export SAM_GOV_API_KEY="your-key"
        url = "https://api.sam.gov/opportunities/v2/search"
        params = {
            "api_key": api_key,
            "limit": 20,
            "postedFrom": (datetime.now() - timedelta(days=14)).strftime("%m/%d/%Y"),
            "postedTo": datetime.now().strftime("%m/%d/%Y"),
            "ptype": "o,p,k",  # solicitation types
            "ncode": "336414,336413,334511,334220",  # NAICS codes: aerospace, defense electronics
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
    except Exception as e:
        log(f"  SAM.gov שגיאה: {e}")
    return items


def scan_sbir_gov() -> list:
    """DoD SBIR/STTR — API רשמי"""
    log("סורק SBIR.gov...")
    items = []
    try:
        url = "https://api.sbir.gov/solicitations"
        params = {
            "agency": "DOD",
            "open": True,
            "rows": 20,
        }
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
    """European Defence Fund — RSS + scraping"""
    log("סורק EDF...")
    items = []
    try:
        # EDF Funding portal RSS
        feed = feedparser.parse(
            "https://defence-industry-space.ec.europa.eu/funding-tenders/european-defence-fund_en.rss"
        )
        for entry in feed.entries[:10]:
            items.append({
                "source": "European Defence Fund",
                "source_tier": 1,
                "url": entry.get("link", "https://defence-industry-space.ec.europa.eu"),
                "title": entry.get("title", ""),
                "org": "European Defence Fund",
                "country": "אירופה",
                "flag": "🇪🇺",
                "description": entry.get("summary", "")[:500],
                "deadline": "",
                "posted": entry.get("published", ""),
                "type": "EDF",
                "raw": dict(entry),
            })
        log(f"  EDF: {len(items)} פריטים")
    except Exception as e:
        log(f"  EDF שגיאה: {e}")
    return items


def scan_nato_diana() -> list:
    """NATO DIANA — challenges page"""
    log("סורק NATO DIANA...")
    items = []
    try:
        feed = feedparser.parse("https://www.diana.nato.int/rss.xml")
        for entry in feed.entries[:10]:
            items.append({
                "source": "NATO DIANA",
                "source_tier": 1,
                "url": entry.get("link", "https://www.diana.nato.int"),
                "title": entry.get("title", ""),
                "org": "NATO DIANA",
                "country": "נאט״ו",
                "flag": "🏛️",
                "description": entry.get("summary", "")[:500],
                "deadline": "",
                "posted": entry.get("published", ""),
                "type": "Challenge",
                "raw": dict(entry),
            })
        if not items:
            # Fallback: scrape the challenges page
            resp = requests.get("https://www.diana.nato.int/challenges", headers=HEADERS, timeout=15)
            if resp.status_code == 200:
                items.append({
                    "source": "NATO DIANA",
                    "source_tier": 1,
                    "url": "https://www.diana.nato.int/challenges",
                    "title": "NATO DIANA Active Challenges — לבדיקה ידנית",
                    "org": "NATO DIANA",
                    "country": "נאט״ו",
                    "flag": "🏛️",
                    "description": "עמוד האתגרים של NATO DIANA נסרק — יש לבדוק ידנית אתגרים חדשים",
                    "deadline": "",
                    "posted": datetime.now().isoformat(),
                    "type": "Challenge",
                    "raw": {},
                })
        log(f"  NATO DIANA: {len(items)} פריטים")
    except Exception as e:
        log(f"  NATO DIANA שגיאה: {e}")
    return items


def scan_uk_dasa() -> list:
    """UK DASA — Defence & Security Accelerator"""
    log("סורק UK DASA...")
    items = []
    try:
        feed = feedparser.parse("https://www.ukdasa.com/opportunities/feed/")
        for entry in feed.entries[:10]:
            items.append({
                "source": "UK DASA",
                "source_tier": 1,
                "url": entry.get("link", "https://www.ukdasa.com"),
                "title": entry.get("title", ""),
                "org": "UK Defence & Security Accelerator",
                "country": "בריטניה",
                "flag": "🇬🇧",
                "description": entry.get("summary", "")[:500],
                "deadline": "",
                "posted": entry.get("published", ""),
                "type": "DASA",
                "raw": dict(entry),
            })
        log(f"  UK DASA: {len(items)} פריטים")
    except Exception as e:
        log(f"  UK DASA שגיאה: {e}")
    return items


def scan_horizon_europe() -> list:
    """Horizon Europe — EU Funding Portal RSS"""
    log("סורק Horizon Europe...")
    items = []
    try:
        # EU Funding & Tenders portal search API
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
                    "url": result.get("url", "https://ec.europa.eu/info/funding-tenders"),
                    "title": result.get("title", ""),
                    "org": "European Commission",
                    "country": "אירופה",
                    "flag": "🇪🇺",
                    "description": result.get("excerpt", "")[:500],
                    "deadline": md.get("deadlineDate", [""])[0] if md.get("deadlineDate") else "",
                    "posted": md.get("startDate", [""])[0] if md.get("startDate") else "",
                    "type": "Horizon Europe",
                    "raw": result,
                })
        log(f"  Horizon Europe: {len(items)} פריטים")
    except Exception as e:
        log(f"  Horizon Europe שגיאה: {e}")
    return items


def scan_afwerx() -> list:
    """AFWERX — challenges and solicitations"""
    log("סורק AFWERX...")
    items = []
    try:
        feed = feedparser.parse("https://afwerx.com/feed/")
        for entry in feed.entries[:10]:
            # סנן רק פריטים רלוונטיים
            title_lower = entry.get("title", "").lower()
            relevant_keywords = ["challenge", "sbir", "sttr", "solicitation", "open", "call", "opportunity"]
            if any(kw in title_lower for kw in relevant_keywords):
                items.append({
                    "source": "AFWERX",
                    "source_tier": 1,
                    "url": entry.get("link", "https://afwerx.com"),
                    "title": entry.get("title", ""),
                    "org": "AFWERX / USAF",
                    "country": "ארה״ב",
                    "flag": "🇺🇸",
                    "description": entry.get("summary", "")[:500],
                    "deadline": "",
                    "posted": entry.get("published", ""),
                    "type": "AFWERX",
                    "raw": dict(entry),
                })
        log(f"  AFWERX: {len(items)} פריטים")
    except Exception as e:
        log(f"  AFWERX שגיאה: {e}")
    return items


# ─── TIER 2: RSS ─────────────────────────────────────────────────────────────

def scan_rss_source(name: str, url: str, org: str, country: str, flag: str, type_: str, tier: int = 2) -> list:
    """סריקת מקור RSS גנרי"""
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
                "raw": {"title": entry.get("title"), "link": entry.get("link")},
            })
        log(f"  {name}: {len(items)} פריטים")
    except Exception as e:
        log(f"  {name} שגיאה: {e}")
    return items


RSS_SOURCES = [
    # ─ News & Analysis (Tier 2) ─
    ("Breaking Defense",    "https://breakingdefense.com/feed/",              "Breaking Defense",    "גלובלי", "🌐", "News",     2),
    ("Defense News",        "https://www.defensenews.com/rss/",               "Defense News",        "גלובלי", "🌐", "News",     2),
    ("Defense One",         "https://www.defenseone.com/rss/all/",            "Defense One",         "גלובלי", "🌐", "News",     2),
    ("DARPA News",          "https://www.darpa.mil/rss/news",                 "DARPA",               "ארה״ב",  "🇺🇸", "DARPA",    1),
    ("Army Futures",        "https://www.army.mil/rss/78",                    "Army Futures Command","ארה״ב",  "🇺🇸", "Army",     2),
    # ─ Think Tanks (Tier 3) ─
    ("RAND Defense",        "https://www.rand.org/topics/defense-and-security.xml", "RAND",          "גלובלי", "🌐", "Analysis", 3),
    ("CSIS Defense",        "https://www.csis.org/programs/international-security-program/rss.xml", "CSIS", "גלובלי", "🌐", "Analysis", 3),
    # ─ Industry (Tier 2) ─
    ("Rheinmetall News",    "https://www.rheinmetall.com/en/rss",             "Rheinmetall",         "גרמניה", "🇩🇪", "Industry", 2),
    ("BAE Systems News",    "https://www.baesystems.com/en/rss",              "BAE Systems",         "בריטניה","🇬🇧", "Industry", 2),
    ("Anduril Blog",        "https://www.anduril.com/rss.xml",                "Anduril",             "ארה״ב",  "🇺🇸", "Industry", 2),
    ("Elbit News",          "https://elbitsystems.com/rss/",                  "Elbit Systems",       "ישראל",  "🇮🇱", "Industry", 2),
]


# ─── TIER 1: LinkedIn (ידני — דרך Phantombuster / manual) ──────────────────

def scan_linkedin_manual() -> list:
    """
    LinkedIn לא ניתן לסרוק אוטומטית (ToS + blocking).
    במקום זאת — מחזיר תזכורת לבדיקה ידנית של הדפים המרכזיים.
    """
    log("מייצר תזכורות LinkedIn...")
    linkedin_pages = [
        ("NATO DIANA",           "https://www.linkedin.com/company/nato-diana/"),
        ("DIU",                  "https://www.linkedin.com/company/diux/"),
        ("AFWERX",               "https://www.linkedin.com/company/afwerx/"),
        ("NATO Innovation Fund", "https://www.linkedin.com/company/nato-innovation-fund/"),
        ("Shield Capital",       "https://www.linkedin.com/company/shield-capital/"),
        ("Anduril",              "https://www.linkedin.com/company/anduril-industries/"),
        ("Rheinmetall",          "https://www.linkedin.com/company/rheinmetall-ag/"),
        ("In-Q-Tel",             "https://www.linkedin.com/company/in-q-tel/"),
        ("DASA UK",              "https://www.linkedin.com/company/ukdasa/"),
    ]
    items = []
    for name, url in linkedin_pages:
        items.append({
            "source": "LinkedIn",
            "source_tier": 1,
            "url": url,
            "title": f"[LinkedIn] {name} — בדיקה ידנית נדרשת",
            "org": name,
            "country": "גלובלי",
            "flag": "💼",
            "description": f"יש לבדוק ידנית את דף LinkedIn של {name} לעדכונים, הכרזות ודרושים שמשקפים כוונות אסטרטגיות.",
            "deadline": "",
            "posted": datetime.now().isoformat(),
            "type": "LinkedIn",
            "manual_check": True,
            "raw": {},
        })
    return items


# ─── Runner ──────────────────────────────────────────────────────────────────

def load_sources(path: str = "sources.json") -> dict:
    """טוען את רשימת המקורות מה-JSON הנושם"""
    try:
        with open(path, "r", encoding="utf-8") as f:
            return json.load(f)
    except FileNotFoundError:
        log(f"⚠️  {path} לא נמצא — משתמש ב-fallback")
        return {}


def run_all_scans(sources_path: str = "sources.json") -> list:
    """מריץ את כל הסריקות לפי sources.json"""
    sources = load_sources(sources_path)
    all_items = []

    log(f"טוען מקורות מ-{sources_path}...")

    # ─ APIs ─
    api_handlers = {
        "sam_gov":       scan_sam_gov,
        "sbir_gov":      scan_sbir_gov,
        "edf":           scan_edf,
        "nato_diana":    scan_nato_diana,
        "uk_dasa":       scan_uk_dasa,
        "eu_funding":    scan_horizon_europe,
        "afwerx":        scan_afwerx,
    }

    for tier_key in ["tier1_apis"]:
        for source in sources.get(tier_key, []):
            if not source.get("active", True):
                log(f"  ⏭ מדולג: {source['name']}")
                continue
            handler = api_handlers.get(source["id"])
            if handler:
                all_items += handler()
                time.sleep(1)

    # ─ RSS (כל שאר הרמות) ─
    for tier_key in ["tier1_rss", "tier2_news", "tier2_industry", "tier3_think_tanks", "tier3_vc_investors"]:
        tier_num = 1 if "tier1" in tier_key else 2 if "tier2" in tier_key else 3
        for source in sources.get(tier_key, []):
            if not source.get("active", True):
                log(f"  ⏭ מדולג: {source['name']}")
                continue
            all_items += scan_rss_source(
                name    = source["name"],
                url     = source["url"],
                org     = source["name"],
                country = source.get("country", "גלובלי"),
                flag    = source.get("flag", "🌐"),
                type_   = tier_key.replace("tier1_","").replace("tier2_","").replace("tier3_",""),
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
