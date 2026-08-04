import type { Metadata } from "next";
import { HpContent } from "../../../_shared/HpContent";

export const metadata: Metadata = {
  title: "HP Subscription Onboarding — Deiver Brito",
  description: "Configuração guiada para um modelo de assinatura com impressora incluída.",
  alternates: { languages: { "pt-BR": "/cases/hp", en: "/en/cases/hp" } },
};

export default function HpCase() {
  return <HpContent locale="pt" />;
}
