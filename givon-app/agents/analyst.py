"""
סוכן ניתוח — Givon Defense Intelligence Analyst v2
מתמקד ב-ACTIONABLE LEADS בלבד — לידים שניתן לפעול עליהם תוך 90 יום
"""

import anthropic
import json
import time
from datetime import datetime
from typing import Optional

GIVON_PROFILE = """
אתה אנליסט מודיעין אסטרטגי של Givon Defense (גבעון ביטחון).
תפקידך: לזהות לידים ACTIONABLE שאנשי עסקים לא היו מוצאים לבד.

פרופיל גבעון:
- חברה ישראלית: Next-Gen Decentralized National Security Prime
- מייסדים: אל״מ (מיל.) אבי גיל (יו״ר), סא״ל (מיל.) יונתן רום (מנכ״ל)

פורטפוליו Ventures:
- Guardian Angel (TRL 7) — AI mesh covert לאבטחת גבולות ותשתיות
- Sky Fort (TRL 5) — Counter-UAS point defense אוטונומי, נגד נחילים
- Aerosentry (TRL 7) — Counter-UAS long-range, מתמחה ב-Shahed/Geran
- Daya IRIS-20 (TRL 5) — Aerial ISR, כיסוי 100 ק״מ, עלות נמוכה ב-80-90%
- DFM Power (TRL 9) — Nano-grid מודולרי, 300 ק״ג, APMS AI-driven
- Crebain (TRL 5) — AI-driven decentralized swarm, hardware-agnostic

Solutions: D-COE (סימולציה), GuaRdF (RF sensing), iCit (Vision AI),
D-Fence (חיישנים), Cyberbee (ניווט GNSS-denied), Elite Minds (סייבר),
Mokoushla (רובוטיקה קרקעית), Visual Layer (ניהול נתונים ויזואליים)

שווקי יעד: US DoD (DIU/AFWERX/DARPA/SOCOM/SBIR), NATO/DIANA,
EU (EDF/Horizon), מאפ״ת/מלמ״ב, UK MOD, מזרח אירופה, GCC
"""

ANALYST_INSTRUCTIONS = """
קיבלת פריט גולמי. המשימה: האם זה מודיעין שימושי לגבעון?

סוגי פריטים רלוונטיים — קבל אם עומד באחד מהבאים:

1. ACTIONABLE LEADS (fitScore 80-100):
   - RFI/SBIR/OTA/BAA פתוח עם URL + deadline
   - מכרז ממשלתי עם גוף מממן ספציפי
   - קרן שהכריזה על השקעה בתחום defense/autonomy

2. COMPETITOR INTELLIGENCE (fitScore 70-85):
   - כל חדשה על: Shield AI, Helsing, Anduril, Quantum-Systems, Milrem, Elbit, Rafael
   - חוזה שמתחרה זכה בו = פער שגבעון יכולה למלא
   - מוצר חדש של מתחרה = signal לשוק

3. STRATEGIC SIGNALS (fitScore 65-79):
   - כל אזכור של SOCOM, SOF, JATF, Collective Autonomy, C-UAS, Counter-drone
   - NATO/DIANA/DIU/AFWERX — גם כתבה כללית = signal
   - שינוי תקציבי / דוקטרינה חדשה שמשפיע על שווקי גבעון

4. MARKET TRENDS (fitScore 60-69):
   - טכנולוגיה חדשה ב-swarm/AI/ISR שגבעון צריכה לדעת עליה
   - כנס / matchmaking event עם DoD buyers

דחה רק:
- כתבות פוליטיות שאין להן קשר לביטחון/טכנולוגיה
- חדשות ימאות/נפט/כלכלה ללא קשר לביטחון
- תוכן כפול שכבר ראינו

כללי fitScore:
- 90-100: RFI/SBIR/OTA פתוח, deadline <60 יום, URL ישיר, גבעון מועמדת ישירה
- 80-89: הזדמנות ממשית או חוזה מתחרה משמעותי
- 70-79: signal אסטרטגי חשוב — SOCOM/NATO/מתחרה ידוע
- 60-69: trend/כנס/טכנולוגיה רלוונטית
- מתחת ל-60: relevant=false

קטגוריות:
- contracts: RFI, SBIR, OTA, מכרז ממשלתי
- grants: EDF, DIANA, Horizon, AFWERX
- investors: קרן VC defense
- partners: שותף פוטנציאלי או RFI ספציפי
- conferences: כנס / pitch session / matchmaking
- ventures: פער שוק או טכנולוגיה חדשה
- competitors: מתחרה ישיר — חוזה, מוצר חדש, שותפות

פורמט תגובה — JSON בלבד, ללא markdown:
{
  "relevant": true/false,
  "title": "כותרת ספציפית — לא כותרת כתבה",
  "org": "שם הגוף המממן",
  "country": "מדינה בעברית",
  "flag": "אמוג׳י דגל",
  "category": "contracts/partners/investors/grants/ventures/competitors/conferences",
  "domain": "Counter-UAS/Swarm AI/Aerial ISR/Tactical Energy/Border Security/Cyber-RF/Robotics/Vision AI/Simulation",
  "budget": "סכום + מטבע או null",
  "deadline": "DD.MM.YYYY או null",
  "fitScore": 0-100,
  "action": "פעולה ספציפית — מה לעשות עכשיו",
  "urgency": "critical/high/medium/low",
  "tag": "SBIR/OTA/RFI/EDF/NATO/VC/Conference/Partner/Competitor",
  "why": "2-3 משפטים עברית — מוצר ספציפי + למה הזדמנות לא מובנת מאליה",
  "signal": "מה השתנה לאחרונה שהובל לגילוי הפריט",
  "verifiable_url": "URL ישיר לאימות או null",
  "summary": "משפט אחד — מה קורה + מה לעשות",
  "url": "URL המקור"
}

אם relevant: false — החזר רק: {"relevant": false}
"""

# System prompt משולב — נבנה פעם אחת
SYSTEM_PROMPT = GIVON_PROFILE + "\n\n" + ANALYST_INSTRUCTIONS


def load_hash_cache(path="analyzed_hashes.json"):
    try:
        with open(path, "r") as f:
            return set(json.load(f))
    except:
        return set()

def save_hash_cache(hashes, path="analyzed_hashes.json"):
    with open(path, "w") as f:
        json.dump(list(hashes), f)

def item_hash(item):
    return str(hash(item.get("url", "") + item.get("title", "")))


def analyze_item(client, item):
    try:
        item_text = f"""
מקור: {item.get('source', '')} (Tier {item.get('source_tier', 2)})
כותרת: {item.get('title', '')}
גוף: {item.get('org', '')}
מדינה: {item.get('country', '')}
תיאור: {item.get('description', '')}
דדליין: {item.get('deadline', 'לא ידוע')}
פורסם: {item.get('posted', '')}
סוג: {item.get('type', '')}
URL: {item.get('url', '')}
"""
        response = client.messages.create(
            model="claude-sonnet-4-6",  # ✅ Sonnet במקום Opus — זול פי ~15
            max_tokens=700,
            system=[
                {
                    "type": "text",
                    "text": SYSTEM_PROMPT,
                    "cache_control": {"type": "ephemeral"}  # ✅ Cache prompt caching — חוסך ~90% tokens
                }
            ],
            messages=[{"role": "user", "content": item_text}]
        )
        text = response.content[0].text.strip()
        text = text.replace("```json", "").replace("```", "").strip()
        result = json.loads(text)

        if not result.get("relevant", False):
            return None

        # הורד fitScore אם אין URL
        if result.get("fitScore", 0) >= 70 and not result.get("verifiable_url") and not result.get("url"):
            result["fitScore"] = 55

        result["id"] = f"{item.get('source','unknown')}_{abs(hash(item.get('title','') + item.get('url','')))}"
        result["scanned_at"] = datetime.now().isoformat()
        result["source_name"] = item.get("source", "")
        result["source_tier"] = item.get("source_tier", 2)
        result["bookmarked"] = False
        result["status"] = "פתוח"

        # תיוג ישראל
        combined = (item.get("title","") + item.get("url","") + item.get("org","")).lower()
        if any(kw in combined for kw in ["מפא","מלמ","mod.gov.il","mafat","rafael","iai","elbit"]):
            result["bookmarked"] = True
            if result.get("urgency") not in ("critical",):
                result["urgency"] = "high"

        return result

    except json.JSONDecodeError:
        return None
    except Exception as e:
        print(f"  Error: {e}")
        return None


def run_analysis(raw_items, api_key):
    client = anthropic.Anthropic(api_key=api_key)
    hash_cache = load_hash_cache()
    cache_hits = 0
    analyzed = []

    print(f"\nמנתח {len(raw_items)} פריטים...")
    print(f"Hash cache: {len(hash_cache)} פריטים ידועים מריצות קודמות")
    print("=" * 50)

    for i, item in enumerate(raw_items):
        title = item.get("title", "")[:60]
        print(f"[{i+1}/{len(raw_items)}] {title}...")

        if item.get("manual_check"):
            print(f"  → LinkedIn manual, מדלג")
            continue

        h = item_hash(item)
        if h in hash_cache:
            print(f"  → ⚡ Cache hit, מדלג")
            cache_hits += 1
            continue

        result = analyze_item(client, item)
        hash_cache.add(h)

        if result:
            analyzed.append(result)
            print(f"  → ✅ fitScore: {result.get('fitScore',0)} | {result.get('category','')} | {result.get('domain','')}")
        else:
            print(f"  → ⏭ לא רלוונטי")

        if (i + 1) % 5 == 0:
            time.sleep(2)
            save_hash_cache(hash_cache)
        else:
            time.sleep(0.5)

    save_hash_cache(hash_cache)
    print(f"\n{'='*50}")
    print(f"רלוונטיים: {len(analyzed)} | Cache hits: {cache_hits}")
    return analyzed


def merge_with_existing(new_items, existing_path="../givon-app/src/opportunities.json"):
    try:
        with open(existing_path, "r", encoding="utf-8") as f:
            existing_data = json.load(f)
        if isinstance(existing_data, dict):
            existing = [item for k, v in existing_data.items() if isinstance(v, list) for item in v]
        else:
            existing = existing_data
    except:
        existing = []

    existing_ids = {item.get("id", ""): item for item in existing}
    kept = [item for iid, item in existing_ids.items()
            if iid in {i.get("id","") for i in new_items} or item.get("status") in ("בבדיקה","הוגש")]
    added = [item for item in new_items if item.get("id") not in existing_ids]
    merged = kept + added
    print(f"מיזוג: {len(kept)} קיימים + {len(added)} חדשים = {len(merged)} סה״כ")
    return merged


def sort_by_priority(items):
    categories = {"contracts":[],"partners":[],"investors":[],
                  "grants":[],"ventures":[],"competitors":[],"conferences":[]}
    for item in items:
        cat = item.get("category", "contracts")
        if cat in categories:
            categories[cat].append(item)
    for cat in categories:
        categories[cat].sort(key=lambda x: x.get("fitScore", 0), reverse=True)
    return categories
