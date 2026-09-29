"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Rola por PÁGINA (a própria largura do rail), não por item — mesmo
 * padrão já usado em SelectedWorkV3/BrandsSectionV3. Substituiu uma
 * primeira versão que alinhava o item clicado coladinho à esquerda
 * (via getBoundingClientRect, corrigindo um bug de offsetLeft) — essa
 * abordagem por item quebrava de um jeito NOVO com poucos itens numa
 * tela larga: perto do fim do rail não sobra espaço de rolagem
 * suficiente pra colar o item clicado à esquerda sem deixar vazio
 * depois dele, e o navegador trava o scroll no máximo possível — o
 * item pousa flutuando no meio, com uma tira do anterior vazando pela
 * borda (achado do Deiver em 29/09/2026, reproduzido em 1365px e no
 * mobile 405px). Rolar por página elimina essa classe de bug inteira:
 * a posição final é sempre 0, o máximo, ou uma fração exata entre os
 * dois — nunca um valor "travado no meio".
 */
export function useRailCarousel<T extends HTMLElement = HTMLDivElement>() {
  const railRef = useRef<T | null>(null);
  const frameRef = useRef<number | null>(null);
  const [activePage, setActivePage] = useState(0);
  const [pageCount, setPageCount] = useState(1);

  const updateState = useCallback(() => {
    const rail = railRef.current;
    if (!rail) return;
    const maxScrollLeft = rail.scrollWidth - rail.clientWidth;
    const pages = Math.max(1, Math.ceil(rail.scrollWidth / rail.clientWidth));
    setPageCount(pages);
    setActivePage(maxScrollLeft > 0 ? Math.round((rail.scrollLeft / maxScrollLeft) * (pages - 1)) : 0);
  }, []);

  // Mede a largura real do rail só depois do primeiro layout — sem isso
  // pageCount ficava preso no valor inicial (1).
  useEffect(() => {
    updateState();
  }, [updateState]);

  useEffect(
    () => () => {
      if (frameRef.current !== null) cancelAnimationFrame(frameRef.current);
    },
    [],
  );

  const handleScroll = useCallback(() => {
    if (frameRef.current !== null) cancelAnimationFrame(frameRef.current);
    frameRef.current = requestAnimationFrame(updateState);
  }, [updateState]);

  const goToPage = useCallback(
    (page: number) => {
      const rail = railRef.current;
      if (!rail) return;
      const maxScrollLeft = rail.scrollWidth - rail.clientWidth;
      const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      rail.scrollTo({
        left: maxScrollLeft * (page / Math.max(1, pageCount - 1)),
        behavior: reducedMotion ? "auto" : "smooth",
      });
      setActivePage(page);
    },
    [pageCount],
  );

  const scrollByPage = useCallback((direction: 1 | -1) => {
    const rail = railRef.current;
    if (!rail) return;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    rail.scrollBy({ left: direction * rail.clientWidth, behavior: reducedMotion ? "auto" : "smooth" });
  }, []);

  return { railRef, activePage, pageCount, goToPage, scrollByPage, handleScroll };
}
