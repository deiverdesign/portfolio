import type { Metadata } from "next";
import { CureContent } from "../../../_shared/CureContent";

export const metadata: Metadata = {
  title: "CURE Intelligence / SCRIOO — Deiver Brito",
  description: "AI-powered supply chain risk intelligence platform.",
  alternates: { languages: { "pt-BR": "/pt/cases/cure", en: "/cases/cure" } },
};

export default function EnCureCase() {
  return <CureContent locale="en" />;
}
