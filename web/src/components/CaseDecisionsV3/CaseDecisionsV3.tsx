"use client";

import { useState } from "react";

import type { Locale } from "@/content/i18n";
import { getCopy } from "@/content/site-copy";
import { EyebrowV3 } from "@/components/EyebrowV3/EyebrowV3";
import { IconV3 } from "@/components/IconV3/IconV3";
import { MotionReveal } from "@/components/MotionReveal/MotionReveal";
import styles from "./CaseDecisionsV3.module.css";

export interface CaseDecisionsV3Item {
  title: string;
  problem: string;
  proposal: string;
  argument: string;
  media: { src: string; width: number; height: number };
}

export interface CaseDecisionsV3Props {
  locale: Locale;
  eyebrow: string;
  title: string;
  items: CaseDecisionsV3Item[];
  /** Alguns cases têm uma única evidência grande, sem a faixa de miniaturas. */
  showThumbnails?: boolean;
  /** Quando as imagens de apoio não mapeiam 1:1 para os itens do acordeão. */
  mediaThumbnails?: CaseDecisionsV3Item["media"][];
}

/**
 * Figma: bloco "Decisions" do case (ex. SCRIOO node 2262:65858). Formato
 * Problem/Proposal/Argument em acordeão, só o primeiro aberto — confirmado
 * pelo Deiver em 29/09/2026: o frame do Figma mostra os 3 abertos só pra
 * facilitar a leitura do conteúdo, não é o estado real do produto.
 *
 * Media: composição estática de uma imagem principal e duas miniaturas;
 * ela não responde ao estado do acordeão.
 */
export function CaseDecisionsV3({ locale, eyebrow, title, items, showThumbnails = true, mediaThumbnails }: CaseDecisionsV3Props) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const active = items[0];
  const thumbnails = mediaThumbnails ? mediaThumbnails.map((media) => ({ media })) : items.slice(1);

  return (
    <section className={styles.section}>
      <header className={styles.header}>
        <EyebrowV3>{eyebrow}</EyebrowV3>
        <MotionReveal as="h2" className={styles.title} delayMs={80}>
          {title}
        </MotionReveal>
      </header>

      <div className={styles.grid}>
        <MotionReveal as="div" className={styles.mediaColumn} delayMs={80} offsetPx={40}>
          <img
            src={active.media.src}
            width={active.media.width}
            height={active.media.height}
            alt=""
            className={styles.mediaMain}
          />
          {showThumbnails && thumbnails.length > 0 && (
            <div className={styles.mediaThumbs}>
              {thumbnails.map((item) => (
                <div
                  key={item.media.src}
                  className={styles.mediaThumbContainer}
                >
                  <img
                    src={item.media.src}
                    width={item.media.width}
                    height={item.media.height}
                    alt=""
                    className={styles.mediaThumb}
                  />
                </div>
              ))}
            </div>
          )}
        </MotionReveal>

        <div className={styles.accordion}>
          {items.map((item, index) => {
            const isOpen = index === openIndex;
            const panelId = `case-decision-panel-${index}`;
            const buttonId = `case-decision-button-${index}`;
            return (
              <MotionReveal
                as="div"
                className={styles.item}
                key={item.title}
                data-open={isOpen}
                delayMs={80 + index * 80}
              >
                <h3 className={styles.itemHeading}>
                  <button
                    type="button"
                    id={buttonId}
                    className={styles.itemButton}
                    aria-expanded={isOpen}
                    aria-controls={panelId}
                    onClick={() => {
                      setOpenIndex((current) => (current === index ? null : index));
                    }}
                  >
                    <span className={styles.activeIndicator} aria-hidden="true" />
                    <span className={styles.itemTitle}>{item.title}</span>
                    <span className={styles.caretSlot} aria-hidden="true">
                      <IconV3
                        name="caret-down"
                        size={20}
                        className={styles.caret}
                      />
                    </span>
                  </button>
                </h3>
                <div
                  className={styles.itemBody}
                  id={panelId}
                  role="region"
                  aria-labelledby={buttonId}
                  aria-hidden={!isOpen}
                  data-open={isOpen}
                >
                  <p>
                    <strong>{getCopy(locale, "shared.case.decision.problem")}</strong> {item.problem}
                  </p>
                  <p>
                    <strong>{getCopy(locale, "shared.case.decision.proposal")}</strong> {item.proposal}
                  </p>
                  <p>
                    <strong>{getCopy(locale, "shared.case.decision.argument")}</strong> {item.argument}
                  </p>
                </div>
              </MotionReveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
