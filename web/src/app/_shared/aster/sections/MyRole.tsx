import { Section } from "./Section";
import type { Locale } from "@/components/NavBar/NavBar";

const COPY: Record<Locale, { eyebrow: string; title: string; paragraphs: string[] }> = {
  en: {
    eyebrow: "My role",
    title: "Who made this, and what I actually did",
    paragraphs: [
      "I was the only product designer on this project, working alongside one PM, three software engineers and one QA.",
      "I was responsible for designing the product experience, core workflows and interaction behaviors shown in this case. The work developed through conversations with the wider team, but the design direction and artifacts presented here represent my contribution.",
      "The interactive prototype you can try today is a later portfolio reconstruction, built independently by me using fictional data. It is not the original client interface.",
    ],
  },
  pt: {
    eyebrow: "Meu papel",
    title: "Quem fez isso, e o que eu realmente fiz",
    paragraphs: [
      "Eu era o único product designer neste projeto, trabalhando ao lado de um PM, três engenheiros de software e um QA.",
      "Fui responsável por desenhar a experiência de produto, os fluxos centrais e os comportamentos de interação mostrados neste case. O trabalho se desenvolveu através de conversas com o time mais amplo, mas a direção de design e os artefatos apresentados aqui representam minha contribuição.",
      "O protótipo interativo que você pode testar hoje é uma reconstrução de portfólio posterior, construída de forma independente por mim usando dados fictícios. Não é a interface original do cliente.",
    ],
  },
};

export function MyRole({ locale }: { locale: Locale }) {
  const t = COPY[locale];
  return (
    <Section id="my-role" eyebrow={t.eyebrow} title={t.title}>
      {t.paragraphs.map((p) => (
        <p key={p}>{p}</p>
      ))}
    </Section>
  );
}
