import type { Metadata } from "next";

import { HpPageV3 } from "@/components/HpPageV3/HpPageV3";

export const metadata: Metadata = {
  title: "HP — Deiver Brito (Portfolio V3 preview)",
  description: "Private review route for the next portfolio version.",
  robots: { index: false, follow: false },
};

export default function EnHpV3Preview() {
  return <HpPageV3 locale="en" />;
}
