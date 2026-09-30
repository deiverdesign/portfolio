import type { Metadata } from "next";

import { TheodoorPageV3 } from "@/components/TheodoorPageV3/TheodoorPageV3";

export const metadata: Metadata = { title: "Theodoor — Deiver Brito (Portfolio V3 preview)", description: "Private review route for the next portfolio version.", robots: { index: false, follow: false } };

export default function EnTheodoorV3Preview() { return <TheodoorPageV3 locale="en" />; }
