# Shopify Inventory CSV Checker Review

## Current Status

- Date: 2026-05-30
- Stage: domain purchased; pre-deploy
- Domain: `inventorycsvchecker.com` purchased
- Production URL: deployed on Vercel; DNS not verified yet
- GSC/Bing/GA4/Clarity: not configured

## Launch Gate

This project should not be considered L0 until:

- Domain direction is approved. Done: `inventorycsvchecker.com`.
- HTTPS production URL works.
- GSC and Bing are submitted.
- GA4 and Clarity are installed.
- Sitemap and robots use the final domain.
- The checker passes local build and smoke checks.

## 2026-05-30 Local Verification

- `npm run build`: passed.
- `BASE_URL=http://127.0.0.1:3004 npm run smoke`: passed.
- `npm install`: 0 vulnerabilities after `postcss` override.
- CSV parsing uses `papaparse`.
- `NEXT_PUBLIC_SITE_URL` support added so canonical, robots, and sitemap can be switched with one environment variable.
- Change report table and downloadable change report added.

## 2026-05-30 Domain Update

- Domain purchased by user: `inventorycsvchecker.com`.
- Canonical production target: `https://www.inventorycsvchecker.com`.
- Code fallback already uses `https://www.inventorycsvchecker.com`.
- GitHub repo: `https://github.com/qiaosheng125/inventorycsvchecker`
- Vercel production aliases:
  - `https://inventorycsvchecker.com`
  - `https://www.inventorycsvchecker.com`
  - `https://004shopify-inventory-csv-checker.vercel.app`
- Vercel deployment inspected as ready.
- DNS still needs Cloudflare records:
  - `A @ 76.76.21.21`
  - `A www 76.76.21.21`
- Next external steps: Cloudflare DNS, HTTPS verification, GSC/Bing, GA4, and Clarity.
