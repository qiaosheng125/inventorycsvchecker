# Shopify Inventory CSV Checker 上线清单

## 域名前

- [x] SERP 竞品表已完成。
- [x] 域名候选已列出。
- [x] 商标安全命名已确认。
- [x] 本地构建通过。
- [x] 本地 smoke 检查通过。
- [x] 域名已购买：`inventorycsvchecker.com`。

## 收录前

- [x] 最终域名已确定：`https://www.inventorycsvchecker.com`。
- [x] `NEXT_PUBLIC_SITE_URL` 默认值已设为最终 canonical 域名。
- [x] canonical URL 使用 `siteUrl`。
- [x] sitemap URL 使用 `siteUrl`。
- [x] robots sitemap 使用 `siteUrl`。
- [x] About、Contact、Privacy 页面已存在。
- [x] 首页有 `Not affiliated with Shopify` 声明。
- [x] 首页有本地处理声明。
- [x] Vercel 生产部署已创建。
- [x] 域名已绑定到 Vercel 项目。
- [x] HTTPS 已验证。
- [ ] GSC 已提交。
- [ ] Bing Webmaster 已提交。
- [x] GA4 已安装：`G-5BQL6W3F74`。
- [x] Clarity 已安装：`wz70095ban`。
- [x] GA4 / Clarity 注入代码已预留。
- [x] 核心前端事件已埋点，等待 GA4 / Clarity ID 生效。
- [x] 线上 HTML 已验证包含 GA4 和 Clarity 脚本。

## Cloudflare DNS 记录

Vercel 检测到当前使用 Cloudflare nameserver：

- `everton.ns.cloudflare.com`
- `mona.ns.cloudflare.com`

已完成的 DNS 指向目标：

| 类型 | 名称 | 值 | 代理状态 |
|---|---|---|---|
| A | `@` | `76.76.21.21` | DNS only |
| A | `www` | `76.76.21.21` | DNS only |

## 生产验证

- [x] `https://www.inventorycsvchecker.com` 返回 200。
- [x] `https://inventorycsvchecker.com` 308 跳转到 `https://www.inventorycsvchecker.com/`。
- [x] `https://www.inventorycsvchecker.com/robots.txt` 可访问。
- [x] `https://www.inventorycsvchecker.com/sitemap.xml` 可访问。
- [x] `BASE_URL=https://www.inventorycsvchecker.com npm run smoke` 通过。
