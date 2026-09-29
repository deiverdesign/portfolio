import type { Metadata } from "next";

import { HomeV3 } from "@/components/HomeV3/HomeV3";

export const metadata: Metadata = {
  title: "Deiver Brito — Portfolio V3 preview",
  description: "Private review route for the next portfolio version.",
  robots: { index: false, follow: false },
};

export default function EnHomeV3Preview() {
  return <HomeV3 locale="en" />;
}
