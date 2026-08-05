import type { Metadata } from "next";
import { TheodoorContent } from "../../../_shared/TheodoorContent";

export const metadata: Metadata = {
  title: "Theodoor — Deiver Brito",
  description: "App acessível para automação de portas inteligentes.",
  alternates: { languages: { "pt-BR": "/pt/cases/theodoor", en: "/cases/theodoor" } },
};

export default function TheodoorCase() {
  return <TheodoorContent locale="pt" />;
}
