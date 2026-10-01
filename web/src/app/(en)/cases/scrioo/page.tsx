import type { Metadata } from "next";

import { ScriooPageV3 } from "@/components/ScriooPageV3/ScriooPageV3";

export const metadata: Metadata = {
  title: "SCRIOO — Deiver Brito",
  description: "AI-powered supply chain risk intelligence platform.",
  alternates: { languages: { "pt-BR": "/pt/cases/scrioo", en: "/cases/scrioo" } },
};

export default function EnScriooCase() {
  return <ScriooPageV3 locale="en" />;
}
