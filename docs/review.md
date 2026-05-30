# Shopify Inventory CSV Checker 复盘记录

## 当前状态

- 日期：2026-05-30
- 阶段：已上线，待接入站长工具和统计。
- 域名：`inventorycsvchecker.com`
- 生产地址：`https://www.inventorycsvchecker.com`
- GSC / Bing：未配置。
- GA4：已安装，`G-5BQL6W3F74`。
- Clarity：已安装，`wz70095ban`。

## 上线门槛

本站达到 L0 还需要完成：

- [x] 域名方向确认：`inventorycsvchecker.com`。
- [x] HTTPS 生产地址可访问。
- [ ] GSC 和 Bing 提交。
- [x] GA4 和 Clarity 安装。
- [x] sitemap 和 robots 使用最终域名。
- [x] 检查器通过本地 build 和 smoke。

## 2026-05-30 本地验证

- `npm run build`：通过。
- `BASE_URL=http://127.0.0.1:3004 npm run smoke`：通过。
- `npm install`：通过，`postcss` override 后 0 vulnerabilities。
- CSV 解析使用 `papaparse`。
- 已加入 `NEXT_PUBLIC_SITE_URL`，canonical、robots、sitemap 可通过一个环境变量切换。
- 已加入 issue report 和 change report 下载。

## 2026-05-30 域名与部署

- 用户已购买域名：`inventorycsvchecker.com`。
- canonical 生产目标：`https://www.inventorycsvchecker.com`。
- GitHub 仓库：`https://github.com/qiaosheng125/inventorycsvchecker`
- Vercel 项目：`004_shopify-inventory-csv-checker`
- Vercel aliases：
  - `https://inventorycsvchecker.com`
  - `https://www.inventorycsvchecker.com`
  - `https://004shopify-inventory-csv-checker.vercel.app`
- Vercel deployment 状态：Ready。
- DNS 已解析到 Vercel。
- HTTPS 已验证。
- `https://inventorycsvchecker.com` 已跳转到 `https://www.inventorycsvchecker.com/`。
- `BASE_URL=https://www.inventorycsvchecker.com npm run smoke`：通过。
- GA4：已安装并在线上 HTML 中验证。
- Clarity：已安装并在线上 HTML 中验证。

## 下一步

- 提交 GSC。
- 提交 Bing Webmaster。
- 建立 7 / 14 / 30 天复盘记录。

## 2026-05-30 统计事件准备

- GA4 / Clarity 注入代码已存在，Vercel production 环境变量已配置。
- 已加入不含敏感内容的前端事件：
  - `upload_original_csv`
  - `upload_edited_csv`
  - `download_issue_report`
  - `download_change_report`
  - `copy_ai_fix_prompt`
- 配置步骤见：`docs/search-analytics-setup.md`

## 2026-05-30 GA4 / Clarity 安装验证

- Vercel 环境变量：
  - `NEXT_PUBLIC_GA_MEASUREMENT_ID`
  - `NEXT_PUBLIC_CLARITY_ID`
- 正式域名 smoke：通过。
- 线上 HTML 检测到：
  - `https://www.googletagmanager.com/gtag/js?id=G-5BQL6W3F74`
  - `gtag('config', 'G-5BQL6W3F74')`
  - `https://www.clarity.ms/tag/`
  - `wz70095ban`

## 2026-05-30 用第 2 站检测第 4 站

使用 `https://www.nextseochecker.com/api/check` 检测：

```txt
https://www.inventorycsvchecker.com
```

结果：

```txt
critical: 0
warning: 0
passed: 13
```

通过项：

- 首页返回 200。
- 重定向链短。
- 未发现 `noindex`。
- canonical 指向本站。
- title 存在。
- meta description 存在。
- H1 存在。
- `robots.txt` 不阻止首页。
- `robots.txt` 包含 sitemap。
- `sitemap.xml` 可读取。
- sitemap URL 使用同一主域。
- Open Graph 基础信息存在。
- 未配置 JSON-LD，但简单工具页可接受。

抽样 sitemap URL 均返回 200：

- `https://www.inventorycsvchecker.com/`
- `https://www.inventorycsvchecker.com/about`
- `https://www.inventorycsvchecker.com/contact`
- `https://www.inventorycsvchecker.com/privacy`
