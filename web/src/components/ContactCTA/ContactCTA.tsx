import type { AnchorHTMLAttributes } from "react";

import type { Locale } from "@/content/i18n";
import { getCopy } from "@/content/site-copy";
import { HOME_ASSETS } from "@/content/home-assets";
import { ButtonV3 } from "@/components/ButtonV3/ButtonV3";
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
 * node 2167:6287 (Desktop Large) — ver web/docs/home-assets-inventory.md.
 */
export function ContactCTA({ locale, className, contactHref }: ContactCTAProps) {
  const eyebrow = getCopy(locale, "shared.cta.eyebrow");
  const title = getCopy(locale, "shared.cta.title");
  const button = getCopy(locale, "shared.cta.button");
  const { portrait, graphismBackground } = HOME_ASSETS.contact;

  const classes = className ? `${styles.root} ${className}` : styles.root;

  return (
    <section className={classes} aria-labelledby="contact-cta-title">
      <img src={graphismBackground} alt="" aria-hidden="true" className={styles.graphism} />
      <img
        src={portrait.src}
        width={portrait.width}
        height={portrait.height}
        alt=""
        className={styles.portrait}
      />
      <div className={styles.content}>
        <p className={styles.eyebrow}>{eyebrow}</p>
        <h2 id="contact-cta-title" className={styles.title}>
          {title}
        </h2>
        <ButtonV3 href={contactHref} variant="secondary" context="default">
          {button}
          <span aria-hidden="true">↓</span>
        </ButtonV3>
      </div>
    </section>
  );
}
