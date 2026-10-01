import { ABOUT_ASSETS } from "@/content/about-assets";
import type { Locale } from "@/content/i18n";
import { getCopy } from "@/content/site-copy";
import { IconV3 } from "@/components/IconV3/IconV3";
import { MotionReveal } from "@/components/MotionReveal/MotionReveal";
import styles from "./AboutPageHeroV3.module.css";

export interface AboutPageHeroV3Props {
  locale: Locale;
}

/**
 * Figma: "Bento-Spread-Section", node 2262:64513 (Desktop-Laptop 1327px:
 * 2262:64650) — topo da página About. Foto e grafismo têm tamanho fixo em
 * px no desktop (não escalam com o container), só se realinham/reduzem em
 * tablet/mobile — conferido nos 4 frames (1993/1327/778/393).
 */
export function AboutPageHeroV3({ locale }: AboutPageHeroV3Props) {
  const { graphism, photo } = ABOUT_ASSETS.hero;

  return (
    <section className={styles.section} aria-labelledby="about-hero-title">
      <div className={styles.container}>
        <MotionReveal as="div" className={styles.imageContainer} offsetPx={40}>
          <div className={styles.graphismFrame}>
            <img src={graphism.src} alt="" aria-hidden="true" className={styles.graphism} />
          </div>
          <img
            src={photo.src}
            alt={getCopy(locale, "about.hero.name")}
            className={styles.photo}
          />
        </MotionReveal>

        <div className={styles.content}>
          <div className={styles.headline}>
            <div className={styles.statementSequence}>
              <p className={styles.lines}>
                <span className={styles.heroLine}>{getCopy(locale, "about.hero.line1")}</span>
                <span className={styles.heroLine}>{getCopy(locale, "about.hero.line2")}</span>
              </p>
              <p id="about-hero-title" className={styles.statement}>
                <span className={styles.heroLine}>{getCopy(locale, "about.hero.line3")}</span>
              </p>
            </div>
          </div>

          <MotionReveal as="div" className={styles.identity} delayMs={260}>
            <span className={styles.chip}>
              <span className={styles.accentTick} aria-hidden="true" />
              {getCopy(locale, "about.hero.name")}
            </span>
            <span className={styles.chip}>
              {getCopy(locale, "about.hero.city")}
              <span className={styles.dot} aria-hidden="true" />
              <IconV3 name="brazil-flag" size={18} className={styles.flag} />
              {getCopy(locale, "about.hero.country")}
            </span>
            <span className={styles.chip}>{getCopy(locale, "about.hero.timezone")}</span>
          </MotionReveal>
        </div>
      </div>
    </section>
  );
}
