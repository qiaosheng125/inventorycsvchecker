import type { Metadata } from "next";
import InventoryCsvCheckerApp from "./InventoryCsvCheckerApp";

export const metadata: Metadata = {
  alternates: {
    canonical: "/"
  }
};

export default function HomePage() {
  return <InventoryCsvCheckerApp />;
}
