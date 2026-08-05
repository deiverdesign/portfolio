import type { Metadata } from "next";
import { TheodoorContent } from "../../../_shared/TheodoorContent";

export const metadata: Metadata = {
  title: "Theodoor — Deiver Brito",
  description: "Accessible app for smart door automation.",
  alternates: { languages: { "pt-BR": "/pt/cases/theodoor", en: "/cases/theodoor" } },
};

export default function EnTheodoorCase() {
  return <TheodoorContent locale="en" />;
}
