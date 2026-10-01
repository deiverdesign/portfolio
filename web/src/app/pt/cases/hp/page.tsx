import type { Metadata } from "next";
import { HpPageV3 } from "@/components/HpPageV3/HpPageV3";

export const metadata: Metadata = {
  title: "HP Subscription Onboarding — Deiver Brito",
  description: "Configuração guiada para um modelo de assinatura com impressora incluída.",
  alternates: { languages: { "pt-BR": "/pt/cases/hp", en: "/cases/hp" } },
};

export default function HpCase() {
  return <HpPageV3 locale="pt" />;
}
