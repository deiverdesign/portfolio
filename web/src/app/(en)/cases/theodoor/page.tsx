import type { Metadata } from "next";
import { TheodoorPageV3 } from "@/components/TheodoorPageV3/TheodoorPageV3";

export const metadata: Metadata = {
  title: "Theodoor — Deiver Brito",
  description: "Accessible app for smart door automation.",
  alternates: { languages: { "pt-BR": "/pt/cases/theodoor", en: "/cases/theodoor" } },
};

export default function EnTheodoorCase() {
  return <TheodoorPageV3 locale="en" />;
}
