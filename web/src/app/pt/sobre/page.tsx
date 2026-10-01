import type { Metadata } from "next";
import { AboutPageV3 } from "@/components/AboutPageV3/AboutPageV3";

export const metadata: Metadata = {
  title: "Sobre — Deiver Brito",
  description: "Product Designer Sênior no Brasil, com experiência em produtos enterprise, legal tech e design systems.",
  alternates: { languages: { "pt-BR": "/pt/sobre", en: "/about" } },
};

export default function SobrePage() {
  return <AboutPageV3 locale="pt" />;
}
