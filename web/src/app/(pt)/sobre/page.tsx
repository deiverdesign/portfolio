import type { Metadata } from "next";
import { AboutContent } from "../../_shared/AboutContent";

export const metadata: Metadata = {
  title: "Sobre — Deiver Brito",
  description: "Product Designer Sênior no Brasil, com experiência em produtos enterprise, legal tech e design systems.",
  alternates: { languages: { "pt-BR": "/sobre", en: "/en/about" } },
};

export default function SobrePage() {
  return <AboutContent locale="pt" />;
}
