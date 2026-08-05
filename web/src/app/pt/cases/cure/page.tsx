import type { Metadata } from "next";
import { CureContent } from "../../../_shared/CureContent";

export const metadata: Metadata = {
  title: "CURE Intelligence / SCRIOO — Deiver Brito",
  description: "Plataforma de inteligência de riscos em supply chain com IA.",
  alternates: { languages: { "pt-BR": "/pt/cases/cure", en: "/cases/cure" } },
};

export default function CureCase() {
  return <CureContent locale="pt" />;
}
