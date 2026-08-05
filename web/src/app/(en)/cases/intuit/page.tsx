import type { Metadata } from "next";
import { IntuitContent } from "../../../_shared/IntuitContent";

export const metadata: Metadata = {
  title: "Intuit for Education — Deiver Brito",
  description: "Financial education experience for students.",
  alternates: { languages: { "pt-BR": "/pt/cases/intuit", en: "/cases/intuit" } },
};

export default function EnIntuitCase() {
  return <IntuitContent locale="en" />;
}
