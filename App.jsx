name: Givon Intel — Weekly Scan

on:
  schedule:
    - cron: '0 6 * * 0'  # ראשון בשעה 08:00 (UTC+2)
    - cron: '0 6 * * 3'  # רביעי בשעה 08:00 (UTC+2)
  workflow_dispatch:       # הרצה ידנית בלחיצת כפתור

jobs:
  scan-and-analyze:
    runs-on: ubuntu-latest

    # נותן הרשאות כתיבה ל-Action כדי שיוכל לעדכן את ה-Repo
    permissions:
      contents: write

    steps:
      - name: Checkout repo
        uses: actions/checkout@v4
        with:
          fetch-depth: 0  # מבטיח היסטוריה מלאה ל-Push תקין

      - name: Setup Python
        uses: actions/setup-python@v5
        with:
          python-version: '3.11'

      - name: Install dependencies
        run: |
          pip install anthropic requests feedparser

      - name: Run Intel Scan
        env:
          ANTHROPIC_API_KEY: ${{ secrets.ANTHROPIC_API_KEY }}
          SAM_GOV_API_KEY: ${{ secrets.SAM_GOV_API_KEY }}
          NOTIFY_EMAIL: ${{ secrets.NOTIFY_EMAIL }}
          NOTIFY_PASSWORD: ${{ secrets.NOTIFY_PASSWORD }}
        run: |
          cd agents
          python run.py --no-push
        continue-on-error: false

      - name: Commit and Push Updates
        run: |
          git config user.name "Givon Intel Bot"
          git config user.email "bot@givon-defense.com"

          # הוספת הנתונים וה-Hashes (הזיכרון לחיסכון בכסף)
          git add givon-app/src/opportunities.json
          git add agents/analyzed_hashes.json || true

          # ביצוע commit רק אם יש שינויים
          if git diff --staged --quiet; then
            echo "No changes to commit"
          else
            git commit -m "🤖 Intel update — $(date '+%Y-%m-%d %H:%M')"
            git push
          fi
