# Givon Defense — מדריך הפעלת הסוכנים

## מה יש כאן

```
scanner.py   — סוכן 1: סורק את 50 המקורות
analyst.py   — סוכן 2: מנתח דרך Claude API ומפרמט לפורטל
run.py       — המנהל: מריץ הכל ועושה push ל-GitHub
```

## התקנה (פעם אחת)

```bash
cd givon-agents
pip install -r requirements.txt
```

## הגדרת API Key

```bash
# Mac/Linux:
export ANTHROPIC_API_KEY="sk-ant-..."

# Windows:
set ANTHROPIC_API_KEY=sk-ant-...
```

קבל API key ב: https://console.anthropic.com

## ריצה

```bash
# ריצה מלאה — סריקה + ניתוח + push
python run.py

# בדיקה ללא push
python run.py --no-push

# רק לסרוק (לבדיקה)
python run.py --scan-only

# רק לנתח (אם raw_scan.json קיים)
python run.py --analyze-only
```

## הפעלה אוטומטית שבועית

### Mac/Linux — cron:
```bash
crontab -e
# הוסף שורה זו (כל יום ראשון בשעה 8:00):
0 8 * * 0 cd /path/to/givon-agents && python run.py >> logs/weekly.log 2>&1
```

### Windows — Task Scheduler:
1. פתח Task Scheduler
2. Create Basic Task
3. Trigger: Weekly, Sunday 08:00
4. Action: `python C:\path\to\givon-agents\run.py`

## עלות משוערת

- Claude API: ~$0.30-0.80 לריצה שבועית (תלוי כמות פריטים)
- SAM.gov API: חינמי
- שאר המקורות: חינמי

## הערות

**LinkedIn** — לא ניתן לסריקה אוטומטית (ToS של LinkedIn).
הסוכן מייצר תזכורות לבדיקה ידנית של הדפים החשובים.
מומלץ לבדוק ידנית פעם בשבוע.

**SAM.gov API Key** — דרוש רישום חינמי ב-sam.gov/profile
החלף `DEMO_KEY` ב-scanner.py עם ה-key שלך.

## מבנה הפלט

הסוכן מעדכן את הקובץ:
```
givon-app/src/opportunities.json
```

הפורטל קורא מקובץ זה אוטומטית.
כשה-JSON מתעדכן ב-GitHub → Vercel בונה מחדש → הפורטל מתעדכן.
