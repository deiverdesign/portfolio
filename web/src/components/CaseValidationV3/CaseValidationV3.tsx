"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { ButtonV3 } from "@/components/ButtonV3/ButtonV3";
import { CarouselIndicatorsV3 } from "@/components/CarouselIndicatorsV3/CarouselIndicatorsV3";
import { EyebrowV3 } from "@/components/EyebrowV3/EyebrowV3";
import { IconV3 } from "@/components/IconV3/IconV3";
import type { RasterAsset } from "@/content/home-assets";
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
  cards: CaseValidationV3Card[];
  conclusion: string;
}

/**
 * Figma: bloco "Usability Validation" do case (ex. SCRIOO node 2262:65858).
 * Carrossel de 2-3 cards (Question/Test/What changed) + citação de
 * fechamento. Mesmo padrão de rail com dots + prev/next já usado em
 * `SelectedWorkV3`/`BrandsSectionV3`, aqui com 1 página por card (são
 * poucos itens, diferente das 13 marcas do Brands).
 */
export function CaseValidationV3({ eyebrow, title, body, media, cards, conclusion }: CaseValidationV3Props) {
  const railRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<number | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  /* offsetLeft por si só não é confiável aqui: o offsetParent do <li>
     não é o .rail que rola (é o BODY, já que nenhum ancestro entre eles
     tem position:relative), então offsetLeft inclui deslocamentos que
     não fazem parte da área de scroll — medido ao vivo: um card que
     devia parar em 698px parava em 752px, sempre cortado dos dois
     lados depois de "Next" (mesma classe de bug que o rail do Home já
     teve). getBoundingClientRect(), relativo ao próprio .rail, dá a
     posição real dentro do scroll, sempre. */
  const itemLeftInRail = (rail: HTMLElement, item: HTMLElement) =>
    item.getBoundingClientRect().left - rail.getBoundingClientRect().left + rail.scrollLeft;

  const updateActiveIndex = useCallback(() => {
    const rail = railRef.current;
    if (!rail) return;
    const items = Array.from(rail.querySelectorAll("li")) as HTMLElement[];
    const { scrollLeft } = rail;
    let closest = 0;
    let closestDistance = Number.POSITIVE_INFINITY;
    items.forEach((item, index) => {
      const distance = Math.abs(itemLeftInRail(rail, item) - scrollLeft);
      if (distance < closestDistance) {
        closestDistance = distance;
        closest = index;
      }
    });
    setActiveIndex(closest);
  }, []);

  useEffect(
    () => () => {
      if (frameRef.current !== null) cancelAnimationFrame(frameRef.current);
    },
    [],
  );

  const handleScroll = () => {
    if (frameRef.current !== null) cancelAnimationFrame(frameRef.current);
    frameRef.current = requestAnimationFrame(updateActiveIndex);
  };

  const moveTo = (index: number) => {
    const rail = railRef.current;
    if (!rail) return;
    const items = rail.querySelectorAll("li");
    const item = items[index] as HTMLElement | undefined;
    if (!item) return;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    rail.scrollTo({ left: itemLeftInRail(rail, item), behavior: reducedMotion ? "auto" : "smooth" });
    setActiveIndex(index);
  };

  return (
    <section className={styles.section}>
      <div className={styles.intro}>
        <div className={styles.text}>
          <EyebrowV3>{eyebrow}</EyebrowV3>
          <h2 className={styles.title}>{title}</h2>
          <p className={styles.body}>{body}</p>
        </div>
        <img
          src={media.src}
          width={media.width}
          height={media.height}
          alt=""
          className={styles.media}
        />
      </div>

      <div className={styles.rail} ref={railRef} onScroll={handleScroll}>
        <ul className={styles.track}>
        {cards.map((card) => (
          <li className={styles.card} key={card.name}>
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
          </li>
        ))}
        </ul>
      </div>

      <div className={styles.controls}>
        <div className={styles.dots}>
          <CarouselIndicatorsV3
            count={cards.length}
            activeIndex={activeIndex}
            onSelect={moveTo}
            getLabel={(index) => cards[index]?.name ?? `${index + 1}`}
          />
        </div>
        <div className={styles.arrows}>
          <ButtonV3
            variant="secondary"
            size="medium"
            onClick={() => moveTo(Math.max(0, activeIndex - 1))}
            disabled={activeIndex === 0}
            aria-label="Previous"
          >
            <IconV3 name="arrow-left" size={16} />
          </ButtonV3>
          <ButtonV3
            variant="secondary"
            size="medium"
            onClick={() => moveTo(Math.min(cards.length - 1, activeIndex + 1))}
            disabled={activeIndex === cards.length - 1}
            aria-label="Next"
          >
            <IconV3 name="arrow-right" size={16} />
          </ButtonV3>
        </div>
      </div>

      <p className={styles.conclusion}>{conclusion}</p>
    </section>
  );
}
