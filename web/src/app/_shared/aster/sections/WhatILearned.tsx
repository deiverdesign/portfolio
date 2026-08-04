import { Section } from "./Section";
import type { Locale } from "@/components/NavBar/NavBar";

const COPY: Record<Locale, { eyebrow: string; title: string; paragraphs: string[] }> = {
  en: {
    eyebrow: "Closing reflection",
    title: "What I learned",
    paragraphs: [
      "I started by asking what an AI assistant could add to a consultation.",
      "I left with a better question: under what conditions should it act, wait, ask for confirmation, or stop.",
      "For a clinical product, capability was only half of the design problem. The other half was keeping uncertainty, authorship and human control visible.",
    ],
  },
  pt: {
    eyebrow: "Reflexão final",
    title: "O que eu aprendi",
    paragraphs: [
      "Comecei perguntando o que um assistente de IA poderia acrescentar a uma consulta.",
      "Terminei com uma pergunta melhor: sob quais condições ele deveria agir, esperar, pedir confirmação ou parar.",
      "Para um produto clínico, capacidade era só metade do problema de design. A outra metade era manter incerteza, autoria e controle humano visíveis.",
    ],
  },
};

export function WhatILearned({ locale }: { locale: Locale }) {
  const t = COPY[locale];
  return (
    <Section id="what-i-learned" eyebrow={t.eyebrow} title={t.title}>
      {t.paragraphs.map((p) => (
        <p key={p}>{p}</p>
      ))}
    </Section>
  );
}
