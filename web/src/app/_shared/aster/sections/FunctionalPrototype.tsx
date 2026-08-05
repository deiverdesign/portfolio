import { AssetPlaceholder } from "../assets/AssetPlaceholder";
import { Section } from "./Section";
import { ExternalLink } from "./ExternalLink";
import { ASTER_PROTOTYPE_URL } from "./links";
import shared from "./shared.module.css";
import type { Locale } from "@/components/NavBar/NavBar";

const COPY: Record<Locale, {
  eyebrow: string;
  title: string;
  intro: string;
  presentLabel: string;
  present: string[];
  absent: string;
  keyStatement: string;
  cta: string;
}> = {
  en: {
    eyebrow: "The functional prototype",
    title: "Is this real? Can I try it?",
    intro:
      "I later rebuilt ASTER as a functional portfolio prototype so the interaction model could be experienced, not only described.",
    presentLabel: "What's actually there:",
    present: [
      "One complete Known Patient scenario, plus selectable representations of Unknown Patient and Ambiguous Match",
      "Live transcript playback",
      "Restrained Insights",
      "AI Draft",
      "Physician-authored notes",
      "Autosave",
      "Delete and Undo",
      "Notes preserved after Restart",
    ],
    absent:
      "What isn't: this uses fictional data, there's no clinical backend, and it doesn't reproduce the original client interface.",
    keyStatement: "It can demonstrate interaction behavior. It cannot prove safety.",
    cta: "Explore the interactive prototype",
  },
  pt: {
    eyebrow: "O protótipo funcional",
    title: "Isso é real? Posso testar?",
    intro:
      "Depois reconstruí o ASTER como um protótipo funcional de portfólio para que o modelo de interação pudesse ser experimentado, não só descrito.",
    presentLabel: "O que realmente existe:",
    present: [
      "Um cenário completo de Known Patient, além de representações selecionáveis de Unknown Patient e Ambiguous Match",
      "Reprodução de transcrição ao vivo",
      "Insights comedidos",
      "AI Draft",
      "Notas escritas pelo médico",
      "Salvamento automático",
      "Excluir e Desfazer",
      "Notas preservadas após Restart",
    ],
    absent:
      "O que não é: usa dados fictícios, não tem backend clínico, e não reproduz a interface original do cliente.",
    keyStatement: "Ele pode demonstrar comportamento de interação. Não pode provar segurança.",
    cta: "Explore o protótipo interativo",
  },
};

export function FunctionalPrototype({ locale }: { locale: Locale }) {
  const t = COPY[locale];

  return (
    <Section id="functional-prototype" eyebrow={t.eyebrow} title={t.title}>
      <p>{t.intro}</p>

      <AssetPlaceholder assetId="aster-prototype-hero" locale={locale} />

      <AssetPlaceholder assetId="aster-walkthrough-video" locale={locale} />

      <p>{t.presentLabel}</p>
      <ul className={shared.list}>
        {t.present.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>

      <p>{t.absent}</p>

      <p className={shared.keyStatement}>{t.keyStatement}</p>

      <ExternalLink href={ASTER_PROTOTYPE_URL}>{t.cta}</ExternalLink>
    </Section>
  );
}
