# Shopify Inventory CSV Checker

面向海外用户的 Shopify 库存 CSV 导入前检查工具。

当前状态：本地 MVP 已验证，域名 `inventorycsvchecker.com` 已购买，生产站已上线：

`https://www.inventorycsvchecker.com`

## 本地开发

```bash
npm install
npm run dev
```

## 边界

- 非 Shopify 官方工具。
- 文件留在浏览器本地处理。
- 不做 Shopify OAuth。
- 不做真实库存同步。
- 不做服务端 CSV 上传。

## 环境变量

- `NEXT_PUBLIC_SITE_URL`：最终 canonical 域名，例如 `https://www.inventorycsvchecker.com`。
- `NEXT_PUBLIC_GA_MEASUREMENT_ID`：可选 GA4 ID。
- `NEXT_PUBLIC_CLARITY_ID`：可选 Microsoft Clarity ID。
