# Requirement: Shopify Inventory CSV Checker

Source candidate file:

历史来源文档已删除；当前需求判断以后续 `docs/01_research.md` 或当前 SOP 为准。

## MVP

Build a browser-only Shopify inventory CSV checker that compares an original Shopify inventory export with an edited CSV prepared for import.

The tool should detect missing fields, duplicate `SKU + Location`, invalid `On hand (new)`, blank `On hand (current)`, changed current quantities, missing rows, new rows, and unusually large quantity changes.

## Non-Goals

- No Shopify OAuth.
- No store connection.
- No product/customer/order CSV validation.
- No server upload.
- No paid feature in the first version.
