import type { Metadata } from "next";
import { HpPageV3 } from "@/components/HpPageV3/HpPageV3";

export const metadata: Metadata = {
  title: "HP Subscription Onboarding — Deiver Brito",
  description: "Guided setup for a printer inclusive subscription model.",
  alternates: { languages: { "pt-BR": "/pt/cases/hp", en: "/cases/hp" } },
};

export default function EnHpCase() {
  return <HpPageV3 locale="en" />;
}
