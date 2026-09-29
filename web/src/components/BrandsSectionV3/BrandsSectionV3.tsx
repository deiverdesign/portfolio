"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import type { Locale } from "@/content/i18n";
import { getCopy } from "@/content/site-copy";
import {
  HOME_ASSETS,
  getHomeBrandLogo,
  HOME_BRAND_LOGO_SIZE,
  type HomeBrand,
} from "@/content/home-assets";
import { ButtonV3 } from "@/components/ButtonV3/ButtonV3";
import { IconV3 } from "@/components/IconV3/IconV3";
import { SectionEntryV3 } from "@/components/SectionEntryV3/SectionEntryV3";
import styles from "./BrandsSectionV3.module.css";

export interface BrandsSectionV3Props {
  locale: Locale;
  className?: string;
}

/**
 * Ordem e conjunto conferidos no Figma (node 2262:61790, "Frame 475"): são
 * 10 dos 13 logos de cliente, nesta ordem específica — não é a lista
 * completa de `HOME_BRANDS` nem ordem alfabética.
 */
const BRANDS: HomeBrand[] = [
  "intuit",
  "hp",
  "mccormick",
  "hss",
  "softplan",
  "cirrus",
  "scrioo",
  "lightship",
  "track-and-field",
  "unimed",
];

/** Confirmado no Figma mobile (node 2262:62230, "Navigation - Case
 * navigation"): 3 indicadores de página, não um por logo. */
const MOBILE_DOT_COUNT = 3;

/**
 * Escala uniforme sobre `HOME_BRAND_LOGO_SIZE` (tamanho do componente raiz
 * no Figma) pra chegar no tamanho renderizado aqui. Medida em 28/09/2026
 * comparando o root (node 741:2636) com os cards reais desta seção no
 * Figma (node 2262:61790): Intuit e HP bateram os dois em ×1.3 — por isso
 * um valor só, não um por logo. Mesma lógica usada no CaseCardLargeV3, que
 * mede ×1.2 sobre o mesmo root (contextos diferentes, escalas diferentes).
 */
const LOGO_SCALE = 1.3;

/**
 * Figma: "Brands I've worked with", node 2262:61790 (Desktop, 1348px) e
 * 2262:62214 (Mobile, 340px) — conferidos em 28/09/2026, não aproximado.
 *
 * Tamanho ótico dos logos: usa `HOME_BRAND_LOGO_SIZE` (tamanho real de
 * cada logo, calibrado pelo Deiver no componente raiz do Figma) × 1.3
 * (`LOGO_SCALE`). Substituiu, em 28/09/2026, um sistema anterior de só 2
 * categorias ("mark"/"wordmark" com uma altura fixa por categoria) que
 * tratava todo wordmark como do mesmo tamanho óptico — o Track & Field,
 * bem mais quadrado que Intuit/Unimed, saía visivelmente menor que devia
 * (achado do Deiver comparando com o Figma atualizado). Com
 * largura E altura explícitas por logo, cada um sai exatamente na
 * proporção calibrada, sem aproximação por categoria. A escala é
 * reduzida (não descartada) no breakpoint mobile via `--brands-logo-scale`
 * no CSS, pra caber no card menor sem perder a proporção entre os 10.
 *
 * Achado do Deiver em 28/09 (comparando com o PDF de referência dele, não
 * só a imagem estática): no mobile a grade NÃO quebra linha — vira um
 * grid de 2 linhas que sangra pra fora da tela (927px de conteúdo dentro
 * de um container de 340px no Figma), navegável por scroll horizontal,
 * com indicadores de página e botões anterior/próximo — mesmo padrão já
 * usado no `SelectedWorkV3`. Os controles abaixo só aparecem
 * visualmente no mobile (CSS), mas o componente sempre os renderiza.
 */
export function BrandsSectionV3({ locale, className }: BrandsSectionV3Props) {
  const classes = className ? `${styles.root} ${className}` : styles.root;
  const gridRef = useRef<HTMLUListElement>(null);
  const frameRef = useRef<number | null>(null);
  const [activeDot, setActiveDot] = useState(0);

  const updateActiveDot = useCallback(() => {
    const grid = gridRef.current;
    if (!grid) return;
    const maxScroll = grid.scrollWidth - grid.clientWidth;
    if (maxScroll <= 0) {
      setActiveDot(0);
      return;
    }
    const ratio = grid.scrollLeft / maxScroll;
    setActiveDot(Math.round(ratio * (MOBILE_DOT_COUNT - 1)));
  }, []);

  useEffect(
    () => () => {
      if (frameRef.current !== null) cancelAnimationFrame(frameRef.current);
    },
    [],
  );

  const handleScroll = () => {
    if (frameRef.current !== null) cancelAnimationFrame(frameRef.current);
    frameRef.current = requestAnimationFrame(updateActiveDot);
  };

  const moveToDot = (dotIndex: number) => {
    const grid = gridRef.current;
    if (!grid) return;
    const maxScroll = grid.scrollWidth - grid.clientWidth;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    grid.scrollTo({
      left: maxScroll * (dotIndex / (MOBILE_DOT_COUNT - 1)),
      behavior: reducedMotion ? "auto" : "smooth",
    });
    setActiveDot(dotIndex);
  };

  return (
    <section className={classes} aria-labelledby="brands-section-title">
      <div className={styles.container}>
        {/* Achado do Deiver em 28/09/2026: o asset já estava baixado e
            registrado em HOME_ASSETS.decorative desde a auditoria de
            27/09, mas nunca tinha sido colocado no JSX de nenhum
            componente — ficou "órfão". Posição vem do Figma real (node
            2262:61785, "Hexagon-pattern-decorative"), medida relativa ao
            node 2262:61790 ("Frame 475", = este .container), não
            aproximada — ver `.hexagon` no CSS. */}
        <img
          src={HOME_ASSETS.decorative.hexagonPattern}
          alt=""
          aria-hidden="true"
          className={styles.hexagon}
        />
        <SectionEntryV3 className={styles.header}>
          <h2 id="brands-section-title" className={styles.title} data-motion-part="title">
            {getCopy(locale, "home.brands.title")}
          </h2>
          <p className={styles.subtitle} data-motion-part="body">
            {getCopy(locale, "home.brands.subtitle")}
          </p>
        </SectionEntryV3>
        <ul ref={gridRef} className={styles.grid} onScroll={handleScroll}>
          {BRANDS.map((brand) => {
            const size = HOME_BRAND_LOGO_SIZE[brand];
            return (
              <li key={brand} className={styles.card}>
                <img
                  src={getHomeBrandLogo(brand, "original")}
                  alt={brand}
                  className={styles.logo}
                  style={{
                    width: `calc(${size.width * LOGO_SCALE}px * var(--brands-logo-scale, 1))`,
                    height: `calc(${size.height * LOGO_SCALE}px * var(--brands-logo-scale, 1))`,
                  }}
                />
              </li>
            );
          })}
        </ul>
        <div className={styles.mobileNav} aria-hidden={false}>
          <div className={styles.dots}>
            {Array.from({ length: MOBILE_DOT_COUNT }, (_, index) => (
              <button
                key={index}
                type="button"
                className={index === activeDot ? styles.dotActive : styles.dot}
                aria-label={`${locale === "pt" ? "Página" : "Page"} ${index + 1}`}
                onClick={() => moveToDot(index)}
              />
            ))}
          </div>
          <div className={styles.controls}>
            <ButtonV3
              variant="secondary"
              className={styles.control}
              aria-label={locale === "pt" ? "Anterior" : "Previous"}
              disabled={activeDot === 0}
              onClick={() => moveToDot(Math.max(0, activeDot - 1))}
            >
              <IconV3 name="arrow-left" size={16} />
            </ButtonV3>
            <ButtonV3
              variant="secondary"
              className={styles.control}
              aria-label={locale === "pt" ? "Próximo" : "Next"}
              disabled={activeDot === MOBILE_DOT_COUNT - 1}
              onClick={() => moveToDot(Math.min(MOBILE_DOT_COUNT - 1, activeDot + 1))}
            >
              <IconV3 name="arrow-right" size={16} />
            </ButtonV3>
          </div>
        </div>
      </div>
    </section>
  );
}
