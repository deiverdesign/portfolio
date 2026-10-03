"use client";

import { useEffect, useRef, type AnchorHTMLAttributes } from "react";

import type { Locale } from "@/content/i18n";
import { getCopy } from "@/content/site-copy";
import { HOME_ASSETS } from "@/content/home-assets";
import { ButtonV3 } from "@/components/ButtonV3/ButtonV3";
import { IconV3 } from "@/components/IconV3/IconV3";
import styles from "./ContactCTA.module.css";

export interface ContactCTAProps {
  locale: Locale;
  className?: string;
  contactHref: AnchorHTMLAttributes<HTMLAnchorElement>["href"];
}

/**
 * Componente compartilhado "Let's build better digital products." — aparece
 * no fechamento da Home e (por decisão do V3-HANDOFF, seção 7) nas páginas
 * de case. Figma: componente "Lets Build", fileKey zpaQNzgjhG5ZKafe2cxnkm,
 * node 1729:13198 — reconferido em 27/09/2026 depois do Deiver atualizar o
 * texto ("LET'S WORK TOGETHER • hello@deiver.com.br"), o retrato (recorte
 * novo, já dentro do hexágono) e o botão ("Email me", ícone seta em vez do
 * "↓" de texto que eu tinha usado antes).
 */
export function ContactCTA({ locale, className, contactHref }: ContactCTAProps) {
  const title = getCopy(locale, "shared.cta.title");
  const button = getCopy(locale, "shared.cta.button");
  const { portrait, graphismBackground, graphismBackgroundTablet } = HOME_ASSETS.contact;

  const classes = className ? `${styles.root} ${className}` : styles.root;
  const graphismRef = useRef<HTMLPictureElement>(null);

  useEffect(() => {
    const graphism = graphismRef.current;
    if (!graphism) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let frameId: number | null = null;

    const updateOffset = () => {
      frameId = null;
      if (reducedMotion.matches) {
        graphism.style.setProperty("--contact-graphism-parallax-offset", "0px");
        return;
      }

      const section = graphism.closest("section");
      if (!section) return;

      const rect = section.getBoundingClientRect();
      const viewportCenter = window.innerHeight / 2;
      const sectionCenter = rect.top + rect.height / 2;
      const maxOffset = window.innerWidth <= 599 ? 52 : window.innerWidth <= 1023 ? 72 : 72;
      const offset = Math.max(
        -maxOffset,
        Math.min(maxOffset, ((viewportCenter - sectionCenter) / window.innerHeight) * maxOffset * 2),
      );
      graphism.style.setProperty("--contact-graphism-parallax-offset", `${offset.toFixed(2)}px`);
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
    <section className={classes} aria-labelledby="contact-cta-title">
      <picture ref={graphismRef} className={styles.graphism}>
        <source media="(max-width: 1023px)" srcSet={graphismBackgroundTablet} />
        <img src={graphismBackground} alt="" />
      </picture>
      <div className={styles.row}>
        <img
          src={portrait.src}
          width={portrait.width}
          height={portrait.height}
          alt=""
          className={styles.portrait}
        />
        <div className={styles.content}>
          <h2 id="contact-cta-title" className={styles.title}>
            {title}
          </h2>
          <div className={styles.buttonWrap}>
            <ButtonV3 href={contactHref} variant="secondary" context="default">
              {button}
              <IconV3 name="arrow-right" size={16} />
            </ButtonV3>
            <p className={styles.email}>hello@deiver.com.br</p>
          </div>
        </div>
      </div>
    </section>
  );
}
