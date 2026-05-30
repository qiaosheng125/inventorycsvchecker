# Shopify Inventory CSV Checker

Browser-based Shopify inventory CSV pre-import checker.

Status: local MVP verified. Domain purchased: `inventorycsvchecker.com`. Production deployment is not live yet.

## Local Development

```bash
npm install
npm run dev
```

## Boundaries

- Not affiliated with Shopify.
- Files stay in the browser.
- No Shopify OAuth.
- No real inventory sync.
- No server-side file upload.

## Environment Variables

- `NEXT_PUBLIC_SITE_URL`: final canonical domain, for example `https://www.inventorycsvchecker.com`.
- `NEXT_PUBLIC_GA_MEASUREMENT_ID`: optional GA4 ID.
- `NEXT_PUBLIC_CLARITY_ID`: optional Microsoft Clarity ID.
