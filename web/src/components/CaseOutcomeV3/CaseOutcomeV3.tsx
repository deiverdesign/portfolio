import type { ReactNode } from "react";

import { EyebrowV3 } from "@/components/EyebrowV3/EyebrowV3";
import { IconV3 } from "@/components/IconV3/IconV3";
import { MotionReveal } from "@/components/MotionReveal/MotionReveal";
import type { RasterAsset } from "@/content/home-assets";
import styles from "./CaseOutcomeV3.module.css";

export interface CaseOutcomeV3Props {
  eyebrow: string;
  title: string;
  body: string;
  checklist: string[];
  /** Evidência principal (ex.: handoff de acessibilidade). */
  primaryMedia: RasterAsset;
  /** Segunda evidência, menor — ex.: foto do produto em uso. */
  secondaryMedia?: RasterAsset;
  /** Evidência alternativa, como vídeo de protótipo. */
  secondaryContent?: ReactNode;
  /** Algumas composições do Figma usam as duas evidências empilhadas,
   * em vez da fileira compacta usada pelo case HP. */
  stackedMedia?: boolean;
  /** Peça extra pequena, ex.: cartão com amostra de tipografia. */
  extra?: ReactNode;
}

/**
 * Figma: bloco "Outcome" do case (ex. SCRIOO node 2262:65858). Checklist
 * de fatos verificáveis + evidências de mídia — nunca frases de intenção
 * ("made X easier"), conforme a regra do NORTE.md (6.6, "Outcome — fato,
 * não intenção").
 */
export function CaseOutcomeV3({
  eyebrow,
  title,
  body,
  checklist,
  primaryMedia,
  secondaryMedia,
  secondaryContent,
  stackedMedia = false,
  extra,
}: CaseOutcomeV3Props) {
  return (
    <section className={styles.section}>
      <div className={styles.grid}>
        <div className={styles.text}>
          <EyebrowV3>{eyebrow}</EyebrowV3>
          <MotionReveal as="h2" className={styles.title} delayMs={80}>
            {title}
          </MotionReveal>
          <MotionReveal as="p" className={styles.body} delayMs={140}>
            {body}
          </MotionReveal>
          <ul className={styles.checklist}>
            {checklist.map((item, index) => (
              <MotionReveal as="li" key={item} className={styles.checklistItem} delayMs={200 + index * 80}>
                <IconV3 name="check-circle" size={18} className={styles.checkIcon} />
                <span>{item}</span>
              </MotionReveal>
            ))}
          </ul>
        </div>

        <div className={`${styles.media} ${stackedMedia ? styles.mediaStacked : ""}`}>
          <MotionReveal as="div" className={styles.primaryMedia} delayMs={80} offsetPx={40}>
            <img src={primaryMedia.src} width={primaryMedia.width} height={primaryMedia.height} alt="" />
          </MotionReveal>
          {(secondaryMedia || secondaryContent || extra) && <div className={styles.mediaRow}>
            {(secondaryMedia || secondaryContent) && <MotionReveal as="div" className={styles.secondaryMedia} delayMs={160} offsetPx={40}>
              {secondaryContent ?? <img src={secondaryMedia!.src} width={secondaryMedia!.width} height={secondaryMedia!.height} alt="" />}
            </MotionReveal>}
            {extra && <MotionReveal as="div" className={styles.extraMedia} delayMs={240} offsetPx={40}>{extra}</MotionReveal>}
          </div>}
        </div>
      </div>
    </section>
  );
}
