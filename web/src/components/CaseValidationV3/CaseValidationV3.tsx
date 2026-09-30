"use client";

import type { ReactNode } from "react";

import { ButtonV3 } from "@/components/ButtonV3/ButtonV3";
import { CarouselIndicatorsV3 } from "@/components/CarouselIndicatorsV3/CarouselIndicatorsV3";
import { EyebrowV3 } from "@/components/EyebrowV3/EyebrowV3";
import { IconV3 } from "@/components/IconV3/IconV3";
import { MotionReveal } from "@/components/MotionReveal/MotionReveal";
import type { RasterAsset } from "@/content/home-assets";
import { useRailCarousel } from "@/hooks/useRailCarousel";
import styles from "./CaseValidationV3.module.css";

export interface CaseValidationV3Card {
  banner: RasterAsset;
  name: string;
  questionLabel: string;
  question: string;
  testLabel: string;
  test: string;
  changedLabel: string;
  changed: string;
}

export interface CaseValidationV3Props {
  eyebrow: string;
  title: string;
  body: string;
  media: RasterAsset;
  /** Substitui o `<img>` padrão — usado pelo Intuit, cuja mídia é uma
   * composição (texto sobre fundo com ruído + imagem), não uma screenshot
   * simples. Quando presente, `media` só fornece as dimensões do slot. */
  mediaContent?: ReactNode;
  cards: CaseValidationV3Card[];
  conclusion: string;
}

/**
 * Figma: bloco "Usability Validation" do case (ex. SCRIOO node 2262:65858).
 * Carrossel de 2-3 cards (Question/Test/What changed) + citação de
 * fechamento. Rola por PÁGINA (largura do rail), não por card — mesmo
 * padrão de SelectedWorkV3/BrandsSectionV3. Uma primeira versão alinhava
 * o card clicado coladinho à esquerda por item; funcionava em telas
 * estreitas mas quebrava perto do fim do rail em telas largas com só 3
 * cards (não sobrava espaço de rolagem pra colar sem deixar vazio
 * depois) — ver comentário em useRailCarousel.
 */
export function CaseValidationV3({
  eyebrow,
  title,
  body,
  media,
  mediaContent,
  cards,
  conclusion,
}: CaseValidationV3Props) {
  // Lógica de scroll centralizada em useRailCarousel (não é gambiarra
  // local): mesmo componente vai ser copiado pros outros 4 cases, então
  // o fix precisa estar num lugar só pra não precisar ser reaplicado 4
  // vezes.
  const { railRef, activePage, pageCount, goToPage, scrollByPage, handleScroll } =
    useRailCarousel<HTMLDivElement>();

  return (
    <section className={styles.section}>
      <div className={styles.intro}>
        <div className={styles.text}>
          <EyebrowV3>{eyebrow}</EyebrowV3>
          <MotionReveal as="h2" className={styles.title} delayMs={80}>
            {title}
          </MotionReveal>
          <MotionReveal as="p" className={styles.body} delayMs={140}>
            {body}
          </MotionReveal>
        </div>
        <MotionReveal as="div" className={styles.media} delayMs={200} offsetPx={40}>
          {mediaContent ?? <img src={media.src} width={media.width} height={media.height} alt="" />}
        </MotionReveal>
      </div>

      <div className={styles.rail} ref={railRef} onScroll={handleScroll}>
        <ul className={styles.track}>
        {cards.map((card, index) => (
          <MotionReveal
            as="li"
            className={styles.card}
            key={card.name}
            delayMs={index * 80}
            offsetPx={40}
          >
            <img
              src={card.banner.src}
              width={card.banner.width}
              height={card.banner.height}
              alt=""
              className={styles.cardBanner}
            />
            <div className={styles.cardBody}>
              <h3 className={styles.cardName}>{card.name}</h3>
              <div className={styles.cardQuestion}>
                <span className={styles.cardLabel}>{card.questionLabel}</span>
                <p className={styles.cardValue}>{card.question}</p>
              </div>
              <div className={styles.cardDivider} aria-hidden="true" />
              <div className={styles.cardEvidence}>
                <div className={styles.cardColumn}>
                  <span className={styles.cardLabel}>{card.testLabel}</span>
                  <p className={styles.cardValue}>{card.test}</p>
                </div>
                <div className={styles.cardColumn}>
                  <span className={styles.cardLabel}>{card.changedLabel}</span>
                  <p className={styles.cardValue}>{card.changed}</p>
                </div>
              </div>
            </div>
          </MotionReveal>
        ))}
        </ul>
      </div>

      <div className={styles.controls}>
        <div className={styles.dots}>
          <CarouselIndicatorsV3
            count={pageCount}
            activeIndex={activePage}
            onSelect={goToPage}
            getLabel={(index) => `Page ${index + 1}`}
          />
        </div>
        <div className={styles.arrows}>
          <ButtonV3
            variant="secondary"
            size="medium"
            className={styles.arrowButton}
            onClick={() => scrollByPage(-1)}
            disabled={activePage === 0}
            aria-label="Previous"
          >
            <IconV3 name="arrow-left" size={20} />
          </ButtonV3>
          <ButtonV3
            variant="secondary"
            size="medium"
            className={styles.arrowButton}
            onClick={() => scrollByPage(1)}
            disabled={activePage === pageCount - 1}
            aria-label="Next"
          >
            <IconV3 name="arrow-right" size={20} />
          </ButtonV3>
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
