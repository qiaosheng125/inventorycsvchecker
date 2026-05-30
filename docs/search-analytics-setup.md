# 搜索引擎和统计配置清单

站点：Shopify Inventory CSV Checker

生产地址：`https://www.inventorycsvchecker.com`

## 当前状态

- [x] 生产站已上线。
- [x] HTTPS 已验证。
- [x] `https://inventorycsvchecker.com` 已跳转到 `https://www.inventorycsvchecker.com/`。
- [x] `robots.txt` 可访问：`https://www.inventorycsvchecker.com/robots.txt`
- [x] `sitemap.xml` 可访问：`https://www.inventorycsvchecker.com/sitemap.xml`
- [x] GA4 / Clarity 前端注入代码已存在。
- [x] 核心事件埋点代码已加入，但需要 GA4 / Clarity ID 才会生效。

## 需要用户后台操作

### 1. Google Search Console

建议添加 URL 前缀资源：

```text
https://www.inventorycsvchecker.com
```

提交 sitemap：

```text
https://www.inventorycsvchecker.com/sitemap.xml
```

提交后请求首页编入索引：

```text
https://www.inventorycsvchecker.com/
```

### 2. Bing Webmaster Tools

优先从 GSC 导入站点。

导入后确认 sitemap：

```text
https://www.inventorycsvchecker.com/sitemap.xml
```

### 3. GA4

创建 Web data stream，网址填：

```text
https://www.inventorycsvchecker.com
```

拿到 Measurement ID 后发给我，格式类似：

```text
G-XXXXXXXXXX
```

我会设置 Vercel 环境变量：

```text
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
```

### 4. Microsoft Clarity

创建项目，站点填：

```text
https://www.inventorycsvchecker.com
```

拿到 Project ID 后发给我，格式通常是一串小写字母/数字。

我会设置 Vercel 环境变量：

```text
NEXT_PUBLIC_CLARITY_ID=xxxxxxxxxx
```

## 已加入的前端事件

这些事件只记录用户动作，不记录 CSV 内容、SKU、库存数量或文件名。

| 事件名 | 触发时机 |
|---|---|
| `upload_original_csv` | 用户上传原始 CSV |
| `upload_edited_csv` | 用户上传编辑后 CSV |
| `download_issue_report` | 用户下载问题报告 |
| `download_change_report` | 用户下载变更报告 |
| `copy_ai_fix_prompt` | 用户复制 AI 修复 prompt |

## 拿到 GA4 / Clarity ID 后的部署步骤

设置 Vercel 环境变量后需要重新部署：

```powershell
npm exec --yes vercel@latest -- env add NEXT_PUBLIC_GA_MEASUREMENT_ID production
npm exec --yes vercel@latest -- env add NEXT_PUBLIC_CLARITY_ID production
npm exec --yes vercel@latest -- --prod --yes
```

部署后验证：

- 首页 HTML 或 JS bundle 中能看到 GA4 ID。
- 首页 HTML 或 JS bundle 中能看到 Clarity ID。
- GA4 Realtime 能看到访问。
- Clarity 能收到 session。
