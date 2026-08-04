import type { Metadata } from "next";
import { CapabilitiesContent } from "../../_shared/CapabilitiesContent";

export const metadata: Metadata = {
  title: "Capabilities — Deiver Brito",
  description: "Complex systems, design systems, AI-assisted prototyping, accessibility and data-heavy UX.",
  alternates: { languages: { "pt-BR": "/competencias", en: "/en/capabilities" } },
};

export default function EnCapabilitiesPage() {
  return <CapabilitiesContent locale="en" />;
}
