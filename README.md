# Neex Creative — Portfolio Website

Source code for the **Neex Creative** portfolio — a multidisciplinary design studio based in Dublin, Ireland.

## Live

- **Production:** https://www.neexcreative.com
- **Vercel:** https://neexcreativeio.vercel.app

---

## Project Structure

```
/
├── index.html          — Homepage
├── about.html          — About Marlon
├── book.html           — Book a Call (Calendly)
├── favicon.ico
├── robots.txt
├── sitemap.xml
│
└── assets/
    ├── css/
    │   └── style.css   — Global design system
    ├── js/
    │   └── main.js     — Scroll reveal, nav active state, year
    ├── img/
    │   ├── logo.png
    │   ├── hero-bg.png
    │   ├── marlon.png
    │   └── projects/   — Project thumbnails (project-01.png … project-08.png)
    ├── icons/          — Favicons and webmanifest
    └── docs/
        └── Resume-MarlonFranca2026.pdf
```

---

## Run Locally

1. Install **Live Server** in VS Code
2. Right-click `index.html` → **Open with Live Server**

---

## Deploy

```bash
git add .
git commit -m "describe your change here"
git push origin main
```

Vercel deploys automatically on every push to `main`.
GitHub Pages updates within 1–2 minutes.

---

## Stack

HTML · CSS · Vanilla JS · Hosted on Vercel + GitHub Pages