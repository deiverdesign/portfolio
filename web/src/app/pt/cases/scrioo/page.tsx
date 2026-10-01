import type { Metadata } from "next";

import { ScriooPageV3 } from "@/components/ScriooPageV3/ScriooPageV3";

export const metadata: Metadata = {
  title: "SCRIOO — Deiver Brito",
  description: "Plataforma de inteligência de riscos em supply chain com IA.",
  alternates: { languages: { "pt-BR": "/pt/cases/scrioo", en: "/cases/scrioo" } },
};

export default function PtScriooCase() {
  return <ScriooPageV3 locale="pt" />;
}
