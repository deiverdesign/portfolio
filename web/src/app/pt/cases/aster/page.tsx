import type { Metadata } from "next";
import { isAsterUnlocked } from "@/app/_shared/aster/session";
import { PasswordGate } from "@/app/_shared/aster/PasswordGate";
import { AsterCase } from "@/app/_shared/aster/AsterCase";

// Metadata genérica de propósito: não muda com o estado de desbloqueio
// (não dá nenhuma dica de conteúdo protegido pra quem só vê a aba do
// navegador ou o preview de um link compartilhado), e pede pra motores
// de busca não indexarem — combina com "compartilhado seletivamente" do case.
export const metadata: Metadata = {
  title: "ASTER — case privado — Deiver Brito",
  description: "Uma exploração confidencial de IA como colaboradora clínica, compartilhada seletivamente.",
  robots: { index: false, follow: false },
  alternates: { languages: { "pt-BR": "/pt/cases/aster", en: "/cases/aster" } },
};

export default async function AsterPage() {
  const unlocked = await isAsterUnlocked();

  if (!unlocked) {
    return <PasswordGate locale="pt" />;
  }

  return <AsterCase locale="pt" />;
}
