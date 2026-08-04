import { Section } from "./Section";
import { AssetPlaceholder } from "../assets/AssetPlaceholder";
import shared from "./shared.module.css";
import type { Locale } from "@/components/NavBar/NavBar";

const COPY: Record<Locale, { eyebrow: string; title: string; keyStatement: string; paragraphs: string[] }> = {
  en: {
    eyebrow: "The hard part",
    title: "The hard part wasn't making the AI do more",
    keyStatement: "It was deciding when “more” would become too much.",
    paragraphs: [
      "Every useful capability created another risk. If ASTER could identify a patient, what happened when it identified the wrong one? If it surfaced an Insight, how would we stop a possibility from looking like medical advice? If it drafted notes, how would the physician know what the AI wrote and what they wrote themselves?",
      "Viability here was never just technical. It also meant workflow fit, clinical safety, day-to-day operation, and who would be accountable if something went wrong — and design could only speak directly to some of those.",
    ],
  },
  pt: {
    eyebrow: "A parte difícil",
    title: "A parte difícil não era fazer a IA fazer mais",
    keyStatement: "Era decidir quando “mais” se tornaria demais.",
    paragraphs: [
      "Cada capacidade útil criava outro risco. Se o ASTER conseguia identificar um paciente, o que acontecia quando identificava o errado? Se ele trazia à tona um Insight, como impedir que uma possibilidade parecesse um conselho médico? Se ele rascunhava notas, como o médico saberia o que a IA escreveu e o que ele mesmo escreveu?",
      "Viabilidade aqui nunca foi só técnica. Também significava adequação ao fluxo de trabalho, segurança clínica, operação do dia a dia e quem seria responsável se algo desse errado — e design só conseguia falar diretamente sobre alguns desses pontos.",
    ],
  },
};

export function TheHardPart({ locale }: { locale: Locale }) {
  const t = COPY[locale];
  return (
    <Section
      id="the-hard-part"
      eyebrow={t.eyebrow}
      title={t.title}
      image={<AssetPlaceholder assetId="aster-figjam-overview" />}
    >
      <p className={shared.keyStatement}>{t.keyStatement}</p>
      {t.paragraphs.map((p) => (
        <p key={p}>{p}</p>
      ))}
    </Section>
  );
}
