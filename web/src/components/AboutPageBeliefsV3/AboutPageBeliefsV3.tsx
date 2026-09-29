import { ABOUT_ASSETS } from "@/content/about-assets";
import type { Locale } from "@/content/i18n";
import { getCopy } from "@/content/site-copy";
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

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.text}>
          <h2 className={styles.title}>{getCopy(locale, "about.beliefs.title")}</h2>
          <div className={styles.list}>
            {BELIEFS.map((belief) => (
              <div key={belief.title} className={styles.item}>
                <p className={styles.itemTitle}>{getCopy(locale, belief.title)}</p>
                <p className={styles.itemBody}>{getCopy(locale, belief.body)}</p>
              </div>
            ))}
          </div>
        </div>

        <div className={styles.collage}>
          <img src={photo1.src} alt="" className={styles.photo1} />
          <div className={styles.photoRow}>
            <img src={photo2.src} alt="" className={styles.photo2} />
            <img src={photo3.src} alt="" className={styles.photo3} />
          </div>
          <img src={availableBadge} alt="" aria-hidden="true" className={styles.badge} />
        </div>
      </div>
    </section>
  );
}
