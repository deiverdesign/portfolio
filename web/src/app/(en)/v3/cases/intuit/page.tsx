import type { Metadata } from "next";

import { IntuitPageV3 } from "@/components/IntuitPageV3/IntuitPageV3";

export const metadata: Metadata = { title: "Intuit — Deiver Brito (Portfolio V3 preview)", description: "Private review route for the next portfolio version.", robots: { index: false, follow: false } };

export default function EnIntuitV3Preview() { return <IntuitPageV3 locale="en" />; }
