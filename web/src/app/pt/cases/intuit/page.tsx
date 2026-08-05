import type { Metadata } from "next";
import { IntuitContent } from "../../../_shared/IntuitContent";

export const metadata: Metadata = {
  title: "Intuit for Education — Deiver Brito",
  description: "Experiência de educação financeira para estudantes.",
  alternates: { languages: { "pt-BR": "/pt/cases/intuit", en: "/cases/intuit" } },
};

export default function IntuitCase() {
  return <IntuitContent locale="pt" />;
}
