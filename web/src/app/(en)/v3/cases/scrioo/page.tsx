import type { Metadata } from "next";

import { ScriooPageV3 } from "@/components/ScriooPageV3/ScriooPageV3";

export const metadata: Metadata = {
  title: "SCRIOO — Deiver Brito (Portfolio V3 preview)",
  description: "Private review route for the next portfolio version.",
  robots: { index: false, follow: false },
};

export default function EnScriooV3Preview() {
  return <ScriooPageV3 locale="en" />;
}
