import type { Metadata } from "next";
import { CapabilitiesContent } from "../../_shared/CapabilitiesContent";

export const metadata: Metadata = {
  title: "Competências — Deiver Brito",
  description: "Sistemas complexos, design systems, prototipação assistida por IA, acessibilidade e UX denso em dados.",
  alternates: { languages: { "pt-BR": "/competencias", en: "/en/capabilities" } },
};

export default function CompetenciasPage() {
  return <CapabilitiesContent locale="pt" />;
}
