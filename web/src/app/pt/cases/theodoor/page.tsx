import type { Metadata } from "next";
import { TheodoorPageV3 } from "@/components/TheodoorPageV3/TheodoorPageV3";

export const metadata: Metadata = {
  title: "Theodoor — Deiver Brito",
  description: "App acessível para automação de portas inteligentes.",
  alternates: { languages: { "pt-BR": "/pt/cases/theodoor", en: "/cases/theodoor" } },
};

export default function TheodoorCase() {
  return <TheodoorPageV3 locale="pt" />;
}
