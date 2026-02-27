"""
notifier.py — שולח מייל כשיש עדכון חדש בפורטל
משתמש ב-SMTP סטנדרטי (Gmail / Outlook)
"""

import smtplib
import json
import os
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from datetime import datetime

# ─── רשימת נמענים — ערוך כאן ──────────────────────────────────────────────
RECIPIENTS = [
    os.environ.get("NOTIFY_EMAIL", ""),
    "yonatan@givondefense.com",
    "talia@givondefense.com",
    "avi@givondefense.com",
    "lihi@givondefense.com",
    "romi@givondefense.com",
    "yahel@givondefense.com",
    "liron@givondefense.com",
]

# ─── הגדרות שליחה ────────────────────────────────────────────────────────────
# מלא את הפרטים האלה פעם אחת — ואז הכל אוטומטי
SMTP_HOST   = "smtp.gmail.com"
SMTP_PORT   = 587
FROM_EMAIL  = os.environ.get("NOTIFY_EMAIL", "")         # המייל שממנו שולחים
EMAIL_PASS  = os.environ.get("NOTIFY_PASSWORD", "")    # App Password (לא סיסמה רגילה)
PORTAL_URL  = os.environ.get("GIVON_PORTAL_URL", "https://givon-intel.vercel.app")

# ─── בניית המייל ──────────────────────────────────────────────────────────────

def build_email_html(new_items: list, scan_date: str) -> str:
    """בונה HTML מייל עם סיכום הפריטים החדשים"""

    fit_color = lambda s: "#16a34a" if s>=90 else "#ca8a04" if s>=75 else "#ea580c"

    category_labels = {
        "contracts":   "📋 הזדמנויות חוזיות",
        "partners":    "🤝 שותפים",
        "investors":   "💰 משקיעים",
        "grants":      "🏆 מענקים",
        "ventures":    "🚀 ונצ׳רים",
        "competitors": "🔭 מתחרים",
    }

    # קבץ לפי קטגוריה
    by_cat = {}
    for item in new_items:
        cat = item.get("category", "contracts")
        by_cat.setdefault(cat, []).append(item)

    # בנה rows
    rows_html = ""
    for cat, items in by_cat.items():
        label = category_labels.get(cat, cat)
        rows_html += f"""
        <tr>
          <td colspan="4" style="padding:12px 16px 4px; font-size:11px; font-weight:700;
            color:#64748b; text-transform:uppercase; letter-spacing:0.08em;
            border-top:1px solid #1e293b;">
            {label}
          </td>
        </tr>"""
        for item in sorted(items, key=lambda x: x.get("fitScore",0), reverse=True):
            title    = item.get("title","")[:65]
            fit      = item.get("fitScore", 0)
            urgency  = item.get("urgency","medium")
            budget   = item.get("budget") or item.get("prize") or ""
            deadline = item.get("deadline","")
            url      = item.get("url","#")
            urg_color = {"critical":"#ef4444","high":"#f97316","medium":"#eab308","low":"#22c55e"}.get(urgency,"#64748b")
            urg_label = {"critical":"קריטי","high":"גבוה","medium":"בינוני","low":"נמוך"}.get(urgency,"")
            fc = fit_color(fit)

            rows_html += f"""
        <tr style="border-bottom:1px solid #1e293b;">
          <td style="padding:10px 16px;">
            <a href="{url}" style="color:#93c5fd; text-decoration:none; font-size:13px; font-weight:600;">{title}</a>
          </td>
          <td style="padding:10px 8px; text-align:center;">
            <span style="display:inline-block; width:32px; height:32px; border-radius:50%;
              border:2px solid {fc}; color:{fc}; font-size:11px; font-weight:800;
              line-height:28px; text-align:center; font-family:monospace;">{fit}</span>
          </td>
          <td style="padding:10px 8px; text-align:center;">
            <span style="font-size:10px; color:{urg_color}; font-weight:700;">{urg_label}</span>
          </td>
          <td style="padding:10px 16px; font-size:11px; color:#64748b; font-family:monospace;">
            {budget}{" · " + deadline if deadline else ""}
          </td>
        </tr>"""

    critical_count = sum(1 for i in new_items if i.get("urgency")=="critical")
    high_fit_count = sum(1 for i in new_items if i.get("fitScore",0)>=85)

    return f"""
<!DOCTYPE html>
<html dir="rtl" lang="he">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width"></head>
<body style="margin:0; padding:0; background:#020617; font-family:'Segoe UI',Tahoma,sans-serif; direction:rtl;">
  <div style="max-width:680px; margin:0 auto; padding:24px 16px;">

    <!-- Header -->
    <div style="background:#0a0f1e; border:1px solid #1e293b; border-radius:10px;
      padding:20px 24px; margin-bottom:20px; display:flex; align-items:center; justify-content:space-between;">
      <div>
        <div style="font-size:10px; color:#3b82f6; font-weight:700; letter-spacing:0.15em; margin-bottom:4px;">GIVON DEFENSE</div>
        <div style="font-size:20px; font-weight:800; color:#f1f5f9;">עדכון מודיעין שבועי</div>
        <div style="font-size:11px; color:#475569; margin-top:3px;">{scan_date}</div>
      </div>
      <div style="text-align:center;">
        <div style="font-size:28px; font-weight:900; color:#f1f5f9; font-family:monospace;">{len(new_items)}</div>
        <div style="font-size:10px; color:#64748b;">פריטים חדשים</div>
      </div>
    </div>

    <!-- Stats -->
    <div style="display:flex; gap:12px; margin-bottom:20px;">
      {"" if not critical_count else f'<div style="flex:1; background:#1c0a0a; border:1px solid #ef444430; border-radius:8px; padding:12px; text-align:center;"><div style="font-size:22px; font-weight:800; color:#f87171; font-family:monospace;">{critical_count}</div><div style="font-size:10px; color:#64748b;">🔴 קריטיים</div></div>'}
      <div style="flex:1; background:#0a1a0a; border:1px solid #22c55e30; border-radius:8px; padding:12px; text-align:center;">
        <div style="font-size:22px; font-weight:800; color:#4ade80; font-family:monospace;">{high_fit_count}</div>
        <div style="font-size:10px; color:#64748b;">🎯 Fit 85+</div>
      </div>
      <div style="flex:1; background:#0a0f1e; border:1px solid #1e293b; border-radius:8px; padding:12px; text-align:center; vertical-align:middle;">
        <a href="{PORTAL_URL}" style="display:block; color:#60a5fa; text-decoration:none; font-size:13px; font-weight:700; padding-top:8px;">
          🔗 פתח פורטל
        </a>
      </div>
    </div>

    <!-- Items Table -->
    <div style="background:#0a0f1e; border:1px solid #1e293b; border-radius:10px; overflow:hidden; margin-bottom:20px;">
      <div style="padding:12px 16px; border-bottom:1px solid #1e293b;">
        <div style="font-size:12px; font-weight:700; color:#94a3b8;">פריטים חדשים שזוהו</div>
      </div>
      <table style="width:100%; border-collapse:collapse;">
        <thead>
          <tr style="background:#0f172a;">
            <th style="padding:8px 16px; text-align:right; font-size:10px; color:#475569; font-weight:600;">כותרת</th>
            <th style="padding:8px 8px; text-align:center; font-size:10px; color:#475569; font-weight:600;">Fit</th>
            <th style="padding:8px 8px; text-align:center; font-size:10px; color:#475569; font-weight:600;">דחיפות</th>
            <th style="padding:8px 16px; text-align:right; font-size:10px; color:#475569; font-weight:600;">תקציב / דדליין</th>
          </tr>
        </thead>
        <tbody>{rows_html}</tbody>
      </table>
    </div>

    <!-- Footer -->
    <div style="text-align:center; padding:12px; font-size:10px; color:#334155;">
      Givon Defense Intelligence Portal · עדכון אוטומטי שבועי<br>
      <a href="{PORTAL_URL}" style="color:#3b82f6; text-decoration:none;">פתח את הפורטל המלא</a>
    </div>

  </div>
</body>
</html>"""


def send_update(new_items: list):
    """שולח מייל לכל הנמענים"""

    if not RECIPIENTS:
        print("⚠️  אין נמענים — הוסף כתובות מייל ל-RECIPIENTS ב-notifier.py")
        return

    if not FROM_EMAIL or not EMAIL_PASS:
        print("⚠️  פרטי מייל חסרים — הגדר GIVON_EMAIL ו-GIVON_EMAIL_PASS")
        return

    if not new_items:
        print("ℹ️  אין פריטים חדשים — מייל לא נשלח")
        return

    scan_date = datetime.now().strftime("%d.%m.%Y · %H:%M")
    critical  = sum(1 for i in new_items if i.get("urgency")=="critical")
    subject   = f"🛡️ Givon Intel — {len(new_items)} פריטים חדשים"
    if critical:
        subject = f"🔴 {subject} ({critical} קריטיים)"

    html = build_email_html(new_items, scan_date)

    try:
        msg = MIMEMultipart("alternative")
        msg["Subject"] = subject
        msg["From"]    = f"Givon Intel <{FROM_EMAIL}>"
        msg["To"]      = ", ".join(RECIPIENTS)
        msg.attach(MIMEText(html, "html", "utf-8"))

        with smtplib.SMTP(SMTP_HOST, SMTP_PORT) as server:
            server.starttls()
            server.login(FROM_EMAIL, EMAIL_PASS)
            server.sendmail(FROM_EMAIL, RECIPIENTS, msg.as_string())

        print(f"✅ מייל נשלח ל-{len(RECIPIENTS)} נמענים: {', '.join(RECIPIENTS)}")

    except Exception as e:
        print(f"❌ שגיאה בשליחת מייל: {e}")
        print("טיפ: ב-Gmail צריך App Password — myaccount.google.com/apppasswords")


if __name__ == "__main__":
    # בדיקה — שולח מייל דמו
    demo_items = [
        {"title":"DIU Counter-UAS Open Call","category":"contracts","fitScore":96,"urgency":"critical","budget":"$8M","deadline":"15.04.2025","url":"https://diu.mil"},
        {"title":"NATO DIANA — Swarm Challenge","category":"grants","fitScore":88,"urgency":"high","prize":"€3.5M","deadline":"01.04.2025","url":"https://diana.nato.int"},
        {"title":"Shield Capital Fund III","category":"investors","fitScore":82,"urgency":"medium","url":"https://shieldcap.com"},
    ]
    send_update(demo_items)
