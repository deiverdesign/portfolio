import type { ReactNode } from "react";
import { DisplayText } from "@/components/DisplayText/DisplayText";
import styles from "./Section.module.css";

export type SectionTone = "cream" | "stone" | "forestDeep";

export interface SectionProps {
  id: string;
  number?: string;
  eyebrow: string;
  title: string;
  tone?: SectionTone;
  /** Imagem opcional que aparece ANTES do eyebrow/título — usada quando a seção abre com uma imagem grande (ex: "The hard part"). */
  image?: ReactNode;
  children: ReactNode;
}

/** Casca comum pra toda seção numerada do case: eyebrow, título, fundo. */
export function Section({ id, number, eyebrow, title, tone = "cream", image, children }: SectionProps) {
  return (
    <section id={id} className={`${styles.section} ${styles[tone]}`} aria-labelledby={`${id}-heading`}>
      <div className={styles.inner}>
        {image}
        <p className={styles.eyebrow}>
          {number ? <span className={styles.number}>{number} · </span> : null}
          {eyebrow}
        </p>
        <h2 id={`${id}-heading`} className={styles.title}>
          <DisplayText>{title}</DisplayText>
        </h2>
        <div className={styles.body}>{children}</div>
      </div>
    </section>
  );
}
