# OtzariaAI Website

אתר GitHub Pages הסטטי של `OtzariaAI`.

## מה יש כאן

- עמוד שיווקי בעברית עבור המוצר
- נכסי מדיה מקומיים בתוך `assets/`
- פריסת GitHub Pages דרך GitHub Actions

## מבנה קצר

- `index.html` - עמוד הבית
- `styles.css` - עיצוב האתר
- `script.js` - אינטראקציות קלות ואנימציות reveal
- `assets/` - תמונות מסך ונכסי מותג
- `.github/workflows/deploy-pages.yml` - פריסה אוטומטית ל־GitHub Pages

## פיתוח מקומי

אפשר לפתוח את `index.html` ישירות בדפדפן, או להריץ שרת סטטי פשוט:

```powershell
python -m http.server 8080
```

ואז לפתוח:

```text
http://127.0.0.1:8080
```

## פרסום

המאגר מיועד להתפרסם כאתר פרויקט בכתובת:

`https://arieldaniely.github.io/otzariaai-site/`

לאחר דחיפה ל־`main`, ה־workflow יעלה את האתר ל־GitHub Pages.
