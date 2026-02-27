"""
סוכן ניתוח — Givon Defense Intelligence Analyst
לוקח פריטים גולמיים מהסריקה ומנתח אותם דרך Claude API
"""

import anthropic
import json
import time
from datetime import datetime
from typing import Optional

# ─── פרופיל גבעון (system prompt) ────────────────────────────────────────────

GIVON_PROFILE = """
אתה אנליסט מודיעין אסטרטגי של Givon Defense (גבעון ביטחון).

פרופיל גבעון:
- חברה ישראלית: Next-Gen Decentralized National Security Prime
- מייסדים: אל״מ (מיל.) אבי גיל (יו״ר), סא״ל (מיל.) יונתן רום (מנכ״ל)
- מודל: מזהה פערים מבצעיים, בונה ventures, פורס תוך 12-24 חודש

פורטפוליו Ventures:
- Guardian Angel (TRL 7) — AI mesh covert לאבטחת גבולות ותשתיות
- Sky Fort (TRL 5) — Counter-UAS point defense אוטונומי, נגד נחילים
- Aerosentry (TRL 7) — Counter-UAS long-range, מתמחה ב-Shahed/Geran
- Daya IRIS-20 (TRL 5) — Aerial ISR, כיסוי 100 ק״מ, עלות נמוכה ב-80-90%
- DFM Power (TRL 9) — Nano-grid מודולרי, 300 ק״ג, APMS AI-driven
- Crebain (TRL 5) — AI-driven decentralized swarm, hardware-agnostic

Solutions Companies:
- D-COE (הדרכה וסימולציה לדרונים)
- GuaRdF (RF sensing ועקיבה המונית)
- iCit (Vision Agents להגנה)
- D-Fence (פתרונות חיישנים מתקדמים)
- Top I Vision (פלטפורמות אוויריות)
- Mokoushla (רובוטיקה קרקעית מוכחת בשדה)
- Visual Layer (ניהול נתונים ויזואליים AI)
- Cyberbee (ניווט GNSS-denied עם AI Vision)
- Elite Minds (פלטפורמת סייבר)

שווקי יעד: US DoD (DIU/AFWERX/DARPA/SOCOM), NATO/DIANA, EU (EDF/Horizon), מאפ״ת/מלמ״ב, UK MOD, מזרח אירופה

תחומי ליבה: Counter-UAS, Swarm AI, Aerial ISR, Tactical Energy, Border Security, Vision AI, Robotics, RF/Cyber
"""

ANALYST_INSTRUCTIONS = """
קיבלת פריט גולמי שנסרק ממקור מודיעין. המשימה שלך:

1. קרא את הפריט
2. החלט אם הוא רלוונטי לגבעון (fitScore >= 40 = רלוונטי)
3. אם רלוונטי — הפק JSON מובנה

כללי ניתוח:
- fitScore: 0-100 לפי התאמה לפורטפוליו גבעון (TRL, domain, market access, timing)
- urgency: critical (דדליין <30 יום / הזדמנות חד-פעמית), high, medium, low
- category: contracts / partners / investors / grants / ventures / competitors
- whyRelevant: 2-3 משפטים בעברית — ציין שמות ספציפיים מהפורטפוליו ולמה זו הזדמנות אמיתית

פורמט תגובה — JSON בלבד, ללא markdown:
{
  "relevant": true/false,
  "title": "כותרת קצרה באנגלית",
  "org": "שם הגוף",
  "country": "מדינה בעברית",
  "flag": "אמוג׳י דגל",
  "category": "contracts/partners/investors/grants/ventures/competitors",
  "domain": "Counter-UAS / Swarm AI / Aerial ISR / Tactical Energy / אבטחת גבולות / Cyber-RF / רובוטיקה / Vision AI / Industry / News / Analysis",
  "budget": "סכום + מטבע (אם ידוע)",
  "deadline": "DD.MM.YYYY (אם ידוע)",
  "fitScore": 0-100,
  "action": "קבלן ראשי / קבלן משנה / שותף / חקור Venture / עקוב / התעלם",
  "urgency": "critical/high/medium/low",
  "tag": "OTA/SBIR/EDF/NATO/News/Industry/Analysis/etc",
  "whyRelevant": "2-3 משפטים עברית עם שמות ספציפיים מהפורטפוליו",
  "summary": "משפט אחד עברית — תמצית הפריט",
  "url": "URL המקור"
}

אם relevant: false — החזר רק: {"relevant": false}
"""


# ─── Analyst ─────────────────────────────────────────────────────────────────

def analyze_item(client: anthropic.Anthropic, item: dict) -> Optional[dict]:
    """מנתח פריט בודד דרך Claude API"""
    try:
        # בנה תיאור הפריט
        item_text = f"""
מקור: {item.get('source', '')}
כותרת: {item.get('title', '')}
גוף: {item.get('org', '')}
מדינה: {item.get('country', '')}
תיאור: {item.get('description', '')}
דדליין: {item.get('deadline', 'לא ידוע')}
פורסם: {item.get('posted', '')}
סוג: {item.get('type', '')}
URL: {item.get('url', '')}
בדיקה ידנית נדרשת: {item.get('manual_check', False)}
"""

        response = client.messages.create(
            model="claude-opus-4-6",
            max_tokens=600,
            system=GIVON_PROFILE + "\n\n" + ANALYST_INSTRUCTIONS,
            messages=[{"role": "user", "content": item_text}]
        )

        text = response.content[0].text.strip()
        # נקה markdown אם יש
        text = text.replace("```json", "").replace("```", "").strip()
        result = json.loads(text)

        if not result.get("relevant", False):
            return None

        # הוסף metadata
        result["id"] = f"{item.get('source', 'unknown')}_{hash(item.get('title', ''))}"
        result["scanned_at"] = datetime.now().isoformat()
        result["source_name"] = item.get("source", "")
        result["source_tier"] = item.get("source_tier", 2)
        result["bookmarked"] = False
        result["status"] = "פתוח"
        result["assignee"] = None

        # תיוג קשרים אישיים — ישראל
        ISRAEL_KEYWORDS = ["מפא", "מלמ", "צה", "mafat", "imod", "idf", "mod.gov.il"]
        
        # תיוג שותפים אסטרטגיים — ארה"ב וגרמניה
        STRATEGIC_KEYWORDS = [
            # ארה"ב
            "rheinmetall", "hensoldt", "thales", "knds", "leonardo",
            "booz allen", "saic", "l3harris", "anduril", "shield ai",
            "leidos", "peraton", "caci", "palantir", "axon", "dedrone",
            "redwire", "ondas",
            # גרמניה/אירופה
            "bundeswehr", "nato diana", "edf", "european defence fund",
        ]
        
        title_lower = item.get("title", "").lower()
        source_lower = item.get("source", "").lower()
        url_lower = item.get("url", "").lower()
        combined = title_lower + source_lower + url_lower
        
        if any(kw in combined for kw in ISRAEL_KEYWORDS):
            result["personal_connection"] = True
            result["bookmarked"] = True
            if result.get("urgency") not in ("critical",):
                result["urgency"] = "high"
        
        if any(kw in combined for kw in STRATEGIC_KEYWORDS):
            result["strategic_partner"] = True
            result["bookmarked"] = True

        return result

    except json.JSONDecodeError as e:
        print(f"  JSON parse error: {e}")
        return None
    except Exception as e:
        print(f"  Error analyzing item: {e}")
        return None


def run_analysis(raw_items: list, api_key: str, batch_size: int = 5) -> list:
    """
    מנתח את כל הפריטים הגולמיים
    batch_size: כמה פריטים לנתח במקביל (להגבלת עלות)
    """
    client = anthropic.Anthropic(api_key=api_key)

    analyzed = []
    skipped = 0
    errors = 0

    print(f"\nמנתח {len(raw_items)} פריטים...")
    print("=" * 50)

    for i, item in enumerate(raw_items):
        title = item.get("title", "")[:60]
        print(f"[{i+1}/{len(raw_items)}] {title}...")

        # דלג על LinkedIn manual items — יטופלו בנפרד
        if item.get("manual_check"):
            print(f"  → LinkedIn manual, מדלג")
            skipped += 1
            continue

        result = analyze_item(client, item)

        if result:
            analyzed.append(result)
            print(f"  → ✅ fitScore: {result.get('fitScore', 0)} | {result.get('category', '')} | {result.get('domain', '')}")
        else:
            skipped += 1
            print(f"  → ⏭ לא רלוונטי")

        # השהיה למניעת rate limiting
        if (i + 1) % batch_size == 0:
            time.sleep(2)
        else:
            time.sleep(0.5)

    print(f"\n{'='*50}")
    print(f"רלוונטיים: {len(analyzed)} | דולגו: {skipped} | שגיאות: {errors}")
    return analyzed


def merge_with_existing(new_items: list, existing_path: str = "../givon-app/src/opportunities.json") -> list:
    """
    ממזג עם הנתונים הקיימים — שומר פריטים שעדיין רלוונטיים,
    מוסיף חדשים, מסיר ישנים (מעל 60 יום)
    """
    try:
        with open(existing_path, "r", encoding="utf-8") as f:
            existing = json.load(f)
    except (FileNotFoundError, json.JSONDecodeError):
        existing = []

    # בנה lookup לפי ID
    existing_ids = {item.get("id", ""): item for item in existing}
    new_ids = {item.get("id", ""): item for item in new_items}

    # שמור פריטים קיימים שלא נמחקו ולא פגו
    cutoff = datetime.now().isoformat()[:10]  # תאריך היום
    kept = []
    for item_id, item in existing_ids.items():
        deadline = item.get("deadline", "")
        # שמור אם: חדש (מופיע בסריקה), או סטטוס פעיל, או אין דדליין
        if item_id in new_ids or item.get("status") in ("בבדיקה", "הוגש") or not deadline:
            kept.append(item)

    # הוסף פריטים חדשים שלא היו קודם
    added = [item for item in new_items if item.get("id") not in existing_ids]

    merged = kept + added
    print(f"מיזוג: {len(kept)} קיימים + {len(added)} חדשים = {len(merged)} סה״כ")
    return merged


def sort_by_priority(items: list) -> dict:
    """
    ממיין ומארגן לפי קטגוריה ו-fitScore
    מחזיר dict לפי קטגוריות — מוכן לפורטל
    """
    categories = {
        "contracts": [],
        "partners": [],
        "investors": [],
        "grants": [],
        "ventures": [],
        "competitors": [],
    }

    for item in items:
        cat = item.get("category", "contracts")
        if cat in categories:
            categories[cat].append(item)

    # מיין כל קטגוריה לפי fitScore
    for cat in categories:
        categories[cat].sort(key=lambda x: x.get("fitScore", 0), reverse=True)

    return categories


if __name__ == "__main__":
    import os
    import sys

    # קבל API key
    api_key = os.environ.get("ANTHROPIC_API_KEY")
    if not api_key:
        print("שגיאה: ANTHROPIC_API_KEY לא מוגדר")
        print("הרץ: export ANTHROPIC_API_KEY='your-key-here'")
        sys.exit(1)

    # טען נתונים גולמיים
    try:
        with open("raw_scan.json", "r", encoding="utf-8") as f:
            raw_items = json.load(f)
        print(f"נטענו {len(raw_items)} פריטים גולמיים")
    except FileNotFoundError:
        print("שגיאה: raw_scan.json לא נמצא. הרץ scanner.py קודם.")
        sys.exit(1)

    # נתח
    analyzed = run_analysis(raw_items, api_key)

    # מזג עם קיימים
    merged = merge_with_existing(analyzed)

    # ארגן לפי קטגוריות
    organized = sort_by_priority(merged)

    # שמור
    output_path = "../givon-app/src/opportunities.json"
    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    with open(output_path, "w", encoding="utf-8") as f:
        json.dump(organized, f, ensure_ascii=False, indent=2)

    print(f"\n✅ נשמר ל-{output_path}")
    for cat, items in organized.items():
        print(f"  {cat}: {len(items)} פריטים")
