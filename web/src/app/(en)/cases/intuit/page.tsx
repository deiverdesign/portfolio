import type { Metadata } from "next";
import { IntuitPageV3 } from "@/components/IntuitPageV3/IntuitPageV3";

export const metadata: Metadata = {
  title: "Intuit for Education — Deiver Brito",
  description: "Financial education experience for students.",
  alternates: { languages: { "pt-BR": "/pt/cases/intuit", en: "/cases/intuit" } },
};

export default function EnIntuitCase() {
  return <IntuitPageV3 locale="en" />;
}
