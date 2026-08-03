import type { ReactNode } from "react";
import styles from "./Section.module.css";

export type SectionTone = "cream" | "stone" | "forestDeep";

export interface SectionProps {
  id: string;
  number?: string;
  eyebrow: string;
  title: string;
  tone?: SectionTone;
  children: ReactNode;
}

/** Casca comum pra toda seção numerada do case: eyebrow, título, fundo. */
export function Section({ id, number, eyebrow, title, tone = "cream", children }: SectionProps) {
  return (
    <section id={id} className={`${styles.section} ${styles[tone]}`} aria-labelledby={`${id}-heading`}>
      <div className={styles.inner}>
        <p className={styles.eyebrow}>
          {number ? <span className={styles.number}>{number} · </span> : null}
          {eyebrow}
        </p>
        <h2 id={`${id}-heading`} className={styles.title}>
          {title}
        </h2>
        <div className={styles.body}>{children}</div>
      </div>
    </section>
  );
}
