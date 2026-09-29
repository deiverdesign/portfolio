"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/**
 * offsetLeft por si só não é confiável pra medir a posição de um item
 * dentro de um rail que rola: ele é relativo ao offsetParent do
 * elemento, que só é o próprio rail se algum ancestro entre os dois
 * tiver position:relative — fácil de quebrar sem querer numa
 * refatoração de CSS, e sem erro nenhum no console quando quebra.
 * Achado ao vivo no CaseValidationV3 em 29/09/2026: um card que devia
 * parar em 698px parava em 752px, sempre cortado dos dois lados depois
 * de "Next". getBoundingClientRect(), relativo ao próprio rail, dá a
 * posição real dentro da área de scroll, sempre — não depende de
 * nenhum ancestro ter position:relative.
 */
function itemLeftInRail(rail: HTMLElement, item: HTMLElement) {
  return item.getBoundingClientRect().left - rail.getBoundingClientRect().left + rail.scrollLeft;
}

/**
 * Estado + navegação de um rail horizontal paginado por item (1 "página"
 * = 1 item, ex. os cards do CaseValidationV3) — não confundir com o
 * padrão de página = rail.clientWidth do SelectedWorkV3/BrandsSectionV3,
 * que rola por tela cheia, não por item. `itemSelector` é relativo ao
 * elemento que a ref é anexada (o rail que tem overflow-x:auto).
 */
export function useRailCarousel<T extends HTMLElement = HTMLDivElement>(itemSelector: string) {
  const railRef = useRef<T | null>(null);
  const frameRef = useRef<number | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const getItems = useCallback((): HTMLElement[] => {
    const rail = railRef.current;
    if (!rail) return [];
    return Array.from(rail.querySelectorAll<HTMLElement>(itemSelector));
  }, [itemSelector]);

  const updateActiveIndex = useCallback(() => {
    const rail = railRef.current;
    if (!rail) return;
    const items = getItems();
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
  }, [getItems]);

  useEffect(
    () => () => {
      if (frameRef.current !== null) cancelAnimationFrame(frameRef.current);
    },
    [],
  );

  const handleScroll = useCallback(() => {
    if (frameRef.current !== null) cancelAnimationFrame(frameRef.current);
    frameRef.current = requestAnimationFrame(updateActiveIndex);
  }, [updateActiveIndex]);

  const moveTo = useCallback(
    (index: number) => {
      const rail = railRef.current;
      const item = getItems()[index];
      if (!rail || !item) return;
      const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      rail.scrollTo({ left: itemLeftInRail(rail, item), behavior: reducedMotion ? "auto" : "smooth" });
      setActiveIndex(index);
    },
    [getItems],
  );

  return { railRef, activeIndex, moveTo, handleScroll };
}
