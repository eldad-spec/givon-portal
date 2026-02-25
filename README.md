"""
run.py — מנהל הסוכנים של Givon Defense Intelligence
שימוש:
  python run.py                    # ריצה מלאה
  python run.py --scan-only        # סריקה בלבד
  python run.py --analyze-only     # ניתוח בלבד
  python run.py --no-push          # ללא push
  python run.py --no-email         # ללא מייל
  python run.py --sources my.json  # קובץ מקורות אחר
"""

import os, sys, json, argparse, subprocess
from datetime import datetime
from scanner import run_all_scans
from analyst import run_analysis, merge_with_existing, sort_by_priority
from notifier import send_update

def log(msg): print(f"\n{'='*60}\n{msg}\n{'='*60}")

def push_to_github():
    try:
        subprocess.run(["git","add","../givon-app/src/opportunities.json"], check=True)
        subprocess.run(["git","commit","-m",f"Intel update — {datetime.now().strftime('%Y-%m-%d %H:%M')}"], check=True)
        subprocess.run(["git","push"], check=True)
        log("✅ Push הצליח — Vercel יתעדכן תוך ~2 דקות")
    except subprocess.CalledProcessError as e:
        print(f"⚠️  Push נכשל: {e}")

def print_summary(organized):
    cats = {k:v for k,v in organized.items() if not k.startswith("_")}
    total    = sum(len(v) for v in cats.values())
    critical = sum(1 for items in cats.values() for i in items if i.get("urgency")=="critical")
    high_fit = sum(1 for items in cats.values() for i in items if i.get("fitScore",0)>=85)
    labels   = {"contracts":"📋 הזדמנויות","partners":"🤝 שותפים   ",
                "investors":"💰 משקיעים  ","grants":"🏆 מענקים   ",
                "ventures":"🚀 ונצ׳רים  ","competitors":"🔭 מתחרים   "}
    print(f"\n╔══════════════════════════════════════╗\n║    Givon Intel — סיכום               ║\n╠══════════════════════════════════════╣")
    print(f"║  סה״כ פריטים:  {str(total).ljust(22)}║")
    print(f"║  קריטיים:      {str(critical).ljust(22)}║")
    print(f"║  Fit 85+:      {str(high_fit).ljust(22)}║")
    print("╠══════════════════════════════════════╣")
    for cat, items in cats.items():
        print(f"║  {labels.get(cat,cat)}  {str(len(items)).ljust(19)}║")
    print("╚══════════════════════════════════════╝")

def main():
    p = argparse.ArgumentParser()
    p.add_argument("--scan-only",    action="store_true")
    p.add_argument("--analyze-only", action="store_true")
    p.add_argument("--no-push",      action="store_true")
    p.add_argument("--no-email",     action="store_true")
    p.add_argument("--sources",      default="sources.json")
    args = p.parse_args()

    api_key = os.environ.get("ANTHROPIC_API_KEY")
    if not api_key and not args.scan_only:
        print("שגיאה: export ANTHROPIC_API_KEY='sk-ant-...'"); sys.exit(1)

    start = datetime.now()
    log(f"🚀 Givon Intel — {start.strftime('%Y-%m-%d %H:%M')} | {args.sources}")

    # 1 — סריקה
    if not args.analyze_only:
        log("📡 שלב 1: סריקה")
        raw = run_all_scans(sources_path=args.sources)
        json.dump(raw, open("raw_scan.json","w",encoding="utf-8"), ensure_ascii=False, indent=2, default=str)
        print(f"✅ {len(raw)} פריטים גולמיים")
    else:
        raw = json.load(open("raw_scan.json","r",encoding="utf-8"))

    if args.scan_only: return

    # 2 — ניתוח
    log("🧠 שלב 2: ניתוח AI")
    analyzed = run_analysis(raw, api_key)
    print(f"✅ {len(analyzed)} פריטים רלוונטיים")

    # 3 — שמירה
    log("💾 שלב 3: שמירה")
    output = "../givon-app/src/opportunities.json"
    merged = merge_with_existing(analyzed, output)
    org    = sort_by_priority(merged)
    org["_meta"] = {"last_updated": datetime.now().isoformat(),
                    "items_count": sum(len(v) for k,v in org.items() if not k.startswith("_")),
                    "new_this_run": len(analyzed)}
    os.makedirs(os.path.dirname(output), exist_ok=True)
    json.dump(org, open(output,"w",encoding="utf-8"), ensure_ascii=False, indent=2)
    print(f"✅ נשמר → {output}")

    # 4 — GitHub
    if not args.no_push:
        log("📤 שלב 4: GitHub")
        push_to_github()

    # 5 — מייל
    if not args.no_email:
        log("📧 שלב 5: מייל")
        send_update(analyzed) if analyzed else print("ℹ️  אין חדש — מייל לא נשלח")

    print_summary(org)
    print(f"\n⏱  {(datetime.now()-start).seconds} שניות")

if __name__ == "__main__":
    main()
