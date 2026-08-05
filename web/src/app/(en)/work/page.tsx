import type { Metadata } from "next";
import { WorkContent } from "../../_shared/WorkContent";

export const metadata: Metadata = {
  title: "Work — Deiver Brito",
  description: "A focused selection of product design work across complex platforms, service UX, accessibility, AI-assisted prototyping, and product discovery.",
  alternates: { languages: { "pt-BR": "/pt/work", en: "/work" } },
};

export default function EnWorkPage() {
  return <WorkContent locale="en" />;
}
