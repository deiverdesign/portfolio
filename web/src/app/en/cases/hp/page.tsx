import type { Metadata } from "next";
import { HpContent } from "../../../_shared/HpContent";

export const metadata: Metadata = {
  title: "HP Subscription Onboarding — Deiver Brito",
  description: "Guided setup for a printer inclusive subscription model.",
  alternates: { languages: { "pt-BR": "/cases/hp", en: "/en/cases/hp" } },
};

export default function EnHpCase() {
  return <HpContent locale="en" />;
}
