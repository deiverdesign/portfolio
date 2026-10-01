import type { Locale } from "@/content/i18n";
import { getCopy } from "@/content/site-copy";
import { TagV3 } from "@/components/TagV3/TagV3";
import { MotionReveal } from "@/components/MotionReveal/MotionReveal";
import { ABOUT_ASSETS } from "@/content/about-assets";
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

/**
 * Figma: "Design-Decisions-Section" (processo), node 2262:64712
 * (Desktop-Laptop). O banner à direita usa o asset fornecido para a
 * composição "Complex Products"; em tablet/mobile ele fica oculto.
 */
export function AboutPageProcessV3({ locale }: AboutPageProcessV3Props) {
  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.text}>
          <MotionReveal as="h2" className={styles.title}>{getCopy(locale, "about.process.title")}</MotionReveal>
          <div className={styles.body}>
            <MotionReveal as="p" className={styles.subtitle} delayMs={80}>{getCopy(locale, "about.process.subtitle")}</MotionReveal>
            <MotionReveal as="p" className={styles.paragraph} delayMs={140}>{getCopy(locale, "about.process.body")}</MotionReveal>
            <ul className={styles.tags}>
              {TAG_KEYS.map((key, index) => (
                <MotionReveal as="li" key={key} delayMs={200 + index * 60}>
                  <TagV3 label={getCopy(locale, key)} />
                </MotionReveal>
              ))}
            </ul>
          </div>
        </div>
        <MotionReveal
          as="div"
          className={styles.banner}
          delayMs={180}
          offsetPx={40}
        >
          <img
            src={ABOUT_ASSETS.process.banner.src}
            width={ABOUT_ASSETS.process.banner.width}
            height={ABOUT_ASSETS.process.banner.height}
            alt=""
          />
        </MotionReveal>
      </div>
    </section>
  );
}
