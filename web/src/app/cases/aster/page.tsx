import type { Metadata } from "next";
import { isAsterUnlocked } from "./session";
import { PasswordGate } from "./PasswordGate";
import { AsterCase } from "./AsterCase";

// Metadata genérica de propósito: não muda com o estado de desbloqueio
// (não dá nenhuma dica de conteúdo protegido pra quem só vê a aba do
// navegador ou o preview de um link compartilhado), e pede pra motores
// de busca não indexarem — combina com "shared selectively" do case.
export const metadata: Metadata = {
  title: "ASTER — private case study — Deiver Brito",
  description: "A confidential exploration of AI as a clinical collaborator, shared selectively.",
  robots: { index: false, follow: false },
};

export default async function AsterPage() {
  const unlocked = await isAsterUnlocked();

  if (!unlocked) {
    return <PasswordGate />;
  }

  return <AsterCase />;
}
