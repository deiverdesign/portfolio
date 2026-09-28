"use client";

import styles from "./CarouselIndicatorsV3.module.css";

export interface CarouselIndicatorsV3Props {
  /** Número de páginas/pontos. */
  count: number;
  activeIndex: number;
  onSelect: (index: number) => void;
  /** Rótulo por ponto, ex.: (i) => `Página ${i + 1}`. */
  getLabel: (index: number) => string;
  className?: string;
}

/**
 * Figma: "Carousel Indicators", node 2299:71180 — dois estados (selected/
 * not selected), conferidos via get_variable_defs em 28/09/2026: selected
 * usa foreground/neutral/default sólido (preenchido), not-selected usa
 * border/neutral/overlay/dark/strong (contorno, já existe como
 * --color-border-neutral-overlay-dark-strong em tokens-v3.css).
 *
 * Reaproveitado por SelectedWorkV3 (que antes tinha um contador "01/05")
 * e substitui os "dots" caseiros do carrossel mobile de BrandsSectionV3.
 */
export function CarouselIndicatorsV3({
  count,
  activeIndex,
  onSelect,
  getLabel,
  className,
}: CarouselIndicatorsV3Props) {
  const classes = [styles.root, className].filter(Boolean).join(" ");

  return (
    <div className={classes} role="tablist">
      {Array.from({ length: count }, (_, index) => (
        <button
          key={index}
          type="button"
          role="tab"
          className={styles.dot}
          data-active={index === activeIndex ? "true" : undefined}
          aria-selected={index === activeIndex}
          aria-label={getLabel(index)}
          onClick={() => onSelect(index)}
        />
      ))}
    </div>
  );
}
