import type { Locale } from "@/content/i18n";
import { getCopy } from "@/content/site-copy";
import { HOME_ASSETS } from "@/content/home-assets";
import { SectionEntryV3 } from "@/components/SectionEntryV3/SectionEntryV3";
import styles from "./CapabilitiesV3.module.css";

export interface CapabilitiesV3Props {
  locale: Locale;
  className?: string;
}

const CARDS = [
  { titleKey: "shared.capabilities.complex.title", bodyKey: "shared.capabilities.complex.body" },
  { titleKey: "shared.capabilities.research.title", bodyKey: "shared.capabilities.research.body" },
  { titleKey: "shared.capabilities.ds.title", bodyKey: "shared.capabilities.ds.body" },
] as const;

/**
 * Figma: "Capabilities", node 2262:61824 (Desktop, dentro do frame
 * composto 2262:61720) — conferido em 28/09/2026, não aproximado.
 *
 * As 3 ilustrações de fundo de cada card ("Ilustra1/2/3" no Figma) são
 * composições com várias camadas em blend-mode/máscara — em vez de
 * recriar isso em CSS/SVG, reaproveita os 3 PNGs já exportados em
 * `HOME_ASSETS.capabilities` (mesma ordem: Complex systems, Research,
 * Design systems).
 */
export function CapabilitiesV3({ locale, className }: CapabilitiesV3Props) {
  const classes = className ? `${styles.root} ${className}` : styles.root;

  return (
    <section className={classes} aria-labelledby="capabilities-title">
      <div className={styles.container}>
        <SectionEntryV3 className={styles.header}>
          <h2 id="capabilities-title" className={styles.title} data-motion-part="title">
            {getCopy(locale, "shared.capabilities.title")}
          </h2>
          <p className={styles.intro} data-motion-part="body">
            {getCopy(locale, "shared.capabilities.intro")}
          </p>
        </SectionEntryV3>
        <ul className={styles.grid}>
          {CARDS.map((card, index) => {
            const illustration = HOME_ASSETS.capabilities[index];
            return (
              <li key={card.titleKey} className={styles.card}>
                <img
                  src={illustration.src}
                  width={illustration.width}
                  height={illustration.height}
                  alt=""
                  aria-hidden="true"
                  className={styles.illustration}
                />
                <h3 className={styles.cardTitle}>{getCopy(locale, card.titleKey)}</h3>
                <p className={styles.cardBody}>{getCopy(locale, card.bodyKey)}</p>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
