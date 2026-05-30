# Shopify Inventory CSV Checker Launch Checklist

## Before Domain

- [x] SERP competitor table complete.
- [x] Domain candidates listed.
- [x] Trademark-safe name chosen.
- [x] Local build passes.
- [x] Smoke check passes.
- [x] Domain purchased: `inventorycsvchecker.com`.

## Before Indexing

- [x] Final domain configured: `https://www.inventorycsvchecker.com`.
- [x] `NEXT_PUBLIC_SITE_URL` fallback set to the final canonical domain.
- [x] Canonical URL uses `siteUrl`.
- [x] Sitemap URL uses `siteUrl`.
- [x] robots sitemap uses `siteUrl`.
- [x] About, Contact, Privacy pages present.
- [x] Not affiliated with Shopify statement visible.
- [x] Local processing statement visible.
- [x] Production deployment created.
- [x] Domain bound to production deployment in Vercel.
- [x] HTTPS verified.
- [ ] GSC submitted.
- [ ] Bing submitted.
- [ ] GA4 installed.
- [ ] Clarity installed.

## DNS Records Needed In Cloudflare

Vercel reported the domain is using Cloudflare nameservers:

- `everton.ns.cloudflare.com`
- `mona.ns.cloudflare.com`

Add these records in Cloudflare DNS:

| Type | Name | Value | Proxy |
|---|---|---|---|
| A | `@` | `76.76.21.21` | DNS only |
| A | `www` | `76.76.21.21` | DNS only |

After propagation, verify:

- [x] `https://www.inventorycsvchecker.com`
- [x] `https://inventorycsvchecker.com` redirects to `https://www.inventorycsvchecker.com`
- [x] `https://www.inventorycsvchecker.com/robots.txt`
- [x] `https://www.inventorycsvchecker.com/sitemap.xml`

## Production Verification

- `curl -I https://www.inventorycsvchecker.com`: 200 OK.
- `curl -I https://inventorycsvchecker.com`: 308 redirect to `https://www.inventorycsvchecker.com/`.
- `BASE_URL=https://www.inventorycsvchecker.com npm run smoke`: passed.
