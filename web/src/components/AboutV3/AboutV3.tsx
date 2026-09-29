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
          <p className={styles.statement}>{getCopy(locale, "home.about.body2")}</p>
        </div>
      </div>
    </section>
  );
}
