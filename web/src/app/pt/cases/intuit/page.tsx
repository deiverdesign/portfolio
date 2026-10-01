import type { Metadata } from "next";
import { IntuitPageV3 } from "@/components/IntuitPageV3/IntuitPageV3";

export const metadata: Metadata = {
  title: "Intuit for Education — Deiver Brito",
  description: "Experiência de educação financeira para estudantes.",
  alternates: { languages: { "pt-BR": "/pt/cases/intuit", en: "/cases/intuit" } },
};

export default function IntuitCase() {
  return <IntuitPageV3 locale="pt" />;
}
