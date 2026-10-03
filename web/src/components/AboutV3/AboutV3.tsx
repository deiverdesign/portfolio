"use client";

import { useEffect, useRef } from "react";

import type { Locale } from "@/content/i18n";
import { getCopy } from "@/content/site-copy";
import { HOME_ASSETS } from "@/content/home-assets";
import { EyebrowV3 } from "@/components/EyebrowV3/EyebrowV3";
import { SectionEntryV3 } from "@/components/SectionEntryV3/SectionEntryV3";
import styles from "./AboutV3.module.css";

export interface AboutV3Props {
  locale: Locale;
  className?: string;
}

/**
 * Figma: "Section-Header" + coluna do selo "Available to work", node
 * 2262:61851 (Desktop, dentro do frame composto 2262:61720) — conferido
 * em 28/09/2026, não aproximado.
 */
export function AboutV3({ locale, className }: AboutV3Props) {
  const classes = className ? `${styles.root} ${className}` : styles.root;
  const availableLabel = HOME_ASSETS.contact.availableLabel[locale];
  const parallaxStatementRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const statement = parallaxStatementRef.current;
    if (!statement) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let frameId: number | null = null;

    const updateOffset = () => {
      frameId = null;
      if (reducedMotion.matches) {
        statement.style.setProperty("--about-parallax-offset", "0px");
        return;
      }

      const section = statement.closest("section");
      if (!section) return;

      const rect = section.getBoundingClientRect();
      const viewportCenter = window.innerHeight / 2;
      const sectionCenter = rect.top + rect.height / 2;
      // No tablet/mobile a amplitude cai para o texto não parecer solto
      // quando as duas colunas viram uma pilha vertical.
      const maxOffset = window.innerWidth <= 599 ? 14 : window.innerWidth <= 1023 ? 26 : 48;
      const offset = Math.max(
        -maxOffset,
        Math.min(maxOffset, ((viewportCenter - sectionCenter) / window.innerHeight) * maxOffset * 2),
      );
      statement.style.setProperty("--about-parallax-offset", `${offset.toFixed(2)}px`);
    };

    const requestUpdate = () => {
      if (frameId === null) frameId = window.requestAnimationFrame(updateOffset);
    };

    requestUpdate();
    window.addEventListener("scroll", requestUpdate, { passive: true });
    window.addEventListener("resize", requestUpdate);
    reducedMotion.addEventListener("change", requestUpdate);

    return () => {
      window.removeEventListener("scroll", requestUpdate);
      window.removeEventListener("resize", requestUpdate);
      reducedMotion.removeEventListener("change", requestUpdate);
      if (frameId !== null) window.cancelAnimationFrame(frameId);
    };
  }, []);

  return (
    <section className={classes} aria-labelledby="about-statement-1">
      <div className={styles.container}>
        <SectionEntryV3 className={styles.column} hasEyebrow>
          <EyebrowV3 data-motion-part="eyebrow">
            {getCopy(locale, "home.about.eyebrow")}
          </EyebrowV3>
          <p id="about-statement-1" className={styles.statement} data-motion-part="title">
            {getCopy(locale, "home.about.body1")}
          </p>
        </SectionEntryV3>
        <div className={styles.column}>
          <img src={availableLabel} alt="" aria-hidden="true" className={styles.badge} />
          <p ref={parallaxStatementRef} className={`${styles.statement} ${styles.parallaxStatement}`}>
            {getCopy(locale, "home.about.body2")}
          </p>
        </div>
      </div>
    </section>
  );
}
