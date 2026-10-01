"use client";

import { useEffect } from "react";

import { ABOUT_ASSETS } from "@/content/about-assets";
import type { Locale } from "@/content/i18n";
import { getCopy } from "@/content/site-copy";
import { MotionReveal } from "@/components/MotionReveal/MotionReveal";
import styles from "./AboutPageBeliefsV3.module.css";

export interface AboutPageBeliefsV3Props {
  locale: Locale;
}

/* Chaves escritas por extenso, não montadas com template string: o
   catálogo tipa getCopy contra um union literal de chaves (CopyKey) —
   uma template literal em posição de valor sempre vira `string` puro no
   TypeScript, não o literal union que a função exige. */
const BELIEFS = [
  { title: "about.beliefs.1.title", body: "about.beliefs.1.body" },
  { title: "about.beliefs.2.title", body: "about.beliefs.2.body" },
  { title: "about.beliefs.3.title", body: "about.beliefs.3.body" },
] as const;

/** Figma: "Design-Decisions-Section" (crenças), node 2262:64757
 * (Desktop-Laptop) — 3 princípios + colagem de 3 fotos + selo "Available
 * to work" (SVG próprio desta seção, ver about-assets.ts). */
export function AboutPageBeliefsV3({ locale }: AboutPageBeliefsV3Props) {
  const { photo1, photo2, photo3, availableBadge } = ABOUT_ASSETS.beliefs;

  useEffect(() => {
    const collage = document.querySelector<HTMLElement>("[data-about-collage]");
    if (!collage) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let frameId: number | null = null;

    const updateOffset = () => {
      frameId = null;
      if (reducedMotion.matches || window.innerWidth <= 1023) {
        collage.style.setProperty("--about-collage-row-offset", "0px");
        collage.style.setProperty("--about-collage-badge-offset", "0px");
        return;
      }

      const rect = collage.getBoundingClientRect();
      const progress = Math.max(-1, Math.min(1, ((window.innerHeight / 2) - (rect.top + rect.height / 2)) / window.innerHeight));
      collage.style.setProperty("--about-collage-row-offset", `${(progress * 28).toFixed(2)}px`);
      collage.style.setProperty("--about-collage-badge-offset", `${(-progress * 20).toFixed(2)}px`);
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
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.text}>
          <MotionReveal as="h2" className={styles.title}>{getCopy(locale, "about.beliefs.title")}</MotionReveal>
          <div className={styles.list}>
            {BELIEFS.map((belief, index) => (
              <MotionReveal as="div" key={belief.title} className={styles.item} delayMs={100 + index * 80}>
                <p className={styles.itemTitle}>{getCopy(locale, belief.title)}</p>
                <p className={styles.itemBody}>{getCopy(locale, belief.body)}</p>
              </MotionReveal>
            ))}
          </div>
        </div>

        <MotionReveal as="div" data-about-collage className={styles.collage} delayMs={160} offsetPx={40}>
          <img src={photo1.src} alt="" className={styles.photo1} />
          <div className={styles.photoRow}>
            <img src={photo2.src} alt="" className={styles.photo2} />
            <img src={photo3.src} alt="" className={styles.photo3} />
          </div>
          <img src={availableBadge} alt="" aria-hidden="true" className={styles.badge} />
        </MotionReveal>
      </div>
    </section>
  );
}
