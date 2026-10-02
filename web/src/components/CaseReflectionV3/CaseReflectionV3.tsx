import { EyebrowV3 } from "@/components/EyebrowV3/EyebrowV3";
import { IconV3 } from "@/components/IconV3/IconV3";
import { MotionReveal } from "@/components/MotionReveal/MotionReveal";
import styles from "./CaseReflectionV3.module.css";

export interface CaseReflectionV3NextCase {
  href: string;
  logoSrc: string;
  logoAlt: string;
  name: string;
  summary: string;
  background: string;
  /** Logos circulares usam 32px; wordmarks precisam preservar proporção. */
  logoWidth?: number;
  /** Mostra o selo visual de acesso protegido, usado pelo case Aster. */
  locked?: boolean;
}

export interface CaseReflectionV3Props {
  eyebrow: string;
  title: string;
  /** Opcional — Intuit não tem essa linha de abertura curta, só citação + fechamento. */
  lead?: string;
  /** Opcional — mesma razão do `lead`; nem toda composição usa as duas frases. */
  quote?: string;
  close?: string;
  nextLabel: string;
  next: CaseReflectionV3NextCase;
}

/**
 * Figma: bloco "Reflection" + "Next case" do case (ex. SCRIOO node
 * 2262:65858). O card do próximo case é uma versão compacta, diferente do
 * `CaseCardLargeV3` da Home (sem devices/hover) — só logo, nome, resumo e
 * seta.
 */
export function CaseReflectionV3({ eyebrow, title, lead, quote, close, nextLabel, next }: CaseReflectionV3Props) {
  return (
    <section className={styles.section}>
      <div className={styles.grid}>
        <div className={styles.text}>
          <EyebrowV3>{eyebrow}</EyebrowV3>
          <MotionReveal as="h2" className={styles.title} delayMs={80}>
            {title}
          </MotionReveal>
          {lead && (
            <MotionReveal as="p" className={styles.lead} delayMs={140}>
              {lead}
            </MotionReveal>
          )}
          {quote && (
            <MotionReveal as="p" className={styles.quote} delayMs={200}>
              {quote}
            </MotionReveal>
          )}
          {close && (
            <MotionReveal as="p" className={styles.close} delayMs={260}>
              {close}
            </MotionReveal>
          )}
        </div>

        {/* Divisor vertical (Figma node 2262:65992) — 136px de altura,
           não a coluna inteira. */}
        <div className={styles.divider} aria-hidden="true" />

        <div className={styles.nextColumn}>
          <span className={styles.nextLabel}>{nextLabel}</span>
          <MotionReveal
            as="a"
            href={next.href}
            className={styles.nextCard}
            style={{ background: next.background }}
            delayMs={80}
            offsetPx={40}
          >
            <img
              src={next.logoSrc}
              alt={next.logoAlt}
              className={styles.nextLogo}
              style={next.logoWidth ? { width: next.logoWidth, height: "auto" } : undefined}
            />
            {next.locked && (
              <span className={styles.nextLock} aria-hidden="true">
                <IconV3 name="lock" size={18} />
              </span>
            )}
            <div className={styles.nextBody}>
              <h3 className={styles.nextName}>{next.name}</h3>
              <p className={styles.nextSummary}>{next.summary}</p>
            </div>
            <span className={styles.nextArrow} aria-hidden="true">
              <IconV3 name="caret-right" size={24} />
            </span>
          </MotionReveal>
        </div>
      </div>
    </section>
  );
}
