import type { Locale } from "@/content/i18n";
import { getCopy } from "@/content/site-copy";
import { IconV3 } from "@/components/IconV3/IconV3";
import styles from "./AboutPageFactsV3.module.css";

export interface AboutPageFactsV3Props {
  locale: Locale;
}

/** Figma: "Frame 303", node 2262:64679 (Desktop-Laptop) — 3 cards de fato
 * rápido logo abaixo do hero do About. */
export function AboutPageFactsV3({ locale }: AboutPageFactsV3Props) {
  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <IconV3 name="briefcase-business-2" size={32} />
            <span className={styles.label}>{getCopy(locale, "about.facts.experience.label")}</span>
          </div>
          <ul className={styles.checklist}>
            <li>
              <IconV3 name="check-circle" size={16} />
              {getCopy(locale, "about.facts.experience.years")}
            </li>
            <li>
              <IconV3 name="check-circle" size={16} />
              {getCopy(locale, "about.facts.experience.product")}
            </li>
          </ul>
        </div>

        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <IconV3 name="handshake-2" size={32} />
            <span className={styles.label}>{getCopy(locale, "about.facts.clients.label")}</span>
          </div>
          <p className={styles.clients}>{getCopy(locale, "about.facts.clients.list")}</p>
        </div>

        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <IconV3 name="languages-2" size={32} />
            <span className={styles.label}>{getCopy(locale, "about.facts.languages.label")}</span>
          </div>
          <ul className={styles.checklist}>
            <li>
              <IconV3 name="check-circle" size={16} />
              {getCopy(locale, "about.facts.languages.pt")}
            </li>
            <li>
              <IconV3 name="check-circle" size={16} />
              {getCopy(locale, "about.facts.languages.en")}
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
}
