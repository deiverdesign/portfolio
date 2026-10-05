"use client";

import { useEffect, useRef } from "react";

import type { Locale } from "@/content/i18n";
import { getCopy } from "@/content/site-copy";
import { TagV3 } from "@/components/TagV3/TagV3";
import { MotionReveal } from "@/components/MotionReveal/MotionReveal";
import { ABOUT_ASSETS } from "@/content/about-assets";
import { AboutProcessVideo } from "./AboutProcessVideo";
import styles from "./AboutPageProcessV3.module.css";

export interface AboutPageProcessV3Props {
  locale: Locale;
}

const TAG_KEYS = [
  "about.process.tag.research",
  "about.process.tag.discovery",
  "about.process.tag.usability",
  "about.process.tag.specs",
] as const;

const DESKTOP_QUERY = "(min-width: 1200px)";
const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

/**
 * Figma: composição interativa do processo (node 2492:62758). Em desktop,
 * o showreel central se reduz com o scroll; em tablet/mobile, a thumbnail
 * preserva a entrada manual no vídeo.
 */
export function AboutPageProcessV3({ locale }: AboutPageProcessV3Props) {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const desktopQuery = window.matchMedia(DESKTOP_QUERY);
    const reducedMotionQuery = window.matchMedia(REDUCED_MOTION_QUERY);
    let frame = 0;

    const update = () => {
      frame = 0;

      if (!desktopQuery.matches || reducedMotionQuery.matches) {
        section.style.setProperty("--process-video-scale", "1");
        section.style.setProperty("--process-title-translate", "0px");
        section.style.setProperty("--process-tags-translate", "0px");
        section.style.setProperty("--process-body-translate", "0px");
        return;
      }

      const rect = section.getBoundingClientRect();
      const scrollDistance = Math.max(section.offsetHeight - window.innerHeight, 1);
      const progress = Math.min(Math.max(-rect.top / scrollDistance, 0), 1);
      const contentProgress = Math.min(Math.max((progress - 0.16) / 0.84, 0), 1);
      const scale = 1040 / 428 - (1040 / 428 - 1) * progress;
      const titleOffset = Math.min(window.innerHeight * 0.95, 760);

      section.style.setProperty("--process-video-scale", scale.toFixed(4));
      // Os três blocos têm o mesmo ponto de chegada, mas percorrem distâncias
      // diferentes — igual ao protótipo do Figma. As tags começam mais perto,
      // o título vem de baixo e o texto da direita entra por último.
      section.style.setProperty("--process-title-translate", `${Math.round((1 - contentProgress) * titleOffset)}px`);
      section.style.setProperty("--process-tags-translate", `${Math.round((1 - contentProgress) * titleOffset * 0.44)}px`);
      section.style.setProperty("--process-body-translate", `${Math.round((1 - contentProgress) * titleOffset * 1.55)}px`);
    };

    const requestUpdate = () => {
      if (!frame) frame = window.requestAnimationFrame(update);
    };

    requestUpdate();
    window.addEventListener("scroll", requestUpdate, { passive: true });
    window.addEventListener("resize", requestUpdate);
    desktopQuery.addEventListener("change", requestUpdate);
    reducedMotionQuery.addEventListener("change", requestUpdate);

    return () => {
      window.removeEventListener("scroll", requestUpdate);
      window.removeEventListener("resize", requestUpdate);
      desktopQuery.removeEventListener("change", requestUpdate);
      reducedMotionQuery.removeEventListener("change", requestUpdate);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <section ref={sectionRef} className={styles.section}>
      <div className={styles.container}>
        <div className={styles.titleMotion}>
          <MotionReveal as="h2" className={styles.title}>
            {getCopy(locale, "about.process.title")}
          </MotionReveal>
        </div>
        <div className={styles.body}>
          <MotionReveal as="p" className={styles.subtitle} delayMs={80}>
            {getCopy(locale, "about.process.subtitle")}
          </MotionReveal>
          <MotionReveal as="p" className={styles.paragraph} delayMs={140}>
            {getCopy(locale, "about.process.body")}
          </MotionReveal>
        </div>
        <ul className={styles.tags}>
          {TAG_KEYS.map((key, index) => (
            <MotionReveal as="li" key={key} delayMs={200 + index * 60}>
              <TagV3 label={getCopy(locale, key)} />
            </MotionReveal>
          ))}
        </ul>
        <div className={styles.banner}>
          <AboutProcessVideo {...ABOUT_ASSETS.process.showreel} />
        </div>
      </div>
    </section>
  );
}
