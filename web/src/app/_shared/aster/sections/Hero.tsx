import { AssetPlaceholder } from "../assets/AssetPlaceholder";
import { ExternalLink } from "./ExternalLink";
import { ASTER_PROTOTYPE_URL } from "./links";
import type { Locale } from "@/components/NavBar/NavBar";
import styles from "./Hero.module.css";

const COPY: Record<Locale, {
  eyebrow: string;
  title: string;
  subtitle: string;
  meta: Array<{ term: string; detail: string }>;
  ctaPrimary: string;
  ctaSecondary: string;
}> = {
  en: {
    eyebrow: "AMBIENT AI FOR CLINICAL CONSULTATIONS",
    title: "ASTER HELPS PHYSICIANS LISTEN, REMEMBER AND DOCUMENT — WITHOUT DECIDING FOR THEM.",
    subtitle:
      "A small device worn by the physician captures the consultation. The workspace identifies the patient, builds a live transcript, brings relevant context into view and prepares draft notes for review.",
    meta: [
      { term: "Role", detail: "Product Design" },
      { term: "Focus", detail: "AI interaction, clinical workflows, safety and trust" },
      { term: "Output", detail: "Discovery framework and interactive prototype" },
      { term: "Status", detail: "Concept exploration / portfolio reconstruction" },
    ],
    ctaPrimary: "See how it works",
    ctaSecondary: "Explore the interactive prototype",
  },
  pt: {
    eyebrow: "IA AMBIENTE PARA CONSULTAS CLÍNICAS",
    title: "O ASTER AJUDA MÉDICOS A OUVIR, LEMBRAR E DOCUMENTAR — SEM DECIDIR POR ELES.",
    subtitle:
      "Um pequeno dispositivo usado pelo médico captura a consulta. O workspace identifica o paciente, constrói uma transcrição ao vivo, traz contexto relevante à vista e prepara notas de rascunho para revisão.",
    meta: [
      { term: "Papel", detail: "Product Design" },
      { term: "Foco", detail: "Interação com IA, fluxos clínicos, segurança e confiança" },
      { term: "Entregável", detail: "Framework de discovery e protótipo interativo" },
      { term: "Status", detail: "Exploração de conceito / reconstrução de portfólio" },
    ],
    ctaPrimary: "Veja como funciona",
    ctaSecondary: "Explore o protótipo interativo",
  },
};

export function Hero({ locale }: { locale: Locale }) {
  const t = COPY[locale];

  return (
    <section className={styles.hero} aria-labelledby="aster-hero-heading">
      <div className={styles.inner}>
        <div className={styles.text}>
          <p className={styles.wordmark}>ASTER</p>
          <p className={styles.eyebrow}>{t.eyebrow}</p>
          <h1 id="aster-hero-heading" className={styles.title}>
            {t.title}
          </h1>
          <p className={styles.subtitle}>{t.subtitle}</p>

          <dl className={styles.meta}>
            {t.meta.map((item) => (
              <div key={item.term}>
                <dt>{item.term}</dt>
                <dd>{item.detail}</dd>
              </div>
            ))}
          </dl>

          <div className={styles.ctaRow}>
            <a href="#how-it-works" className={styles.cta}>
              {t.ctaPrimary} <span aria-hidden="true">↓</span>
            </a>
            <ExternalLink href={ASTER_PROTOTYPE_URL} context="dark">
              {t.ctaSecondary}
            </ExternalLink>
          </div>
        </div>

        <div className={styles.visual}>
          <AssetPlaceholder assetId="aster-physician-device-hero" variant="device" />
        </div>
      </div>
    </section>
  );
}
