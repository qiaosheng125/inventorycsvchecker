import { ImageResponse } from "next/og";

export const runtime = "edge";
export const size = {
  width: 1200,
  height: 630
};
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          background: "#f4f7f2",
          color: "#162014",
          padding: 72,
          fontFamily: "Arial, sans-serif"
        }}
      >
        <div style={{ fontSize: 30, fontWeight: 800, color: "#26734d" }}>
          Shopify Inventory CSV Checker
        </div>
        <div
          style={{
            marginTop: 28,
            width: 920,
            fontSize: 78,
            fontWeight: 900,
            lineHeight: 0.98
          }}
        >
          Check stock import risks before CSV upload.
        </div>
        <div style={{ marginTop: 32, fontSize: 30, color: "#5d6959" }}>
          SKU, Location, On hand current/new, duplicate rows, overwrite risks.
        </div>
      </div>
    ),
    size
  );
}
