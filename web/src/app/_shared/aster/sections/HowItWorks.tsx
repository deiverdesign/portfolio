import { AssetPlaceholder } from "../assets/AssetPlaceholder";
import { Section } from "./Section";
import shared from "./shared.module.css";
import type { Locale } from "@/components/NavBar/NavBar";
import styles from "./HowItWorks.module.css";

const COPY: Record<Locale, {
  eyebrow: string;
  title: string;
  macroCaption: string;
  reconstructionCaption: string;
  body: string;
  flow: string[];
}> = {
  en: {
    eyebrow: "How it works",
    title: "Three things stay visible together",
    macroCaption: "Designed for quick, discreet control during the consultation.",
    reconstructionCaption:
      "Functional portfolio reconstruction based on the interaction model I designed. Fictional data; not the original client interface.",
    body: "During the consultation, ASTER keeps three things visible together: what is known about the patient, what is being said, and what is being documented.",
    flow: ["Device captures", "Patient is confirmed", "Transcript builds", "Context and Insights appear", "Physician reviews the notes"],
  },
  pt: {
    eyebrow: "Como funciona",
    title: "Três coisas ficam visíveis juntas",
    macroCaption: "Projetado para controle rápido e discreto durante a consulta.",
    reconstructionCaption:
      "Reconstrução funcional de portfólio baseada no modelo de interação que desenhei. Dados fictícios; não é a interface original do cliente.",
    body: "Durante a consulta, o ASTER mantém três coisas visíveis juntas: o que se sabe sobre o paciente, o que está sendo dito e o que está sendo documentado.",
    flow: ["Dispositivo captura", "Paciente é confirmado", "Transcrição se constrói", "Contexto e Insights aparecem", "Médico revisa as notas"],
  },
};

export function HowItWorks({ locale }: { locale: Locale }) {
  const t = COPY[locale];

  return (
    <Section id="how-it-works" eyebrow={t.eyebrow} title={t.title} tone="stone">
      <div className={styles.layout}>
        <div className={styles.macro}>
          <AssetPlaceholder assetId="aster-device-control-macro" />
          <p className={shared.caption}>{t.macroCaption}</p>
        </div>

        <div className={styles.mockup}>
          <AssetPlaceholder assetId="aster-macbook-mockup" />
        </div>
      </div>

      <p className={styles.reconstructionCaption}>{t.reconstructionCaption}</p>

      <p>{t.body}</p>

      <div className={styles.flow} role="img" aria-label={`${locale === "pt" ? "Fluxo" : "Flow"}: ${t.flow.join(" → ")}`}>
        {t.flow.map((step, index) => (
          <span key={step} className={styles.flowStep}>
            <span className={styles.flowNode}>{step}</span>
            {index < t.flow.length - 1 && (
              <span className={styles.flowArrow} aria-hidden="true">
                →
              </span>
            )}
          </span>
        ))}
      </div>
    </Section>
  );
}
