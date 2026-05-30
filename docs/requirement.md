# Requirement: Shopify Inventory CSV Checker

Source candidate file:

`02_候选关键词/第四站需求文档_Shopify_Inventory_CSV_Checker.md`

## MVP

Build a browser-only Shopify inventory CSV checker that compares an original Shopify inventory export with an edited CSV prepared for import.

The tool should detect missing fields, duplicate `SKU + Location`, invalid `On hand (new)`, blank `On hand (current)`, changed current quantities, missing rows, new rows, and unusually large quantity changes.

## Non-Goals

- No Shopify OAuth.
- No store connection.
- No product/customer/order CSV validation.
- No server upload.
- No paid feature in the first version.
