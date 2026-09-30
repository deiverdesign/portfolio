"use client";

import { ButtonV3 } from "@/components/ButtonV3/ButtonV3";
import { CarouselIndicatorsV3 } from "@/components/CarouselIndicatorsV3/CarouselIndicatorsV3";
import { EyebrowV3 } from "@/components/EyebrowV3/EyebrowV3";
import { IconV3 } from "@/components/IconV3/IconV3";
import { MotionReveal } from "@/components/MotionReveal/MotionReveal";
import type { RasterAsset } from "@/content/home-assets";
import { useRailCarousel } from "@/hooks/useRailCarousel";
import styles from "./HpOpenQuestionsV3.module.css";

export interface HpOpenQuestionsCard {
  banner: RasterAsset;
  name: string;
  question: string;
  why: string;
  changed: string;
}

export interface HpOpenQuestionsV3Props {
  eyebrow: string;
  title: string;
  body: string;
  media: RasterAsset;
  cards: HpOpenQuestionsCard[];
  labels: { question: string; why: string; changed: string };
  conclusion: string;
}

/** A HP não tem uma seção de testes: são decisões de negócio em aberto.
 * Por isso esta variação mantém o rail compartilhado, mas dá às cartas a
 * hierarquia Question / Why it mattered / What changed do frame da HP. */
export function HpOpenQuestionsV3({ eyebrow, title, body, media, cards, labels, conclusion }: HpOpenQuestionsV3Props) {
  const { railRef, activePage, pageCount, goToPage, scrollByPage, handleScroll } = useRailCarousel<HTMLDivElement>();

  return (
    <section className={styles.section}>
      <div className={styles.intro}>
        <div className={styles.text}>
          <EyebrowV3>{eyebrow}</EyebrowV3>
          <MotionReveal as="h2" className={styles.title} delayMs={80}>{title}</MotionReveal>
          <MotionReveal as="p" className={styles.body} delayMs={140}>{body}</MotionReveal>
        </div>
        <MotionReveal as="div" className={styles.media} delayMs={200} offsetPx={40}>
          <img src={media.src} width={media.width} height={media.height} alt="" />
        </MotionReveal>
      </div>

      <div className={styles.rail} ref={railRef} onScroll={handleScroll}>
        <ul className={styles.track}>
          {cards.map((card, index) => (
            <MotionReveal as="li" className={styles.card} key={card.name} delayMs={index * 80} offsetPx={40}>
              <img src={card.banner.src} width={card.banner.width} height={card.banner.height} alt="" className={styles.banner} />
              <div className={styles.cardBody}>
                <h3 className={styles.name}>{card.name}</h3>
                <div><span className={styles.label}>{labels.question}</span><p>{card.question}</p></div>
                <div className={styles.divider} />
                <div className={styles.details}>
                  <div><span className={styles.label}>{labels.why}</span><p>{card.why}</p></div>
                  <div><span className={styles.label}>{labels.changed}</span><p>{card.changed}</p></div>
                </div>
              </div>
            </MotionReveal>
          ))}
        </ul>
      </div>
      <div className={styles.controls}>
        <div className={styles.dots}>
          <CarouselIndicatorsV3 count={pageCount} activeIndex={activePage} onSelect={goToPage} getLabel={(index) => `Page ${index + 1}`} />
        </div>
        <div className={styles.arrows}>
          <ButtonV3 variant="secondary" size="medium" className={styles.arrowButton} onClick={() => scrollByPage(-1)} disabled={activePage === 0} aria-label="Previous"><IconV3 name="arrow-left" size={20} /></ButtonV3>
          <ButtonV3 variant="secondary" size="medium" className={styles.arrowButton} onClick={() => scrollByPage(1)} disabled={activePage === pageCount - 1} aria-label="Next"><IconV3 name="arrow-right" size={20} /></ButtonV3>
        </div>
      </div>
      <MotionReveal as="div" className={styles.statement} delayMs={80}>
        <span className={styles.statementAccent} aria-hidden="true">
          <span className={styles.accentLine} />
          <span className={styles.accentMark}>
            <img src="/images/v3/icons/statement-chevron-start.svg" width="6" height="5.25" alt="" />
            <img src="/images/v3/icons/statement-chevron-end.svg" width="6" height="5.25" alt="" />
          </span>
          <span className={styles.accentLine} />
        </span>
        <p className={styles.conclusion}>{conclusion}</p>
      </MotionReveal>
    </section>
  );
}
