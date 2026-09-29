import type { Metadata } from "next";

import { AboutPageV3 } from "@/components/AboutPageV3/AboutPageV3";

export const metadata: Metadata = {
  title: "Deiver Brito — About (Portfolio V3 preview)",
  description: "Private review route for the next portfolio version.",
  robots: { index: false, follow: false },
};

export default function EnAboutV3Preview() {
  return <AboutPageV3 locale="en" />;
}
