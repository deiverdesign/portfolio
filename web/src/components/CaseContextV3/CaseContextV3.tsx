import type { ReactNode } from "react";

import { EyebrowV3 } from "@/components/EyebrowV3/EyebrowV3";
import { MotionReveal } from "@/components/MotionReveal/MotionReveal";
import styles from "./CaseContextV3.module.css";

export interface CaseContextV3Props {
  eyebrow: string;
  title: string;
  paragraphs: string[];
  /** Imagem before/after (ou outro placeholder reservado, enquanto o
   * asset não existir). */
  media: ReactNode;
  /** Para cases cujo Context é mais longo, reduz só a transição aos metadados. */
  compactAfter?: boolean;
}

/**
 * Figma: bloco "Context" do case (ex. SCRIOO node 2262:65858, logo abaixo
 * do hero). Título + parágrafos à esquerda, mídia à direita — o
 * `CaseMetaRowV3` (My Role/Collaboration) vem depois deste bloco, não faz
 * parte dele.
 */
export function CaseContextV3({ eyebrow, title, paragraphs, media, compactAfter = false }: CaseContextV3Props) {
  return (
    <section className={[styles.section, compactAfter && styles.compactAfter].filter(Boolean).join(" ")}>
      <div className={styles.grid}>
        <div className={styles.text}>
          <div className={styles.titleBlock}>
            <EyebrowV3>{eyebrow}</EyebrowV3>
            <MotionReveal as="h2" className={styles.title} delayMs={80}>
              {title}
            </MotionReveal>
          </div>
          <MotionReveal as="div" className={styles.paragraphBlock} delayMs={140}>
            {paragraphs.map((paragraph, index) => (
              <p className={styles.paragraph} key={index}>
                {paragraph}
              </p>
            ))}
          </MotionReveal>
        </div>
        <MotionReveal as="div" className={styles.media} delayMs={200} offsetPx={40}>
          {media}
        </MotionReveal>
      </div>
    </section>
  );
}
